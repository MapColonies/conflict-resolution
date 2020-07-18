import { PaginationResult } from './pagination-result';
import { minPage, defaultPerPage, minPerPage, maxPerPage} from '../constants';

export class PaginationConfig {
  offset: number;
  constructor(public currentPage: number = minPage, public perPage: number = defaultPerPage, public getCount: boolean = true) {
    this.currentPage = +currentPage;
    if (currentPage < minPage) this.currentPage = minPage;
    if (perPage < minPerPage) this.perPage = defaultPerPage;
    if (perPage > maxPerPage) this.perPage = maxPerPage;
    this.offset = this.currentPage * this.perPage;
  }

  fillData(result: PaginationResult<any>) {
    result.currentPage = this.currentPage;
    result.perPage = this.perPage;
    result.offset = this.offset;
    return result;
  }
};
