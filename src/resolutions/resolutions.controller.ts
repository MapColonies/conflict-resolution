import { Controller, Get, Post, Query, Param, NotFoundException, Delete, ParseUUIDPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ResolutionsService } from './resolutions.service';
import { PaginationResult } from '../global/models/pagination-result';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { TextSearchDto } from 'src/global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';
import { ApiHttpResponse } from 'src/global/models/common/api-http-response';
import { OrderByValidationPipe } from 'src/shared/order-by-validation.pipe';
import tableNames = require('../global/services/postgres/table-names');
import { BaseResolution } from './models/base-resolution';
import { Resolution } from './models/resolution';
import { OrderByOptions } from 'src/global/models/order-by-options';

@ApiTags('resolutions')
@Controller('resolutions')
export class ResolutionsController {
    constructor(private responseHelper: ResponseHelperService, 
        private readonly resolutionsService: ResolutionsService) { }

    // FIXME: example consists PaginationResult<Conflict>
    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    // TODO: add resolutionQueryParams(will have includeConflicts flag)
    // TODO: with resolutionQueryParams change the OrderByValidationPipe accordingly
    async getAllResolutions(@Query() paginationQueryDto: PaginationQueryDto,
     @Query(new OrderByValidationPipe([tableNames.resolutions, tableNames.conflicts])) query?: any,
      @Query() orderByOptions?: OrderByOptions): Promise<ApiHttpResponse<PaginationResult<BaseResolution>>> {
        orderByOptions = query?.validOrderByOptions;
        const resolutions = await this.resolutionsService.getAll(true, new PaginationConfig(paginationQueryDto.page, paginationQueryDto.limit), orderByOptions);
        return this.responseHelper.success(resolutions);
    }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginationResult
    })
    async searchResolutions(@Query() textSearchDto: TextSearchDto,
      @Query(new OrderByValidationPipe([tableNames.resolutions, tableNames.conflicts])) query?: any,
      @Query() orderByOptions?: OrderByOptions)
      : Promise<ApiHttpResponse<PaginationResult<BaseResolution>>> {
        orderByOptions = query?.validOrderByOptions;
        const resolutions = await this.resolutionsService.search(true, textSearchDto.text, new PaginationConfig(textSearchDto.page, textSearchDto.limit), orderByOptions);
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