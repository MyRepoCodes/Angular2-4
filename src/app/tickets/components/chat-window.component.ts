import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatRoom, ChatMessage } from '../ticketing.models';
import { Scopes } from '../../auth/scopes';


@Component({
  selector: 'sn-chat-window',
  templateUrl: 'chat-window.component.html',
  styles: [`
      .chat-wrapper {
        position: fixed;
        bottom: 20px;
        right: 20px;
        max-width: 400px;
        background-color: #0BC3F1;
      }
      .message-box {
        overflow: auto;
        max-height: 500px;
      }

      ::-webkit-scrollbar
      {
        width: 6px;  /* for vertical scrollbars */
        height: 6px; /* for horizontal scrollbars */
      }

      ::-webkit-scrollbar-track
      {
        background: rgba(0, 0, 0, 0.1);
      }

      ::-webkit-scrollbar-thumb
      {
        background: rgba(0, 0, 0, 0.5);
      }

    `],
})
export class ChatWindowComponent implements OnInit {

  @Input() messages;
  @Input() user;
  @Input() visible: boolean;

  @Input() set chatRooms(chatRooms: ChatRoom[]) {
    if (chatRooms) {
      const chatRoomsOptions = chatRooms.map(cr => {
        return { label: cr.name, value: cr.id, unread: cr.unreadMessagesCount };
      });
      chatRoomsOptions.unshift({ label: 'Select Chat Room', value: '', unread: undefined });
      this.chatRoomsOptions = chatRoomsOptions;
    }
  }

  @Output() chatRoomSelected = new EventEmitter(false);
  @Output() addMessageToChatRoom = new EventEmitter(false);
  @Output() markRead = new EventEmitter(false);
  @Output() visibleChange = new EventEmitter(false);

  chatRoomsOptions;
  selectedChatRoomId;
  threadOptions;
  selectedThread;

  ngOnInit() {
    this.threadOptions = [
      {label: 'Default Thread', value: 'default'},
      {label: 'Admin Thread', value: 'secret'}
    ];
    this.selectedThread = 'default';
  }

  chatRoomSelect(item) {
    if (item.value) {
      this.selectedChatRoomId = item.value;
      this.chatRoomSelected.emit(item.value);
    } else {
      this.selectedChatRoomId = undefined;
      this.messages = undefined;
    }
  }

  chatRoomIsSelected() {
    return !!this.selectedChatRoomId && this.selectedChatRoomId !== '';
  }

  threadIsSelected() {
    return !!this.selectedThread && this.selectedThread.value !== '';
  }

  addMessage(chatRoomId, messageText) {
    const message = new ChatMessage();
    message.text = messageText;
    message.thread = this.selectedThread;
    this.addMessageToChatRoom.emit({ chatRoomId, message });
  }

  messageRead(message) {
    if (message.isUnread) {
      this.markRead.emit({ chatRoomId: this.selectedChatRoomId, messageId: message.id });
    }
  }

  isAdmin(user) {
    return user.scopes.indexOf(Scopes.SilverOpsAdmin) !== -1;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
