import {Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { getAllResolutions, getResolutionById, searchResolutions } from './resolutions.queries';
import { PaginationResult } from 'src/global/models/pagination-result';
import { PaginationConfig } from 'src/global/models/pagination-config';
import tableNames = require('../global/services/postgres/table-names');
import { QueryService } from 'src/shared/query.service';
import { trx } from 'src/global/services/postgres/knex-types';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { Resolution } from './models/resolution';
import { BaseResolution } from './models/base-resolution';

@Injectable()
export class ResolutionsService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
      ) {}

    async getAll(includeConflicts: boolean, paginationConf: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<BaseResolution>> {
        return await getAllResolutions(includeConflicts, paginationConf, orderByOptions);
    };

    async search(text: string, paginationConfig: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<BaseResolution>> {
        return await searchResolutions(
            ['resolutions.resolution_entity'],
            text,
            paginationConfig,
            false,
            orderByOptions
        );
    };

    async getById(id: string, includeConflic?: boolean): Promise<BaseResolution> {
        return await getResolutionById(id, includeConflic);
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
                    resolution.conflict_id,
                    null,
                    null,
                    trx
                );

                conflict.has_resolved = false;
                conflict.resolved_at = null;

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