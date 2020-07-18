import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex as NestKnex } from 'nestjs-knex';

import { trx, knexQuery, ExtendedKnexRaw } from 'src/global/services/postgres/knex-types';
import { PaginationConfig } from '../global/models/pagination-config';
import { TEXT_SEARCH_VECTOR_TYPE } from '../global/services/postgres/migration/custom-functions';
import { setFields, callQuery } from '../global/services/postgres/common-queries';
import { OrderByOptions } from 'src/global/models/order-by-options';

@Injectable()
export class QueryService {
    constructor(
        @InjectKnex() private readonly knex: NestKnex,
    ) { }

    async fullTextSearch(tableName: string, fieldNames: string[], text: string, paginationConf: PaginationConfig,
        selectionFunc?: ExtendedKnexRaw, orderByOptions?: OrderByOptions, fields?: string[]): Promise<knexQuery> {
        const selectedFields = setFields(fields);
        const query = this.knex(tableName).select(selectedFields);
        const numOfFields = fieldNames.length;
        let rawQuery = '';
        fieldNames.map((fieldName: string, index: number) => {
            if (numOfFields !== index + 1) {
                rawQuery += (`to_tsvector('${TEXT_SEARCH_VECTOR_TYPE}', ${fieldName}::text) ||`)
            } else {
                rawQuery += (`to_tsvector('${TEXT_SEARCH_VECTOR_TYPE}', ${fieldName}::text) @@ plainto_tsquery('${TEXT_SEARCH_VECTOR_TYPE}', '${text}')`)
            }
        })
        query.whereRaw(rawQuery);
        if (selectionFunc) {
            query.select(selectedFields, selectionFunc);
        }
        return await callQuery(query, null, paginationConf, orderByOptions);
    };

    async getAllRecords(tableName: string, paginationConf: PaginationConfig, selectionFunc?: ExtendedKnexRaw, fields?: string[]): Promise<knexQuery> {
        const selectedFields = setFields(fields);
        const query = this.knex(tableName).select(selectedFields);
        if (selectionFunc) {
            query.select(selectedFields, selectionFunc);
        }
        return await callQuery(query, null, paginationConf);
    };

    async getRecordById(tableName: string, id: string, selectionFunc?: ExtendedKnexRaw, fields?: string[], inTransaction?: trx): Promise<knexQuery> {
        const selectedFields = setFields(fields);
        const query = this.knex(tableName).where({ id }).first();
        if (selectionFunc) {
            query.select(selectedFields, selectionFunc);
        } else {
            query.select(selectedFields);
        }
        return await callQuery(query, inTransaction);
    };

    async createRecord(tableName: string, record: any, selectionFunc?: any, fields?: string[], inTransaction?: trx): Promise<knexQuery> {
        let selectedFields = setFields(fields);
        if (selectionFunc) {
            selectedFields = [...selectedFields, selectionFunc]
        }
        const query = this.knex(tableName).insert(record).returning(selectedFields);
        return (await callQuery(query, inTransaction))[0];
    };

    async updateRecord(
        tableName: string,
        id: string,
        updatedRecord: any,
        selectionFunc?: any,
        fields?: string[],
        inTransaction?: trx
    ): Promise<knexQuery> {
        let selectedFields = setFields(fields);
        if (selectionFunc) {
            selectedFields = [...selectedFields, selectionFunc]
        }
        const query = this.knex(tableName)
            .where('id', id)
            .update(updatedRecord)
            .returning(selectedFields);
        return (await callQuery(query, inTransaction))[0];
    };

    async deleteRecord(tableName: string, id: string, inTransaction?: trx): Promise<knexQuery> {
        const query = this.knex(tableName).where('id', id).del();
        return await callQuery(query, inTransaction);
    };
}
