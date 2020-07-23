import { trx, knexQuery, ExtendedKnexRaw } from 'src/global/services/postgres/knex-types';
import { db } from './db-connection';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { paginate } from './pagination';
import { QueryJoinObject } from './query-join-object';
import { TEXT_SEARCH_VECTOR_TYPE } from './migration/custom-functions';

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
    return await paginate(this.countRecordsByQuery, query, paginationConf)
  }
  return await query;
};

export const orderByQuery = (query: knexQuery, orderByOptions: OrderByOptions): void => {
  if (orderByOptions?.columnName) {
    query?.orderBy(orderByOptions.columnName, orderByOptions.sortType);
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

export const joinQuery = (query: knexQuery, joinObject: QueryJoinObject, selectionFunc?: ExtendedKnexRaw, fields?: string[]): void => {
  const joinColumnsMap = {}
  joinObject.joinColumns.forEach((joinColumn) => { joinColumnsMap[joinColumn.leftColumn] = joinColumn.rigthColumn });
  query.join(joinObject.rightTable, joinColumnsMap)
  const selectedFields = setFields(fields);
  if (selectionFunc) {
    query.select(...selectedFields, selectionFunc);
  }
  query.groupBy(`${joinObject.leftTable}.id`, `${joinObject.rightTable}.id`);
}

export const addTextSearch = (query: knexQuery, fieldNames: string[], text: string) => {
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
}