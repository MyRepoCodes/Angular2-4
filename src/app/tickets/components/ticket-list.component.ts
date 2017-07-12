import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Ticket } from '../ticketing.models';

@Component({
  selector: 'sn-ticket-list',
  templateUrl: 'ticket-list.component.html',
  styles: [`section { border: 1px solid black; padding: 20px; margin: 10px; width: 30% }`]
})
export class TicketListComponent implements OnInit {

  @Input() tickets: Ticket[];
  @Output() navigateToCreate = new EventEmitter(false);

  constructor() {

  }

  ngOnInit() {

  }

  goToCreateTicket() {
    this.navigateToCreate.emit(true);
  }
}
