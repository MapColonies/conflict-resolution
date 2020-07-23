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
  addTextSearch(query, fieldNames, text, tableNames.resolutions);
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
    [{ leftColumn: `${tableNames.resolutions}.conflictId`, rigthColumn: `${tableNames.conflicts}.id` }]),
    postgis.asGeoJSON('location'),
    ['*',
      'resolutions.createdAt as resolutionCreatedAt',
      'resolutions.updatedAt as resolutionUpdatedAt',
      'resolutions.deletedAt as resolutionDeletedAt']);
  return query;
}

const deconstructToConflictAndResolution = (fullConflictsAndResolutions) => {
  return fullConflictsAndResolutions.map((fullConflictAndResolution) => {
    // fields to be removed
    const { conflictId, deletedAt, ...conflictAndResolution } = fullConflictAndResolution;

    // deconstract the resolution fields
    const {
      resolutionId,
      resolutionServer,
      resolutionEntity,
      resolutionCreatedAt,
      resolutionUpdatedAt,
      resolutionDeletedAt,
      resolvedById,
      resolvedBy,
      ...conflict
    } = conflictAndResolution;

    conflict.location = textToGeojson(conflict.location);

    return {
      resolutionId,
      resolutionServer,
      resolutionEntity,
      resolutionCreatedAt,
      resolutionUpdatedAt,
      resolutionDeletedAt,
      resolvedById,
      resolvedBy,
      conflict,
    };
  });
};