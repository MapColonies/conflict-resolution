import { db } from '../global/services/postgres/db-connection';
import { postgis } from '../global/services/postgis';
import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from 'src/global/models/pagination-config';
import { FullResolution } from './models/full-resolution';
import { PaginationResult } from 'src/global/models/pagination-result';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { callQuery, joinQuery } from 'src/global/services/postgres/common-queries';
import { QueryJoinObject } from 'src/global/services/postgres/query-join-object';
import { knexQuery } from 'src/global/services/postgres/knex-types';

// TODO: kenx should be used with nest-knex? move functions into a service?

export const getAllResolutions = async (includeConflict: boolean, paginationConf?: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<FullResolution>> => {
  const query = db(tableNames.resolutions);
  if (!includeConflict) {
    return await callQuery(query, null, paginationConf, orderByOptions);
  }
  const queryResult = await callQuery(joinWithConflicts(query), null, paginationConf, orderByOptions);
  const data = paginationConf ? queryResult.data = deconstructToConflictAndResolution(queryResult.data) : deconstructToConflictAndResolution(queryResult);
  return paginationConf ? queryResult : data;
};

export const getResolutionById = async (id: string, includeConflict: boolean): Promise<FullResolution> => {
  const query = db(tableNames.resolutions).where('resolutions.id', id);
  if (!includeConflict) {
    return callQuery(query);
  }
  const fullConflictsAndResolutions = await callQuery(joinWithConflicts(query));
  return (deconstructToConflictAndResolution(fullConflictsAndResolutions))[0];
};

const joinWithConflicts = (query: knexQuery) => {
  joinQuery(query, new QueryJoinObject(tableNames.resolutions, tableNames.conflicts,
    [{ leftColumn: `${tableNames.resolutions}.conflict_id`, rigthColumn: `${tableNames.conflicts}.id`}]), postgis.asGeoJSON('location'), [
      '*',
      'resolutions.created_at as resolution_created_at',
      'resolutions.updated_at as resolution_updated_at']);
      return query;
}

// TODO: build dynamic \ better way
const deconstructToConflictAndResolution = (fullConflictsAndResolutions) => {
  return fullConflictsAndResolutions.map((fullConflictAndResolution) => {
    // remove fields
    const { conflict_id, deleted_at, ...conflictAndResolution } = fullConflictAndResolution;

    const {
      resolution_id,
      resolution_server,
      resolution_entity,
      resolution_created_at,
      resolution_updated_at,
      ...conflict
    } = conflictAndResolution;

    return {
      resolution_id,
      resolution_server,
      resolution_entity,
      resolution_created_at,
      resolution_updated_at,
      conflict,
    };
  });
};