import { callQuery } from './common-queries';
import { PaginationConfig } from '../../models/pagination-config';
import { trx, knexQuery } from './knex-types';

export const paginate = async (countFunction: Function, query: knexQuery, paginationConfig: PaginationConfig, inTransaction?: trx) => {
  const result: any = {};
  paginationConfig.fillData(result);
  if (paginationConfig.getCount) {
    result.total = +(await countFunction(query, inTransaction)).count;
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
