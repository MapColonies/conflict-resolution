import { countRecordsByQuery, callQuery } from './common-queries';
import { PaginationConfig } from '../../models/pagination-config';
import { trx } from './knex-types';

export const paginate = async (query: any, paginationConfig: PaginationConfig, inTransaction?: trx) => {
  const result: any = {};
  paginationConfig.fillData(result);
  if (paginationConfig.getCount) {
    result.total = +(await countRecordsByQuery(query)).count;
    result.lastPage = Math.ceil(result.total / result.perPage);
  }
  query.offset(paginationConfig.offset).limit(paginationConfig.perPage);
  result.data = await callQuery(query, inTransaction);
  if (result.lastPage >= result.currentPage) {
    result.from = result.offset;
    result.to = result.offset + result.data.length;
  }
  return result;
};
