import { PaginationResult } from './pagination-result';
import { MIN_PAGE, DEFAULT_PER_PAGE, MIN_PER_PAGE, MAX_PER_PAGE} from '../constants';

export class PaginationConfig {
  offset: number;
  constructor(public currentPage: number = MIN_PAGE, public perPage: number = DEFAULT_PER_PAGE, public getCount: boolean = true) {
    this.currentPage = +currentPage;
    if (currentPage < MIN_PAGE) this.currentPage = MIN_PAGE;
    if (perPage < MIN_PER_PAGE) this.perPage = DEFAULT_PER_PAGE;
    if (perPage > MAX_PER_PAGE) this.perPage = MAX_PER_PAGE;
    this.offset = this.currentPage * this.perPage;
  }

  fillData(result: PaginationResult<any>) {
    result.currentPage = this.currentPage;
    result.perPage = this.perPage;
    result.offset = this.offset;
    return result;
  }
};
