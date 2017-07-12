import { Component, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TicketGroup, TicketLink } from '../ticketing.models';

@Component({
  selector: 'sn-ticket-create-container',
  template: `
  <div class="Container100">
  <sn-ticket-create  
    [ticketGroups]="ticketGroups$ | async"
    [gameLink]="gameLink$ | async"
    (submitTicket)="createTicket($event)">
  </sn-ticket-create>
  </div>
  `
})
export class TicketCreateContainerComponent implements OnInit, OnDestroy {

  @Input() gameIid: any;

  @Output() created = new EventEmitter(false);

  ticketGroups$: Observable<TicketGroup[]>;
  newTicketId$: Observable<number>;
  newTicketSubscription: Subscription;
  gameLink$: Observable<TicketLink>;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  createTicket(ticket) {
    this.newTicketSubscription = this.newTicketId$.subscribe( id => this.created.emit(id));
  }

  ngOnDestroy() {
    if (this.newTicketSubscription) {
      this.newTicketSubscription.unsubscribe();
    }
  }
}
