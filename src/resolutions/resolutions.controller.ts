import { Controller, Get, Post, Query, Param, NotFoundException, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ResolutionsService } from './resolutions.service';
import { PaginationResult } from '../global/models/pagination-result';
import { FullResolution } from './models/full-resolution';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { TextSearchDto } from 'src/global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';
import { ApiHttpResponse } from 'src/global/models/common/api-http-response';

@ApiTags('resolutions')
@Controller('resolutions')
export class ResolutionsController {
    constructor(private responseHelper: ResponseHelperService, 
        private readonly resolutionsService: ResolutionsService) { }

    // FIXME: example consists PaginationResult<Conflict>
    @Get()
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async getAllResolutions(@Query() query: PaginationQueryDto): Promise<ApiHttpResponse<PaginationResult<FullResolution>>> {
        const resolutions = await this.resolutionsService.getAll(new PaginationConfig(query.page, query.limit));
        return this.responseHelper.ok(resolutions);
    }

    @Post('search')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async searchResolutions(@Query() query: TextSearchDto): Promise<ApiHttpResponse<PaginationResult<FullResolution>>> {
        const resolutions = await this.resolutionsService.search(query.text, new PaginationConfig(query.page, query.limit));
        return this.responseHelper.ok(resolutions);
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: FullResolution
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async getResolutionById(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse<FullResolution>> {
        const resolution = await this.resolutionsService.getById(id);
        if (!resolution) {
            throw new NotFoundException(null, 'Resolution could not be found.');
        }
        return this.responseHelper.ok(resolution);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: ApiHttpResponse
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async deleteResolution(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse> {
        const exists = await this.resolutionsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.resolutionsService.delete(exists);
        return this.responseHelper.ok('Conflict resolution deleted.');
    }
}