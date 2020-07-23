import { Controller, Get, Post, Query, Param, NotFoundException, Delete, ParseUUIDPipe, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

import { ResolutionsService } from './resolutions.service';
import { PaginationResult } from '../global/models/pagination-result';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { ResolutionTextSearchDto } from 'src/global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';
import { ApiHttpResponse } from 'src/global/models/common/api-http-response';
import { OrderByValidationPipe } from 'src/shared/order-by-validation.pipe';
import tableNames = require('../global/services/postgres/table-names');
import { BaseResolution } from './models/base-resolution';
import { Resolution } from './models/resolution';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { ResolutionQueryDto } from './models/resolution-query-dto';
import { GeojsonValidationPipe } from 'src/shared/geojson-validation.pipe';
import { ResolutionQueryParams } from './models/resolution-query-params';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';

@ApiTags('resolutions')
@Controller('resolutions')
export class ResolutionsController {
    constructor(private responseHelper: ResponseHelperService, 
        private readonly resolutionsService: ResolutionsService) { }

    // FIXME: example consists PaginationResult<Conflict>
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        required: false,
        type: ResolutionQueryDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Query is invalid.'
    })
    async getAllResolutions(@Body(new GeojsonValidationPipe('geojson')) body?: ResolutionQueryDto,
     @Query(new OrderByValidationPipe([tableNames.resolutions, tableNames.conflicts])) query?: any,
      @Query() orderByOptions?: OrderByOptions, @Query() paginationQueryDto?: PaginationQueryDto): Promise<ApiHttpResponse<PaginationResult<BaseResolution>>> {
        const { from, to, geojson, keywords, includeConflict } = body;
        const { page, limit } = paginationQueryDto;
        const resolutionQueryParams = new ResolutionQueryParams(
            from,
            to,
            geojson,
            keywords,
            includeConflict
        );
        orderByOptions = query?.validOrderByOptions;
        // TODO: query resolutions based on ResolutionQueryParams
        const resolutions = await this.resolutionsService.getAll(resolutionQueryParams, new PaginationConfig(page, limit), orderByOptions);
        return this.responseHelper.success(resolutions);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    async searchResolutions(@Query() textSearchDto: ResolutionTextSearchDto,
      @Query(new OrderByValidationPipe([tableNames.resolutions, tableNames.conflicts])) query?: any,
      @Query() orderByOptions?: OrderByOptions)
      : Promise<ApiHttpResponse<PaginationResult<BaseResolution>>> {
        orderByOptions = query?.validOrderByOptions;
        const resolutions = await this.resolutionsService.search(textSearchDto.includeConflict === 'true' ? true : false, textSearchDto.text, new PaginationConfig(textSearchDto.page, textSearchDto.limit), orderByOptions);
        return this.responseHelper.success(resolutions);
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
    async getResolutionById(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse<BaseResolution>> {
        const resolution = await this.resolutionsService.getById(id, true);
        if (!resolution) {
            throw new NotFoundException(null, 'Resolution could not be found.');
        }
        return this.responseHelper.success(resolution);
    }

    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApiHttpResponse
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
    async deleteResolution(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse> {
        const exists = await this.resolutionsService.getById(id, false);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.resolutionsService.delete(exists as Resolution);
        return this.responseHelper.success('Conflict resolution deleted.');
    }
}