import { db } from '../global/services/postgres/db-connection';
import { postgis } from '../global/services/postgis';
import tableNames = require('../global/services/postgres/table-names');
import { PaginationConfig } from 'src/global/models/pagination-config';
import { FullResolution } from './models/full-resolution';
import { PaginationResult } from 'src/global/models/pagination-result';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { callQuery } from 'src/global/services/postgres/common-queries';

// TODO: should be used with nest-knex? move functions into a service?
const baseQuery = db(tableNames.resolutions)
  .join(tableNames.conflicts, { 'resolutions.conflict_id': 'conflicts.id' })
  .select([
    '*',
    'resolutions.created_at as resolution_created_at',
    'resolutions.updated_at as resolution_updated_at',
    postgis.asGeoJSON('location'),
  ]).groupBy(`${tableNames.resolutions}.id`).groupBy(`${tableNames.conflicts}.id`);

export const getAllResolutions = async (paginationConf: PaginationConfig, orderByOptions?: OrderByOptions): Promise<PaginationResult<FullResolution>> => {
  const query = baseQuery.clone();
  const queryResult = await callQuery(query, null, paginationConf, orderByOptions);
  if (!paginationConf) {
    return deconstructToConflictAndResolution(queryResult);
  }
  queryResult.data = deconstructToConflictAndResolution(queryResult.data);
  return queryResult;
};

export const getResolutionById = async (id: string): Promise<FullResolution> => {
  const query = baseQuery.clone();
  const fullConflictsAndResolutions = await query.where('resolutions.id', id);
  return (deconstructToConflictAndResolution(fullConflictsAndResolutions))[0];
};

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