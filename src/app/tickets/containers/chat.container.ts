import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from '../ticketing.models';
import { AuthService } from '../../auth/auth.service';

@Component({
  // tslint:disable-next-line
  selector: '[sn-chat]',
  template: `
<span class="topbar-item-text">Messages</span>
<span class="topbar-icon fa fa-envelope-o animated swing" (click)="toggleChatWindow()"></span>
<span class="topbar-badge animated rubberBand">{{totalUnreadMessages$ | async}}</span>

<sn-chat-window
  [(visible)]="chatWindowVisible"
  [chatRooms]="chatRooms$ | async"
  [messages]="messages$ | async" 
  [user]="currentUser"
  (chatRoomSelected)="loadChatRoom($event)" 
  (addMessageToChatRoom)="addMessage($event)" 
  (markRead)="messageRead($event)"
></sn-chat-window>`
})
export class ChatContainerComponent implements OnInit {

  chatRooms$: Observable<ChatRoom[]>;
  messages$;
  currentUser;
  totalUnreadMessages$;

  chatWindowVisible = false;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUser();

  }

  loadChatRoom(id) {
  }

  addMessage(args) {
  }

  messageRead(args) {
  }

  toggleChatWindow() {
    this.chatWindowVisible = !this.chatWindowVisible;
  }
}
