import {
    Controller, Get, Query, Param, NotFoundException, Post, Body, Put, Delete, HttpStatus,
    InternalServerErrorException, BadRequestException, ParseUUIDPipe, HttpCode
} from '@nestjs/common';
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
import { TextSearchPaginationDto } from '../global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';
import { GeojsonValidationPipe } from 'src/shared/geojson-validation.pipe';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { OrderByValidationPipe } from 'src/shared/order-by-validation.pipe';
import tableNames = require('../global/services/postgres/table-names');
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';

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
        @Query(new OrderByValidationPipe([tableNames.conflicts])) query?: any,
        @Query() paginationQueryDto?: PaginationQueryDto,
        @Query() orderByOptions?: OrderByOptions): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        const { from, to, geojson, keywords, resolved } = body;
        const { page, limit } = paginationQueryDto;
        const conflictQueryParams = new ConflictQueryParams(
            from,
            to,
            geojson,
            keywords,
            resolved
        );
        orderByOptions = query?.validOrderByOptions;
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
    async searchConflicts(@Query() textSearchDto: TextSearchPaginationDto, @Query(new OrderByValidationPipe([tableNames.conflicts])) query?: any,
    @Query() orderByOptions?: OrderByOptions): Promise<ApiHttpResponse<PaginationResult<Conflict>>> {
        orderByOptions = query?.validOrderByOptions;
        const result = await this.conflictsService.search(textSearchDto.text, new PaginationConfig(textSearchDto.page, textSearchDto.limit), orderByOptions);
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
        if (conflict.hasResolved) {
            throw new BadRequestException(null, 'Conflict was already resolved.')
        }
        const { selectedServer, resolvedBy } = body;
        // TODO: refactor
        let winner: { server: string, entity: object };
        if (conflict.sourceServer === selectedServer) {
            winner = {
                server: conflict.sourceServer,
                entity: conflict.sourceEntity,
            };
        }
        if (conflict.targetServer === selectedServer) {
            winner = {
                server: conflict.targetServer,
                entity: conflict.targetEntity,
            };
        }
        if (!winner) {
            throw new BadRequestException(null, 'invalid selection.')
        }

        await this.conflictsService.resolve(conflict, {
            resolutionServer: winner.server,
            resolutionEntity: winner.entity,
            conflictId: id,
            resolvedBy: resolvedBy
        });

        return this.responseHelper.success(await this.conflictsService.getById(id));
    }
}