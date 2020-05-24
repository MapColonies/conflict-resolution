/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Get, Query, Param, NotFoundException, Post, Body, Put, Delete,
     InternalServerErrorException, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ConflictService } from './conflict.service';
import { Conflict } from './models/conflict';
import { PaginationResult } from '../global/models/pagination-result';
import { ConflictDto } from './models/conflict-dto';
import { ConflictQueryParams } from 'src/conflict/models/conflict-query-params';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';
import { ConflictQueryDto } from 'src/conflict/models/conflict-query-dto';
import { HttpResponse } from 'src/global/models/http-response';
import { ResolveDto } from 'src/result/models/resolve-dto';

@ApiTags('conflict')
@Controller('conflict')
export class ConflictController {
    constructor(private readonly conflictService: ConflictService) { }

    @Get('all')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async getAllConflicts(@Query() query: PaginationQueryDto): Promise<PaginationResult<Conflict>> {
        console.log(query)
        return await this.conflictService.getAll(new PaginationConfig(query.page, query.limit));
    }

    @Get('search')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    @ApiResponse({ status: 400, description: 'Query is invalid.'})
    async searchConflicts(@Query() query: ConflictQueryDto): Promise<PaginationResult<Conflict>> {
        const { page, limit, from, to, coordinates, keywords, resolved } = query;
        const conflictQueryParams = new ConflictQueryParams(
            from,
            to,
            coordinates,
            keywords,
            resolved
        );
        return await this.conflictService.search(
            conflictQueryParams,
            new PaginationConfig(page, limit)
        );
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 404, description: 'Not found.'})
    async getConflictById(@Param('id', ParseUUIDPipe) id: string): Promise<Conflict> {
        const conflict = await this.conflictService.getById(id);
        if (!conflict) {
            throw new NotFoundException(null, 'Conflict could not be found.');
        }
        return conflict;
    }

    @Post()
    @ApiResponse({
        status: 201,
        type: Conflict
    })
    async createConflict(@Body() conflictDto: ConflictDto): Promise<Conflict> {
        const createdConflict = await this.conflictService.create(conflictDto);
        return createdConflict;
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async updateConflict(@Param('id', ParseUUIDPipe) id: string, @Body() conflictDto: ConflictDto): Promise<Conflict> {
        const updatedConflict = await this.conflictService.update(id, conflictDto);
        if (!updatedConflict) {
            throw new NotFoundException();
        }
        return updatedConflict;
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: HttpResponse
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async deleteConflict(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const exists = await this.conflictService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        const isDeleted = await this.conflictService.delete(id);
        if (!isDeleted) {
            throw new InternalServerErrorException(exists, 'Could not delete conflic. Please try again.');
        }
        return new HttpResponse('Conflict deleted.')
    }

    @Post(':id/resolve')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async resolveConflict(@Param('id', ParseUUIDPipe) id: string, @Body() body: ResolveDto): Promise<Conflict> {
        const conflict = await this.conflictService.getById(id, false);
        if (!conflict) {
            throw new NotFoundException();
        }
        if (conflict.has_resolved) {
            throw new BadRequestException(null, 'Conflict was already resolved.')
        }
        const { selectedServer, resolvedBy } = body;
        // TODO: refactor
        let winner: { server: string, entity: string };
        if (conflict.requesting_server === selectedServer) {
            winner = {
                server: conflict.requesting_server,
                entity: conflict.requesting_entity,
            };
        }
        if (conflict.requested_server === selectedServer) {
            winner = {
                server: conflict.requested_server,
                entity: conflict.requested_entity,
            };
        }
        if (!winner) {
            throw new BadRequestException(null, 'invalid selection.')
        }
        
        await this.conflictService.resolve(conflict, {
            result_server: winner.server,
            result_entity: winner.entity,
            conflict_id: id,
            resolved_by: resolvedBy
        });

        return await this.conflictService.getById(id);
    }
}