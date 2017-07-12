import { Routes } from '@angular/router';
import { TicketsComponent } from '../../shared/components/tickets/tickets.component';
import { TicketComponent } from '../../shared/components/tickets/ticket.component';
import { CommentsComponent } from '../../shared/components/tickets/comments.component';
import { TicketinfoComponent } from './components/ticket.component';
export const TicketingRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TicketsComponent },
  { path: 'create', component: TicketComponent, data: { mode: 'create' } },
  { path: ':name', component: TicketComponent, data: { mode: 'edit' } },
  { path: 'comment/:id' , component: CommentsComponent},
  { path: 'ontemp', component: TicketinfoComponent, data: { mode: 'create' }},
];

