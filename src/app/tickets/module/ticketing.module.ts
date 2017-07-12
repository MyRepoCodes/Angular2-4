import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HttpTicketingService } from './ticketing.service';
import { ApiTicketService } from './api.service';
import { TicketsInfoComponent } from './components/tickets.component';
import { CommentsInfoComponent } from './components/comments.component';
import { TicketinfoComponent } from './components/ticket.component';
import { TieredMenuModule } from 'primeng/primeng';

@NgModule({
  imports: [
    SharedModule,
    TieredMenuModule,
  ],
  declarations: [
    TicketsInfoComponent,
    CommentsInfoComponent,
    TicketinfoComponent
  ],
  providers: [
    HttpTicketingService,
    ApiTicketService
  ]
})
export class TicketingModule {

}
