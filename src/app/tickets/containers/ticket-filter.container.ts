import { Component, OnInit } from '@angular/core';
import { TicketStatus } from '../ticketing.models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sn-ticket-filter-container',
  template: `
    <div class="ui-grid-row">
      <div class="ui-g-9">
        <p-dropdown 
          [options]="ticketGroupOptions$ | async" 
          [ngModel]="selectedItems.ticketGroup" 
          (ngModelChange)="onItemSelected($event, 'ticketGroup')">
        </p-dropdown>
        <p-dropdown 
          [options]="statusOptions$ | async" 
          [ngModel]="selectedItems.status" 
          (ngModelChange)="onItemSelected($event, 'status')">
        </p-dropdown>
      </div>
      <div class="ui-g-3">
        <button pButton (click)="onSearch()" label="Search" icon="fa-search" class="Fright"></button>
      </div>                        
    </div>
  `
})
export class TicketFilterContainerComponent implements OnInit {

  ticketGroupOptions$: Observable<any[]>;
  statusOptions$: Observable<any[]>;

  selectedItems;

  public static mapStringToSelectItem(str: string) {
    return {label: str, value: str};
  }

  constructor(
  ) {
      this.selectedItems = {
        status: '',
        ticketGroup: ''
      };
  }

  ngOnInit() {
    const statusOptions = [
      this.initialOption('Any Status'),
      ...TicketStatus.all.map(TicketFilterContainerComponent.mapStringToSelectItem)
    ];
    this.statusOptions$ = Observable.of(statusOptions);

  }

  onItemSelected(value, key) {
    this.selectedItems[key] = value;
  }

  onSearch() {
  }

  private initialOption = (label) => { return {label: label, value: ''}; };
}
