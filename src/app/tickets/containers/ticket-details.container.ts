import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Ticket, ChatRoom } from '../ticketing.models';
import { UserRef } from '../../auth';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'sn-ticket-details-container',
  template: `
  <div class="Container100">
    <div class="Card">
      <sn-ticket-details
        [ticket]="ticket$ | async"
        [user]="currentUser"
        (assign)="assignToCurrentUser()"
        (close)="closeTicket()">
      </sn-ticket-details>
    </div>
    <div class="EmptyBox20"></div>
    <div class="Card">
      <sn-ticket-conversation
        [chatRoom]="chatRoom$ | async"
        [user]="currentUser"
        (comment)="addComment($event)"
        (watchProp)="watchChatRoom()">
      </sn-ticket-conversation>    
    </div>
  </div>
`
})
export class TicketDetailsContainerComponent implements OnInit {

  @Input() ticketId: string;

  ticket$: Observable<Ticket>;
  chatRoom$: Observable<ChatRoom>;
  currentUser: UserRef;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
  }

  addComment(args) {
  }

  assignToCurrentUser() {
  }

  closeTicket() {
  }

  watchChatRoom() {
  }

}
