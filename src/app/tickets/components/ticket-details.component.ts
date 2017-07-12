import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Ticket, TicketComment, ChatRoom } from '../ticketing.models';
import { UserRef } from '../../auth';
import { Scopes } from '../../auth/scopes';

@Component({
  selector: 'sn-ticket-details',
  templateUrl: 'ticket-details.component.html'
})
export class TicketDetailsComponent {

  @Input() ticket: Ticket;
  @Input() chatRoom: ChatRoom;
  @Input() user: UserRef;

  @Output() comment = new EventEmitter(false);
  @Output() close = new EventEmitter(false);
  @Output() assign = new EventEmitter(false);
  @Output() watchProp = new EventEmitter(false);

  addComment(text) {
    const comment = new TicketComment(text.value, new Date());
    this.comment.emit(comment);
    text.value = '';
  }

  assignToMe() {
    this.assign.emit(true);
  }

  closeTicket() {
    this.close.emit(true);
  }

  watchChatRoom() {
    this.watchProp.emit(true);
  }


  cantClaim() {
    return this.ticket.ticketOwner && this.ticket.ticketOwner.id === this.user.id;
  }

  isAdmin(user) {
    return user.scopes.indexOf(Scopes.SilverOpsAdmin) !== -1;
  }

}

