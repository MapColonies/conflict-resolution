/* eslint-disable @typescript-eslint/no-use-before-define */
import { Knex } from 'nestjs-knex';
import tableNames = require('../global/services/postgres/table-names');
import { paginate } from '../global/services/postgres/pagination';
import { ConflictQueryParams } from 'src/conflict/models/conflict-query-params';
import { PaginationConfig } from 'src/global/models/pagination-config';

export const queryConflicts = async (knex: Knex, queryParams: ConflictQueryParams, paginationConf?: PaginationConfig, selectionFunc?: any, fields?: string[]) => {
  const selectedFields = setFields(fields);
  const query = knex(tableNames.conflict).select(selectedFields);
  if (selectionFunc) {
    query.select(selectedFields, selectionFunc);
  }
  queryParams.buildQuery(query);
  if (paginationConf) {
    return await paginate(query, paginationConf, queryParams)
  }
  return await query;
};

const setFields = (fields: string[]) => {
  if (!fields) {
    return '*';
  }
  return fields;
};