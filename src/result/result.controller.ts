import { Controller, Get, Query, Param, NotFoundException, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ResultService } from './result.service';
import { PaginationResult } from '../global/models/pagination-result';
import { FullResult } from './models/full-result';
import { PaginationQueryDto } from 'src/global/models/pagination-query-dto';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { HttpResponse } from 'src/global/models/http-response';

@ApiTags('result')
@Controller('result')
export class ResultController {
    constructor(private readonly resultService: ResultService) { }

    // FIXME: example consists PaginationResult<Conflict>
    @Get('all')
    @ApiResponse({
        status: 200,
        type: PaginationResult
    })
    async getAllResults(@Query() query: PaginationQueryDto): Promise<PaginationResult<FullResult>> {
        const results = await this.resultService.getAll(new PaginationConfig(query.page, query.limit));
        return results;
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: FullResult
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async getResultById(@Param('id', ParseUUIDPipe) id: string): Promise<FullResult> {
        const result = await this.resultService.getById(id);
        if (!result) {
            throw new NotFoundException(null, 'Result could not be found.');
        }
        return result;
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: HttpResponse
    })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async deleteResult(@Param('id', ParseUUIDPipe) id: string): Promise<HttpResponse> {
        const exists = await this.resultService.getById(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.resultService.delete(exists);
        return new HttpResponse('Conflict result deleted.')
    }
}