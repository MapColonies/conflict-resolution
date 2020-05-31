import { Controller, Get, Query, Param, NotFoundException, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ResultsService } from './results.service';
import { PaginationResult } from '../global/models/pagination-result';
import { FullResult } from './models/full-result';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { TextSearchDto } from 'src/global/models/text-search-dto';
import { ResponseHelperService } from 'src/shared/response-helper.service';
import { ApiHttpResponse } from 'src/global/models/common/api-http-response';

@ApiTags('results')
@Controller('results')
export class ResultsController {
    constructor(private responseHelper: ResponseHelperService, 
        private readonly resultsService: ResultsService) { }

    // FIXME: example consists PaginationResult<Conflict>
    @Get('all')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async getAllResults(@Query() query: PaginationQueryDto): Promise<ApiHttpResponse<PaginationResult<FullResult>>> {
        const results = await this.resultsService.getAll(new PaginationConfig(query.page, query.limit));
        return this.responseHelper.ok(results);
    }

    @Get('search')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async filterConflicts(@Query() query: TextSearchDto): Promise<ApiHttpResponse<PaginationResult<FullResult>>> {
        const result = await this.resultsService.search(query.text, new PaginationConfig(query.page, query.limit));
        return this.responseHelper.ok(result);
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: FullResult
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async getResultById(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse<FullResult>> {
        const result = await this.resultsService.getById(id);
        if (!result) {
            throw new NotFoundException(null, 'Result could not be found.');
        }
        return this.responseHelper.ok(result);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: ApiHttpResponse
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async deleteResult(@Param('id', ParseUUIDPipe) id: string): Promise<ApiHttpResponse> {
        const exists = await this.resultsService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.resultsService.delete(exists);
        return this.responseHelper.ok('Conflict result deleted.');
    }
}