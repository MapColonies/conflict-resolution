import { db } from '../global/services/postgres/db-connection';
import { postgis } from '../global/services/postgis';
import tableNames = require('../global/services/postgres/table-names');
import { paginate } from '../global/services/postgres/pagination';
import { PaginationConfig } from 'src/global/models/pagination-config';
import { FullResult } from './models/full-result';
import { PaginationResult } from 'src/global/models/pagination-result';

// TODO: should be used with nest-knex? move functions into a service?
const baseQuery = db({ r: tableNames.results })
  .join(tableNames.conflicts, { 'r.conflict_id': 'conflicts.id' })
  .select([
    '*',
    'r.created_at as r_created_at',
    'r.updated_at as r_updated_at',
    postgis.asGeoJSON('location'),
  ]);

export const getAllResults = async (paginationConf: PaginationConfig): Promise<PaginationResult<FullResult>> => {
  const query = baseQuery.clone();
  if (!paginationConf) {
    return deconstructToConflictAndResult(await query);
  }
  const paginationResult = await paginate(query, paginationConf);
  paginationResult.data = deconstructToConflictAndResult(paginationResult.data);
  return paginationResult;
};

export const getResultById = async (id: string): Promise<FullResult> => {
  const query = baseQuery.clone();
  const fullResults = await query.where('r.id', id);
  return (deconstructToConflictAndResult(fullResults))[0];
};

// TODO: build dynamic \ better way
const deconstructToConflictAndResult = (fullResults) => {
  return fullResults.map((fr) => {
    // remove fields
    const { conflict_id, deleted_at, ...conflictAndResult } = fr;

    const {
      result_id,
      result_server,
      result_entity,
      r_created_at,
      r_updated_at,
      ...conflict
    } = conflictAndResult;

    return {
      result_id,
      result_server,
      result_entity,
      r_created_at,
      r_updated_at,
      conflict,
    };
  });
};