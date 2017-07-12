import { IUserRef } from '../auth';
import { Entity } from '../shared/entities/entity';

export class Ticket extends Entity {
  description: string;
  type: string[];
  links: TicketLink[];
  comments: TicketComment[];
  deadline: Date;
  creationDate: Date;
  creator: IUserRef;
  ticketOwner: IUserRef;
  name: string;
}


export class TicketLink {
  id: number;
  name: string;
  url: string;

  constructor(name, url) {
    this.name = name || url;
    this.url = url;
  }
}


export class TicketComment {
  user: IUserRef;
  comment: string;
  timestamp: Date;

  constructor(comment, timestamp) {
    this.comment = comment;
    this.timestamp = timestamp;
  }
}


export class TicketGroup extends Entity {
  name: string;
  issueTypes: IssueType[];

  constructor(name) {
    super();
    this.name = name;
    this.issueTypes = [];
  }
}

export class TicketStatus {
  static UNCLAIMED = 'Unclaimed';
  static OPEN = 'Open';
  static CLOSED = 'Closed';

  static all = [
    TicketStatus.UNCLAIMED,
    TicketStatus.OPEN,
    TicketStatus.CLOSED
  ];
}

export class ChatRoom extends Entity {
  name: String;
  watchersIds: string[];
  messages: ChatMessage[];
  ticket: Ticket;
  unreadMessagesCount = 0;
}

export class ChatMessage {
  id: string;
  text: string;
  user: IUserRef;
  creationDate: Date;
  thread: string;
  isUnread: boolean;
}



export class IssueType {
  title: string;
  controls: IssueControl[];

  constructor() {
    this.controls = [];
  }
}

export class IssueControl {
  id: number;
  title: string;
  type: string;
  required: boolean;
  data;

  constructor() {
    this.data = {};
    this.required = false;
  }
}
