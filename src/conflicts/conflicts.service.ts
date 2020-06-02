import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { postgis } from '../global/services/postgis'
import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from '../global/models/pagination-config';
import { ConflictDto } from './models/conflict-dto';
import { DEFAULT_SRID } from '../global/services/postgis/util'
import { Conflict } from './models/conflict';
import { PaginationResult } from 'src/global/models/pagination-result';
import { queryConflicts } from './conflicts.queries';
import { ConflictQueryParams } from 'src/conflicts/models/conflict-query-params';
import { QueryService } from 'src/shared/query.service';

@Injectable()
export class ConflictsService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
    ) { }

    async getAll(paginationConfig: PaginationConfig): Promise<PaginationResult<Conflict>> {
        return await this.queryService.getAllRecords(tableNames.conflicts,
            paginationConfig,
            postgis.asGeoJSON('location')
        );
    };

    async getById(id: string, asGeojson = true): Promise<Conflict> {
        return await this.queryService.getRecordById(tableNames.conflicts,
            id,
            asGeojson ? postgis.asGeoJSON('location') : null)
    };

    async search(text: string, paginationConfig: PaginationConfig) {
        return await this.queryService.fullTextSearch(tableNames.conflicts,
            ["target_entity", "source_entity"],
            text,
            paginationConfig,
            postgis.asGeoJSON('location')
        );
    };
    
    async create(conflictDto: ConflictDto): Promise<Conflict> {
        return await this.queryService.createRecord(
            tableNames.conflicts,
            this.parseLocation(conflictDto, 'location')
        );
    }

    async update(id: string, conflictDto: ConflictDto): Promise<Conflict> {
        return await this.queryService.updateRecord(
            tableNames.conflicts,
            id,
            this.parseLocation(conflictDto, 'location')
        );
    }

    async delete(id: string) {
        return await this.queryService.deleteRecord(tableNames.conflicts, id);
    }

    async resolve(conflict: Conflict, resolution: {}): Promise<void> {
        try {
            await this.knex.transaction(async (trx) => {
                const createdResolution = (
                    await this.queryService.createRecord(tableNames.resolutions, resolution, null, trx)
                );
                
                conflict.has_resolved = true;
                conflict.resolved_at = createdResolution.created_at;
                conflict.resolution_id = createdResolution.id;

                await this.queryService.updateRecord(
                    tableNames.conflicts,
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

    async query(conflictQueryParams: ConflictQueryParams, paginationConfig: PaginationConfig): Promise<PaginationResult<Conflict>> {
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
        output[fieldName] = postgis.setSRID(postgis.geomFromGeoJSON(input[fieldName]), DEFAULT_SRID);
        return output;
    }
}
