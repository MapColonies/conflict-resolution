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
import { textToGeojson } from 'src/util';
import { trx } from 'src/global/services/postgres/knex-types';
import { OrderByOptions } from 'src/global/models/order-by-options';

@Injectable()
export class ConflictsService {
    constructor(
        @InjectKnex() private readonly knex: Knex,
        private readonly queryService: QueryService
    ) { }

    async getAll(paginationConfig: PaginationConfig): Promise<PaginationResult<Conflict>> {
        const res = await this.queryService.getAllRecords(tableNames.conflicts,
            paginationConfig,
            postgis.asGeoJSON('location')
        );
        if (res?.data) {
            this.parseConflictsLocationsToGeojson(res.data);
        }
        return res;
    };

    async getById(id: string, asGeojson = true): Promise<Conflict> {
        const data = await this.queryService.getRecordById(tableNames.conflicts,
            id,
            asGeojson ? postgis.asGeoJSON('location') : null)
        if (data && asGeojson) {
            this.parseConflictLocationToGeojson(data)
        }
        return data;
    };

    async search(text: string, paginationConfig: PaginationConfig, orderByOptions?: OrderByOptions) {
        const res = await this.queryService.fullTextSearch(tableNames.conflicts,
            ["targetEntity", "sourceEntity"],
            text,
            paginationConfig,
            postgis.asGeoJSON('location'),
            orderByOptions
        );
        if (res?.data) {
            this.parseConflictsLocationsToGeojson(res.data);
        }
        return res;
    };
    
    async create(conflictDto: ConflictDto): Promise<Conflict> {
        const res = await this.queryService.createRecord(
            tableNames.conflicts,
            this.parseLocation(conflictDto, 'location'), 
            postgis.asGeoJSON('location')
        );
        this.parseConflictLocationToGeojson(res)
        return res;
    }

    async update(id: string, conflictDto: ConflictDto): Promise<Conflict> {
        const res = await this.queryService.updateRecord(
            tableNames.conflicts,
            id,
            this.parseLocation(conflictDto, 'location'),
            postgis.asGeoJSON('location')
        );
        this.parseConflictLocationToGeojson(res)
        return res;
    }

    async delete(id: string) {
        return await this.queryService.deleteRecord(tableNames.conflicts, id);
    }

    async resolve(conflict: Conflict, resolution: {}): Promise<void> {
        try {
            await this.knex.transaction(async (trx: trx) => {
                const createdResolution = (
                    await this.queryService.createRecord(tableNames.resolutions, resolution, null, null, trx)
                );
                
                conflict.hasResolved = true;
                conflict.resolvedAt = createdResolution.createdAt;
                conflict.resolutionId = createdResolution.id;

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
            throw new InternalServerErrorException(null, 'Something went wrong.');
        }
    }

    async query(conflictQueryParams: ConflictQueryParams, paginationConfig: PaginationConfig, orderByOptions: OrderByOptions): Promise<PaginationResult<Conflict>> {
        if (!conflictQueryParams.isValid()) {
            throw new BadRequestException(null, 'Query is invalid.')
        }
        const res = await queryConflicts(
            this.knex,
            conflictQueryParams,
            paginationConfig,
            postgis.asGeoJSON('location'),
            orderByOptions
        );
        if (res?.data) {
            this.parseConflictsLocationsToGeojson(res.data);
        }
        return res;
    }

    private parseLocation = (input: any, fieldName: string) => {
        const output = { ...input };
        output[fieldName] = postgis.setSRID(postgis.geomFromGeoJSON(input[fieldName]), DEFAULT_SRID);
        return output;
    }

    private parseConflictsLocationsToGeojson = (data: Conflict[]) => {
        data?.map((conflict: Conflict) => this.parseConflictLocationToGeojson(conflict))
    }

    private parseConflictLocationToGeojson = (conflict: Conflict) => {
        conflict.location = textToGeojson(conflict.location)
    }
}
