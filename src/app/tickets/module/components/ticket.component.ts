import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'sn-ticketinfo',
  templateUrl: 'ticket.component.html'
})
export class TicketinfoComponent implements OnInit {
  filter = {
    linkType: '',
    linkRef: ''
  };
  // constructor() {
  //   this.filter.linkType = 'test';
  //   this.filter.linkRef = 'test';
  // }
  ngOnInit() {
    // this.loading = true;
    // this.title = 'Create Ticket';
  }

}
