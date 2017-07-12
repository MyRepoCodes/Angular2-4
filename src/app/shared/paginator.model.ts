const DEFAULT_PAGE_SIZE = 25;
const FIRST_PAGE = 1;

// Pagination is 1-based. (first page = 1)

export class Pagination {
  page: number;
  total: number;
  size: number;
  pageLinks: number[];

  constructor() {
    this.page = FIRST_PAGE;
    this.total = 0;
    this.size = DEFAULT_PAGE_SIZE;
    this.pageLinks = [];
  }
}


