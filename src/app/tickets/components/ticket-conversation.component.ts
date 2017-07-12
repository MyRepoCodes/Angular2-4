import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChatRoom, ChatMessage } from '../ticketing.models';
import { UserRef } from '../../auth';

@Component({
  selector: 'sn-ticket-conversation',
  templateUrl: 'ticket-conversation.component.html'
})
export class TicketConversationComponent implements OnInit {

  @Input() chatRoom: ChatRoom;
  @Input() user: UserRef;

  @Output() comment = new EventEmitter(false);
  @Output() watchProp = new EventEmitter(false);

  constructor() {
  }

  ngOnInit() {
  }

  watchChatRoom() {
    this.watchProp.emit(true);
  }

  addComment(text) {
    const message = new ChatMessage();
    message.text = text.value;
    message.thread = 'default';
    this.comment.emit({chatRoomId: this.chatRoom.id, message: message});
    text.value = '';
  }

}
