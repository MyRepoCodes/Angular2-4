import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TicketCreateRouteComponent } from './ticket-create.route';
import { TicketDetailsRouteComponent } from './ticket-details.route';
import { TicketGroupsComponent } from '../components/ticket-group.component';
import { TicketListRouteComponent } from './ticket-list.route';


export const ticketingRoutes: Routes = [
  { path: 'tickets', children : [
    { path: 'create', component: TicketCreateRouteComponent },
    { path: ':id', component: TicketDetailsRouteComponent },
    { path: '', component: TicketListRouteComponent },
  ] },
  { path: 'ticketgroups', component: TicketGroupsComponent}
];

@Component({
  selector: 'sn-ticketing-route',
  template: `<router-outlet></router-outlet>`
})
export class TicketingRouteComponent {
}
