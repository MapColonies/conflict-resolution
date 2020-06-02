import {Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { getAllResolutions, getResolutionById } from './resolutions.queries';
import { PaginationResult } from 'src/global/models/pagination-result';
import { PaginationConfig } from 'src/global/models/pagination-config';
import tableNames = require('../global/services/postgres/table-names');
import { FullResolution } from './models/full-resolution';
import { QueryService } from 'src/shared/query.service';

@Injectable()
export class ResolutionsService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
      ) {}

    async getAll(paginationConf: PaginationConfig): Promise<PaginationResult<FullResolution>> {
        return await getAllResolutions(paginationConf);
    };

    async search(text: string, paginationConfig: PaginationConfig) {
        return await this.queryService.fullTextSearch(tableNames.resolutions,
            ["resolution_entity"],
            text,
            paginationConfig
        );
    };

    async getById(id: string): Promise<FullResolution> {
        return await getResolutionById(id);
    };

    async delete(resolution: FullResolution): Promise<void> {
        try {
            // in transaction call for deletion of the resolution and update of the conflict
            await this.knex.transaction(async (trx) => {
                const isDeleted = await this.queryService.deleteRecord(
                    tableNames.resolutions,
                    resolution.resolution_id,
                    trx
                );
                if (!isDeleted) {
                    throw new InternalServerErrorException(null, 'Could not delete resolution, please try again.')
                }

                // get resolution's conflict and update it
                const conflict = await this.queryService.getRecordById(
                    tableNames.conflicts,
                    resolution.conflict.id,
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
                    trx
                );
            });
        } catch (error) {
            throw new InternalServerErrorException(null, 'Something went wrong, please try again.')
        }
    }
}