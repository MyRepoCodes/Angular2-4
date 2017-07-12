import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Ticket } from '../ticketing.models';

@Component({
  selector: 'sn-ticket-list-container',
  template: `
  <div class="Container100">
    <div class="Card">
      <div class="Container100">
        <p-panel header="Tickets Filter">
          <sn-ticket-filter-container>
          </sn-ticket-filter-container>
        </p-panel>
      </div>
      <div class="Container100 ui-fluid">
        <sn-ticket-list
          [tickets]="tickets$ | async"
          (navigateToCreate)="navigateToCreateTicket()">
        </sn-ticket-list>
      </div>
    </div>
  </div>
  `
})
export class TicketListContainerComponent implements OnInit {

  tickets$: Observable<Ticket[]>;

  @Output() navigateToCreate = new EventEmitter(false);

  constructor(
  ) {
  }

  ngOnInit() {
  }

  navigateToCreateTicket() {
    this.navigateToCreate.emit(true);
  }

}
