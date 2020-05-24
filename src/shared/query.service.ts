import Knex = require('knex');
type trx = Knex.Transaction<any, any>;
import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex as NestKnex } from 'nestjs-knex';

import { paginate } from '../global/services/postgres/pagination';
import { PaginationConfig } from '../global/models/pagination-config';
import { ConflictQueryParams } from 'src/conflict/models/conflict-query-params';

@Injectable()
export class QueryService {
    constructor(
        @InjectKnex() private readonly knex: NestKnex,
    ) { }

    async getAllRecords(tableName: string, paginationConf: PaginationConfig, selectionFunc?: any, fields?: string[]) {
        const selectedFields = this.setFields(fields);
        const query = this.knex(tableName).select(selectedFields);
        if (selectionFunc) {
            query.select(selectedFields, selectionFunc);
        }
        if (paginationConf) {
            return await paginate(query, paginationConf)
        }
        return await query;
    };

    async getRecordById(tableName: string, id: string, selectionFunc?: any, fields?: string[], inTransaction?: trx) {
        const selectedFields = this.setFields(fields);
        const query = this.knex(tableName).where({ id }).first();
        if (selectionFunc) {
            query.select(selectedFields, selectionFunc);
        } else {
            query.select(selectedFields);
        }
        return await this.callQuery(query, inTransaction);
    };

    async createRecord(tableName: string, record: any, fields?: string[], inTransaction?: trx) {
        const query = this.knex(tableName).insert(record).returning(this.setFields(fields));
        return (await this.callQuery(query, inTransaction))[0];
    };

    async updateRecord(
        tableName: string,
        id: string,
        updatedRecord: any,
        fields?: string[],
        inTransaction?: trx
    ) {
        const query = this.knex(tableName)
            .where('id', id)
            .update(updatedRecord)
            .returning(this.setFields(fields));
        return (await this.callQuery(query, inTransaction))[0];
    };

    async deleteRecord(tableName: string, id: string, inTransaction?: trx) {
        const query = this.knex(tableName).where('id', id).del();
        return await this.callQuery(query, inTransaction);
    };

    async countRecords(tableName: string, queryParams?: ConflictQueryParams, inTransaction?: trx) {
        const query = this.knex(tableName).count('* as count').first();
        if (queryParams) {
            queryParams.buildQuery(query);
        }
        return await this.callQuery(query, inTransaction);
    }

    private setFields = (fields: string[]) => {
        if (!fields) {
            return '*';
        }
        return fields;
    };

    private callQuery = async (query: any, inTransaction: trx) => {
        if (inTransaction) {
            query.transacting(inTransaction);
        }
        return await query;
    };
}
