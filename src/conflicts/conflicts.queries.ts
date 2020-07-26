import { Knex } from 'nestjs-knex';

import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from 'src/global/models/pagination-config';
import { ConflictQueryParams } from 'src/conflicts/models/conflict-query-params';
import { timeQuery, setFields, callQuery, geometryWithinIntersectsQuery, likeQuery, bboxQuery } from '../global/services/postgres/common-queries';
import { knexQuery, ExtendedKnexRaw } from 'src/global/services/postgres/knex-types';
import { KEYWORD_QUERY_COLUMNS } from 'src/global/constants';
import { OrderByOptions } from 'src/global/models/order-by-options';

export const queryConflicts = async (knex: Knex, queryParams: ConflictQueryParams, paginationConf?: PaginationConfig, selectionFunc?: ExtendedKnexRaw, orderByOptions?: OrderByOptions, fields?: string[]) => {
  const selectedFields = setFields(fields);
  const query = knex(tableNames.conflicts).select(selectedFields);
  if (selectionFunc) {
    query.select(selectedFields, selectionFunc);
  }
  buildConflictsQuery(query, queryParams);
  return await callQuery(query, null, paginationConf, orderByOptions);
};

const buildConflictsQuery = (query: knexQuery, queryParams: ConflictQueryParams): void => {
  if (queryParams.geojson) {
    geometryWithinIntersectsQuery(query, 'location', queryParams.geojson);
  }
  if (queryParams.bbox) {
    bboxQuery(query, 'location', queryParams.bbox);
  }
  if (queryParams.hasResolved !== undefined) {
    query.andWhere('hasResolved', queryParams.hasResolved);
  }
  if (queryParams.keywords.length > 0) {
    likeQuery(query, queryParams.keywords, KEYWORD_QUERY_COLUMNS)
  }
  timeQuery(query, 'createdAt', queryParams.from, queryParams.to);
}
