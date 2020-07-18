import * as Knex from 'knex';

export interface ExtendedKnexRaw extends Knex.Raw {
    as(alias: string): ExtendedKnexRaw
}
export type trx = Knex.Transaction<any, any>;
export type knexQuery = Knex.QueryBuilder;