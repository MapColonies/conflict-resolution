import {
    Controller, Get, Query, Param, NotFoundException, Post, Body, Put, Delete, HttpStatus,
    InternalServerErrorException, BadRequestException, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

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
import { GeojsonValidationPipe } from 'src/shared/geojson-validation.pipe';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { OrderByValidationPipe } from 'src/shared/order-by-validation.pipe';
import tableNames = require('../global/services/postgres/table-names');

// TODO: add bbox endpoint
@ApiTags('conflicts')
@Controller('conflicts')
export class ConflictsController {
    constructor(private responseHelper: ResponseHelperService,
        private readonly conflictsService: ConflictsService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        required: false,
        type: ConflictQueryDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Query is invalid.'
    })
    async queryConflicts(@Body(new GeojsonValidationPipe('geojson')) body?: ConflictQueryDto,
        @Query(new OrderByValidationPipe([tableNames.conflicts])) orderByOptions?: OrderByOptions): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        const { page, limit, from, to, geojson, keywords, resolved } = body;
        const conflictQueryParams = new ConflictQueryParams(
            from,
            to,
            geojson,
            keywords,
            resolved
        );
        const result = await this.conflictsService.query(
            conflictQueryParams,
            new PaginationConfig(page, limit),
            orderByOptions
        );
        return this.responseHelper.success(result);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    // TODO: should create type for TextSearchDto + OrderByOptions?
    async searchConflicts(@Query() query: TextSearchDto, @Query(new OrderByValidationPipe([tableNames.conflicts])) orderByOptions?: OrderByOptions): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        const result = await this.conflictsService.search(query.text, new PaginationConfig(query.page, query.limit), orderByOptions);
        return this.responseHelper.success(result);
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: Conflict
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
    async getConflictById(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse<Conflict>> {
        const conflict = await this.conflictsService.getById(id);
        if (!conflict) {
            throw new NotFoundException(null, 'Conflict could not be found.');
        }
        return this.responseHelper.success(conflict);
    }

    @Post('create')
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Conflict
    })
    async createConflict(@Body(new GeojsonValidationPipe('location')) conflictDto: ConflictDto): Promise<ApiHttpResponse<Conflict>> {
        const createdConflict = await this.conflictsService.create(conflictDto);
        return this.responseHelper.success(createdConflict, HttpStatus.CREATED);
    }

    @Put(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: Conflict
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
    async updateConflict(@Param('id', ParseUUIDPipe) id: string, @Body(new GeojsonValidationPipe('location')) conflictDto: ConflictDto): Promise<ApiHttpResponse<Conflict>> {
        const updatedConflict = await this.conflictsService.update(id, conflictDto);
        if (!updatedConflict) {
            throw new NotFoundException();
        }
        return this.responseHelper.success(updatedConflict);
    }

    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApiHttpResponse
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
    async deleteConflict(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse> {
        const exists = await this.conflictsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        const isDeleted = await this.conflictsService.delete(id);
        if (!isDeleted) {
            throw new InternalServerErrorException(exists, 'Could not delete conflic. Please try again.');
        }
        return this.responseHelper.success('Conflict deleted');
    }

    @Post('resolve/:id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        type: Conflict
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
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

        return this.responseHelper.success(await this.conflictsService.getById(id));
    }
}