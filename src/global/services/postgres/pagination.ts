// TODO: support in transaction
import { countRecords } from './queries';
import { PaginationConfig } from '../../models/pagination-config';
import { ConflictQueryParams } from 'src/conflicts/models/conflict-query-params';

export const paginate = async (query: any, paginationConfig: PaginationConfig, queryParams: ConflictQueryParams = null) => {  
  const result: any = {};
  paginationConfig.fillData(result);
  if (paginationConfig.getCount) {
    result.total = +(await countRecords(query._single.table, queryParams)).count;
    result.lastPage = Math.ceil(result.total / result.perPage);
  }
  query.offset(paginationConfig.offset).limit(paginationConfig.perPage);
  result.data = await query;
  if (result.lastPage >= result.currentPage) {
    result.from = result.offset;
    result.to = result.offset + result.data.length;
  }
  return result;
};
