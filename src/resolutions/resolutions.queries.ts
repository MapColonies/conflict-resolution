import { db } from '../global/services/postgres/db-connection';
import { postgis } from '../global/services/postgis';
import tableNames = require('../global/services/postgres/table-names');
import { paginate } from '../global/services/postgres/pagination';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { FullResolution } from './models/full-resolution';
import { PaginationResult } from 'src/global/models/pagination-result';

// TODO: should be used with nest-knex? move functions into a service?
const baseQuery = db({ r: tableNames.resolutions })
  .join(tableNames.conflicts, { 'r.conflict_id': 'conflicts.id' })
  .select([
    '*',
    'r.created_at as r_created_at',
    'r.updated_at as r_updated_at',
    postgis.asGeoJSON('location'),
  ]);

export const getAllResolutions = async (paginationConf: PaginationConfig): Promise<PaginationResult<FullResolution>> => {
  const query = baseQuery.clone();
  if (!paginationConf) {
    return deconstructToConflictAndResolution(await query);
  }
  const paginationResult = await paginate(query, paginationConf);
  paginationResult.data = deconstructToConflictAndResolution(paginationResult.data);
  return paginationResult;
};

export const getResolutionById = async (id: string): Promise<FullResolution> => {
  const query = baseQuery.clone();
  const fullResolutions = await query.where('r.id', id);
  return (deconstructToConflictAndResolution(fullResolutions))[0];
};

// TODO: build dynamic \ better way
const deconstructToConflictAndResolution = (fullResolutions) => {
  return fullResolutions.map((fr) => {
    // remove fields
    const { conflict_id, deleted_at, ...conflictAndResolution } = fr;

    const {
      resolution_id,
      resolution_server,
      resolution_entity,
      r_created_at,
      r_updated_at,
      ...conflict
    } = conflictAndResolution;

    return {
      resolution_id,
      resolution_server,
      resolution_entity,
      r_created_at,
      r_updated_at,
      conflict,
    };
  });
};