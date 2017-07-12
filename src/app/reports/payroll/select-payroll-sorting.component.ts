import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sn-select-payroll-sorting',
    template: `
<p-dropdown 
  [options]="sortOptions" 
  [ngModel]="sort"
  (onChange)="sortSelected($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
></p-dropdown>
`
})
export class SelectPayrollSortingComponent {
  @Input() sort;
  @Output() sortChanged = new EventEmitter(false);

  sortOptions;

  private availableSortOptions = [
    { label: 'Note (Zero)', value: 'note_zero' },
    { label: 'Note', value: 'note' },
    { label: 'Date', value: 'date' },
    { label: 'Day', value: 'day' },
  ];

  constructor() {
    this.sortOptions = this.availableSortOptions;
  }

  sortSelected(sort) {
    this.sort = sort;
    this.sortChanged.emit(sort);
  }
}
