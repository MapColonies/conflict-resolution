import { trx, knexQuery } from 'src/global/services/postgres/knex-types';
import { db } from './db-connection';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { paginate } from './pagination';

export const countRecords = async (tableName: string, inTransaction?: trx): Promise<knexQuery> => {
  const query = db(tableName).count('* as count').first();
  return await callQuery(query, inTransaction);
}

export const countRecordsByQuery = async (query: any, inTransaction?: trx): Promise<knexQuery> => {
  const queryClone = query.clone();
  const table = query?._single?.table;
  queryClone.groupBy(`${table}.id`).as('t');
  const countQuery = db.count('* as count').from(queryClone).first();
  return await callQuery(countQuery, inTransaction);
}

export const setFields = (fields: string[]): string | string[] => {
  if (!fields) {
      return '*';
  }
  return fields;
};

export const callQuery = async (query: knexQuery, inTransaction?: trx, paginationConf?: PaginationConfig, orderByOptions?: OrderByOptions): Promise<knexQuery> => {
  orderByQuery(query, orderByOptions);
  if (inTransaction) {
    query.transacting(inTransaction);
  }
  if (paginationConf) {
    return await paginate(query, paginationConf)
  }
  return await query;
};

export const orderByQuery = (query: knexQuery, orderByOptions: OrderByOptions): void => {
  if (orderByOptions?.isValid()) {
    query?.orderBy(orderByOptions.columnName, orderByOptions.isAscending ? 'asc' : 'desc')
  }
}

export const timeQuery = (query: knexQuery, fieldName: string, from: Date, to: Date): void => {
  if (from && to) {
    query.whereBetween(fieldName, [from, to]);
    return;
  }
  if (from) {
    query.where(fieldName, '>=', from);
    return;
  }
  if (to) {
    query.where(fieldName, '<', to);
  }
};