import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { queryResolutions, getResolutionById, searchResolutions } from './resolutions.queries';
import { PaginationResult } from 'src/global/models/pagination-result';
import { PaginationConfig } from 'src/global/models/pagination-config';
import tableNames = require('../global/services/postgres/table-names');
import { QueryService } from 'src/shared/query.service';
import { trx } from 'src/global/services/postgres/knex-types';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { Resolution } from './models/resolution';
import { BaseResolution } from './models/base-resolution';
import { ResolutionQueryParams } from './models/resolution-query-params';

@Injectable()
export class ResolutionsService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
    ) { }

    async query(resolutionQueryParams: ResolutionQueryParams, paginationConf: PaginationConfig, orderByOptions: OrderByOptions): Promise<PaginationResult<BaseResolution>> {
        if (!resolutionQueryParams.isValid() || !validateQueryParamsAndOrderBy(orderByOptions, resolutionQueryParams.includeConflict)) {
            throw new BadRequestException(null, 'Query is invalid.')
        }
        return await queryResolutions(this.knex, resolutionQueryParams, paginationConf, orderByOptions);
    };

    async search(includeConflict: boolean, text: string, paginationConfig: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<BaseResolution>> {
        if (!validateQueryParamsAndOrderBy(orderByOptions, includeConflict)) {
            throw new BadRequestException(null, 'Query is invalid.')
        }
        return await searchResolutions(
            this.knex,
            [`resolutionEntity`],
            text,
            paginationConfig,
            includeConflict,
            orderByOptions
        );
    };

    async getById(id: string, includeConflic?: boolean): Promise<BaseResolution> {
        return await getResolutionById(this.knex, id, includeConflic);
    };

    async delete(resolution: Resolution): Promise<void> {
        try {
            // in transaction call for deletion of the resolution and update of the conflict
            await this.knex.transaction(async (trx: trx) => {
                const isDeleted = await this.queryService.deleteRecord(
                    tableNames.resolutions,
                    resolution.id,
                    trx
                );
                if (!isDeleted) {
                    throw new InternalServerErrorException(null, 'Could not delete resolution, please try again.')
                }

                // get resolution's conflict and update it
                const conflict = await this.queryService.getRecordById(
                    tableNames.conflicts,
                    resolution.conflictId,
                    null,
                    null,
                    trx
                );

                conflict.hasResolved = false;
                conflict.resolvedAt = null;

                await this.queryService.updateRecord(
                    tableNames.conflicts,
                    conflict.id,
                    conflict,
                    null,
                    null,
                    trx
                );
            });
        } catch (error) {
            throw new InternalServerErrorException(null, 'Something went wrong, please try again.')
        }
    }
}

const validateQueryParamsAndOrderBy = (orderByOptions?: OrderByOptions, includeConflict?: boolean): boolean => {
    let tables = [tableNames.resolutions];
    if (includeConflict) {
        tables.push(tableNames.conflicts)
    }
    if (orderByOptions ? !orderByOptions?.isValid(tables) : false) {
        return false;
    }
    return true;
}
