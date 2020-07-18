import { Knex } from 'nestjs-knex';

import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from 'src/global/models/pagination-config';
import { postgis } from '../global/services/postgis'
import { DEFAULT_SRID, createGeometryFromGeojson } from '../global/services/postgis/util'
import { ConflictQueryParams } from 'src/conflicts/models/conflict-query-params';
import { timeQuery, setFields, callQuery } from '../global/services/postgres/common-queries'
import { knexQuery, ExtendedKnexRaw } from 'src/global/services/postgres/knex-types';
import { keywordsColumns } from 'src/global/constants';
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

export const buildConflictsQuery = (query: knexQuery, queryParams: ConflictQueryParams): void => {
  if (queryParams.geojson) {
    const geometryA = postgis.setSRID('location', DEFAULT_SRID);
    const geometryB = postgis.setSRID(createGeometryFromGeojson(queryParams.geojson), DEFAULT_SRID);
    query.where(postgis.within(geometryA, geometryB));
    query.orWhere(postgis.intersects(geometryA, geometryB));
  }
  if (queryParams.hasResolved !== undefined) {
    query.where('has_resolved', queryParams.hasResolved);
  }
  if (queryParams.keywords.length > 0) {
    query.where((query: knexQuery) => {
      queryParams.keywords.map((keyword: string) => {
        keywordsColumns.forEach((column: string) =>
          query.orWhere(column, 'LIKE', `%${keyword}%`)
        );
      });
    });
  }
  timeQuery(query, 'created_at', queryParams.from, queryParams.to);
}
