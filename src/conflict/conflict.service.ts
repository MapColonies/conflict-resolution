/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { postgis } from '../global/services/postgis'
import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from '../global/models/pagination-config';
import { ConflictDto } from './models/conflict-dto';
import { setSRID } from '../global/services/postgis/util'
import { Conflict } from './models/conflict';
import { PaginationResult } from 'src/global/models/pagination-result';
import { queryConflicts } from './conflict.queries';
import { ConflictQueryParams } from 'src/conflict/models/conflict-query-params';
import { QueryService } from 'src/shared/query.service';

@Injectable()
export class ConflictService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
    ) { }

    async getAll(paginationConfig: PaginationConfig): Promise<PaginationResult<Conflict>> {
        return await this.queryService.getAllRecords(tableNames.conflict,
            paginationConfig,
            postgis.asGeoJSON('location')
        );
    };

    async getById(id: string, asGeojson = true): Promise<Conflict> {
        return await this.queryService.getRecordById(tableNames.conflict,
            id,
            asGeojson ? postgis.asGeoJSON('location') : null)
    };

    async create(conflictDto: ConflictDto): Promise<Conflict> {
        return await this.queryService.createRecord(
            tableNames.conflict,
            this.parseLocation(conflictDto, 'location')
        );
    }

    async update(id: string, conflictDto: ConflictDto): Promise<Conflict> {
        return await this.queryService.updateRecord(
            tableNames.conflict,
            id,
            this.parseLocation(conflictDto, 'location')
        );
    }

    async delete(id: string) {
        return await this.queryService.deleteRecord(tableNames.conflict, id);
    }

    async resolve(conflict: Conflict, result: {}): Promise<void> {
        try {
            await this.knex.transaction(async (trx) => {
                const createdResult = (
                    await this.queryService.createRecord(tableNames.result, result, null, trx)
                );
                
                conflict.has_resolved = true;
                conflict.resolved_at = createdResult.created_at;
                conflict.result_id = createdResult.id;

                await this.queryService.updateRecord(
                    tableNames.conflict,
                    conflict.id,
                    conflict,
                    null,
                    trx
                );
            });
        } catch (error) {
            throw new InternalServerErrorException(null, 'Something went wrong.');
        }
    }

    async search(conflictQueryParams: ConflictQueryParams, paginationConfig: PaginationConfig): Promise<PaginationResult<Conflict>> {
        if (!conflictQueryParams.isValid()) {
            throw new BadRequestException(null, 'Query is invalid.')
        }
        return await queryConflicts(
            this.knex,
            conflictQueryParams,
            paginationConfig,
            postgis.asGeoJSON('location')
        );
    }

    private parseLocation = (input: any, fieldName: string) => {
        const output = { ...input };
        output[fieldName] = setSRID(postgis.geomFromGeoJSON(input[fieldName]));
        return output;
    }
}
