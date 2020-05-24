/* eslint-disable @typescript-eslint/camelcase */
import {Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { getAllResults, getResultById } from './result.queries';
import { PaginationResult } from 'src/global/models/pagination-result';
import { PaginationConfig } from 'src/global/models/pagination-config';
import tableNames = require('../global/services/postgres/table-names');
import { FullResult } from './models/full-result';
import { QueryService } from 'src/shared/query.service';

@Injectable()
export class ResultService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
      ) {}

    async getAll(paginationConf: PaginationConfig): Promise<PaginationResult<FullResult>> {
        return await getAllResults(paginationConf);
    };

    async getById(id: string): Promise<FullResult> {
        return await getResultById(id);
    };

    async delete(result: FullResult): Promise<void> {
        try {
            // in transaction call for deletion of the result and update of the conflict
            await this.knex.transaction(async (trx) => {
                const isDeleted = await this.queryService.deleteRecord(
                    tableNames.result,
                    result.result_id,
                    trx
                );
                if (!isDeleted) {
                    throw new InternalServerErrorException(null, 'Could not delete result, please try again.')
                }

                // get result's conflict and update it
                const conflict = await this.queryService.getRecordById(
                    tableNames.conflict,
                    result.conflict.id,
                    null,
                    null,
                    trx
                );

                conflict.has_resolved = false;
                conflict.resolved_at = null;

                await this.queryService.updateRecord(
                    tableNames.conflict,
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