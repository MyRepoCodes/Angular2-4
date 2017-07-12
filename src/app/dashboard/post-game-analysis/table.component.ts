import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-table',
  templateUrl: './table.html'
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() data: any[];
  @Input() first;
  @Input() page;
  @Input() size;
  @Input() total;
  @Input() rowsPerPage;
  @Output() paginate = new EventEmitter(false);

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
