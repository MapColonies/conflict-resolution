/* eslint-disable @typescript-eslint/no-use-before-define */
// TODO: configure eslint: no-use-before-define
import Knex = require('knex');
type trx = Knex.Transaction<any, any>;

import { db } from './db-connection';
import { paginate } from './pagination';
import { PaginationConfig } from '../../models/pagination-config';
import { ConflictQueryParams } from 'src/conflict/models/conflict-query-params';

export const getAllRecords = async (tableName: string, paginationConf: PaginationConfig, selectionFunc?: any, fields?: string[]) => {
  const selectedFields = setFields(fields);
  const query = db(tableName).select(selectedFields);
  if (selectionFunc) {
    query.select(selectedFields, selectionFunc);
  }
  if (paginationConf) {
    return await paginate(query, paginationConf)
  }
  return await query;
};

export const getRecordById = async (tableName: string, id: string, selectionFunc?: any, fields?: string[], inTransaction?: trx) => {
  const selectedFields = setFields(fields);
  const query = db(tableName).where({ id }).first();
  if (selectionFunc) {
    query.select(selectedFields, selectionFunc);
  } else {
    query.select(selectedFields);
  }
  return await callQuery(query, inTransaction);
};

export const createRecord = async (tableName: string, record: any, fields?: string[], inTransaction?: trx) => {
  const query = db(tableName).insert(record).returning(setFields(fields));
  return (await callQuery(query, inTransaction))[0];
};

export const updateRecord = async (
  tableName: string,
  id: string,
  updatedRecord: any,
  fields?: string[],
  inTransaction?: trx
) => {
  const query = db(tableName)
    .where('id', id)
    .update(updatedRecord)
    .returning(setFields(fields));
  return (await callQuery(query, inTransaction))[0];
};

export const deleteRecord = async (tableName: string, id: string, inTransaction?: trx) => {
  const query = db(tableName).where('id', id).del();
  return await callQuery(query, inTransaction);
};

export const countRecords = async (tableName: string, queryParams?: ConflictQueryParams, inTransaction?: trx) => {
  const query = db(tableName).count('* as count').first();
  if (queryParams) {
    queryParams.buildQuery(query);
  }
  return await callQuery(query, inTransaction);
}

const setFields = (fields: string[]) => {
  if (!fields) {
    return '*';
  }
  return fields;
};

const callQuery = async (query: any, inTransaction: trx) => {
  if (inTransaction) {
    query.transacting(inTransaction);
  }
  return await query;
};