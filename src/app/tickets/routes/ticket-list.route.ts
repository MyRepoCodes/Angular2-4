import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sn-ticket-list-route',
  template: `
  <sn-ticket-list-container
    (navigateToCreate)="navigateToCreateTicket()">
  </sn-ticket-list-container>
  `
})
export class TicketListRouteComponent {

  constructor(private router: Router) {

  }

  navigateToCreateTicket() {
    this.router.navigate(['/tickets/tickets/create']);
  }

}
