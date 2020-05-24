import { PaginationResult } from './pagination-result';

const defaultPerPage = 10;
export const minPerPage = 1;
export const maxPerPage = 100

export class PaginationConfig {
  offset: number;
  constructor(public currentPage: number = 1, public perPage: number = defaultPerPage, public getCount: boolean = true) {
    this.currentPage = +currentPage;
    if (currentPage < 1) this.currentPage = 1;
    if (perPage < minPerPage) this.perPage = defaultPerPage;
    if (perPage > maxPerPage) this.perPage = maxPerPage;
    this.offset = (this.currentPage - 1) * this.perPage;
  }

  fillData(result: PaginationResult<any>) {
    result.currentPage = this.currentPage;
    result.perPage = this.perPage;
    result.offset = this.offset;
    return result;
  }
};
