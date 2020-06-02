import { Controller, Get, Query, Param, NotFoundException, Post, Body, Put, Delete, HttpStatus, 
     InternalServerErrorException, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ApiHttpResponse } from '../global/models/common/api-http-response';
import { ConflictsService } from './conflicts.service';
import { Conflict } from './models/conflict';
import { PaginationResult } from '../global/models/pagination-result';
import { ConflictDto } from './models/conflict-dto';
import { ConflictQueryParams } from 'src/conflicts/models/conflict-query-params';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { ConflictQueryDto } from 'src/conflicts/models/conflict-query-dto';
import { ResolveDto } from 'src/resolutions/models/resolve-dto';
import { TextSearchDto } from '../global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';

@ApiTags('conflicts')
@Controller('conflicts')
export class ConflictsController {
    constructor(private responseHelper: ResponseHelperService, 
        private readonly conflictsService: ConflictsService) { }

    @Get()
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    @ApiResponse({ status: 400, description: 'Query is invalid.'})
    async searchConflicts(@Query() query: ConflictQueryDto): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        const { page, limit, from, to, coordinates, keywords, resolved } = query;
        const conflictQueryParams = new ConflictQueryParams(
            from,
            to,
            coordinates,
            keywords,
            resolved
        );
        const result = await this.conflictsService.query(
            conflictQueryParams,
            new PaginationConfig(page, limit)
        );
        return this.responseHelper.ok(result);
    }

    @Get('search')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async filterConflicts(@Query() query: TextSearchDto): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        const result = await this.conflictsService.search(query.text, new PaginationConfig(query.page, query.limit));
        return this.responseHelper.ok(result);
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 404, description: 'Not found.'})
    async getConflictById(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse<Conflict>> {
        const conflict = await this.conflictsService.getById(id);
        if (!conflict) {
            throw new NotFoundException(null, 'Conflict could not be found.');
        }
        return this.responseHelper.ok(conflict);
    }

    @Post()
    @ApiResponse({
        status: 201,
        type: Conflict
    })
    async createConflict(@Body() conflictDto: ConflictDto): Promise<ApiHttpResponse<Conflict>> {
        const createdConflict = await this.conflictsService.create(conflictDto);
        return this.responseHelper.ok(createdConflict, HttpStatus.CREATED);
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async updateConflict(@Param('id', ParseUUIDPipe) id: string, @Body() conflictDto: ConflictDto): Promise<ApiHttpResponse<Conflict>> {
        const updatedConflict = await this.conflictsService.update(id, conflictDto);
        if (!updatedConflict) {
            throw new NotFoundException();
        }
        return this.responseHelper.ok(updatedConflict);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: ApiHttpResponse
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async deleteConflict(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse> {
        const exists = await this.conflictsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        const isDeleted = await this.conflictsService.delete(id);
        if (!isDeleted) {
            throw new InternalServerErrorException(exists, 'Could not delete conflic. Please try again.');
        }
        return this.responseHelper.ok('Conflict deleted');
    }

    @Post('resolve/:id')
    @ApiResponse({
        status: 200,
        type: Conflict
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async resolveConflict(@Param('id', ParseUUIDPipe) id: string, @Body() body: ResolveDto): Promise<ApiHttpResponse<Conflict>> {
        const conflict = await this.conflictsService.getById(id, false);
        if (!conflict) {
            throw new NotFoundException();
        }
        if (conflict.has_resolved) {
            throw new BadRequestException(null, 'Conflict was already resolved.')
        }
        const { selectedServer, resolvedBy } = body;
        // TODO: refactor
        let winner: { server: string, entity: object };
        if (conflict.source_server === selectedServer) {
            winner = {
                server: conflict.source_server,
                entity: conflict.source_entity,
            };
        }
        if (conflict.target_server === selectedServer) {
            winner = {
                server: conflict.target_server,
                entity: conflict.target_entity,
            };
        }
        if (!winner) {
            throw new BadRequestException(null, 'invalid selection.')
        }
        
        await this.conflictsService.resolve(conflict, {
            resolution_server: winner.server,
            resolution_entity: winner.entity,
            conflict_id: id,
            resolved_by: resolvedBy
        });

        return this.responseHelper.ok(await this.conflictsService.getById(id));
    }
}