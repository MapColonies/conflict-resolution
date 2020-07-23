import { Knex } from 'nestjs-knex';

import { postgis } from '../global/services/postgis';
import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from 'src/global/models/pagination-config';
import { PaginationResult } from 'src/global/models/pagination-result';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { callQuery, joinQuery, addTextSearch } from 'src/global/services/postgres/common-queries';
import { QueryJoinObject } from 'src/global/services/postgres/query-join-object';
import { knexQuery } from 'src/global/services/postgres/knex-types';
import { BaseResolution } from './models/base-resolution';
import { textToGeojson } from 'src/util';
import { ResolutionQueryParams } from './models/resolution-query-params';

export const getAllResolutions = async (knex: Knex, queryParams: ResolutionQueryParams, paginationConf?: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<BaseResolution>> => {
  const query = knex(tableNames.resolutions);
  if (!queryParams.includeConflict) {
    return await callQuery(query, null, paginationConf, orderByOptions);
  }
  const queryResult = await callQuery(joinWithConflicts(query), null, paginationConf, orderByOptions);
  queryResult.data = deconstructToConflictAndResolution(queryResult.data);
  return queryResult;
};

export const searchResolutions = async (knex: Knex, fieldNames: string[], text: string, paginationConf: PaginationConfig, includeConflict?: boolean, orderByOptions?: OrderByOptions) => {
  const query = knex(tableNames.resolutions);
  addTextSearch(query, fieldNames, text);
  if (!includeConflict) {
    return await callQuery(query, null, paginationConf, orderByOptions);
  }
  const queryResult = await callQuery(joinWithConflicts(query), null, paginationConf, orderByOptions);
  queryResult.data = deconstructToConflictAndResolution(queryResult.data);
  return queryResult;
}

export const getResolutionById = async (knex: Knex, id: string, includeConflict?: boolean): Promise<BaseResolution> => {
  const query = knex(tableNames.resolutions).where('resolutions.id', id);
  if (!includeConflict) {
    return (await callQuery(query))[0];
  }
  const fullConflictsAndResolutions = await callQuery(joinWithConflicts(query));
  return (deconstructToConflictAndResolution(fullConflictsAndResolutions))[0];
};

const joinWithConflicts = (query: knexQuery) => {
  joinQuery(query, new QueryJoinObject(tableNames.resolutions, tableNames.conflicts,
    [{ leftColumn: `${tableNames.resolutions}.conflict_id`, rigthColumn: `${tableNames.conflicts}.id` }]),
    postgis.asGeoJSON('location'),
    ['*',
      'resolutions.created_at as resolution_created_at',
      'resolutions.updated_at as resolution_updated_at',
      'resolutions.deleted_at as resolution_deleted_at']);
  return query;
}

const deconstructToConflictAndResolution = (fullConflictsAndResolutions) => {
  return fullConflictsAndResolutions.map((fullConflictAndResolution) => {
    // fields to be removed
    const { conflict_id, deleted_at, ...conflictAndResolution } = fullConflictAndResolution;

    // deconstract the resolution fields
    const {
      resolution_id,
      resolution_server,
      resolution_entity,
      resolution_created_at,
      resolution_updated_at,
      resolution_deleted_at,
      resolved_by_id,
      resolved_by,
      ...conflict
    } = conflictAndResolution;

    conflict.location = textToGeojson(conflict.location);

    return {
      resolution_id,
      resolution_server,
      resolution_entity,
      resolution_created_at,
      resolution_updated_at,
      resolution_deleted_at,
      resolved_by_id,
      resolved_by,
      conflict,
    };
  });
};