import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sn-paginator',
    template: `
<p-paginator styleClass="paginator-bottom"
  [first]="first"
  [rows]="size"
  [totalRecords]="total"
  [pageLinkSize]="size"
  [rowsPerPageOptions]="rowsPerPage"
  (onPageChange)="paginate($event)"
></p-paginator>
`,
  styles: [`sn-paginator p-paginator .paginator-bottom { border-top: 0 none; }`],
  encapsulation: ViewEncapsulation.None
})
export class PaginatorComponent {
  @Input() set page(value) {
    this._page = value;
    this.updatePaginator();
  }
  get page() {
    return this._page;
  }
  @Input() set size(value) {
    this._size = value;
    this.updatePaginator();
  }
  get size() {
    return this._size;
  }
  @Input() set total(value){
    this._total = value;
    this.updatePaginator();
  };
  get total() {
    return this._total;
  }
  @Output() onPageSelected = new EventEmitter(false);

  first = 0;
  rowsPerPage = [25, 50, 100];

  private _page;
  private _size;
  private _total;

  paginate(p) {
    this.onPageSelected.emit({page: p.page + 1, size: +p.rows});
  }

  private updatePaginator() {
    if (this.page && this.size) {
      this.first = (this.page - 1) * this.size;
    }
  }
}
