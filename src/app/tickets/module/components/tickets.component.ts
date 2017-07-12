import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { HttpTicketingService } from '../ticketing.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MenuItem } from 'primeng/primeng';
import { orderBy } from '../../../shared/utils/ArrayUtils';
import { FilterUtils } from '../../../shared/utils/filter-utils';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

const emptyTicket = {
  result: {
    name: '',
    assignee: '',
    template: '',
    link: '',
    group: '',
    status: ''
  }
};
@Component({
  selector: 'sn-ticketdatas',
  templateUrl: 'tickets.component.html'
})

export class TicketsInfoComponent implements OnInit {
  title: string;
  loading: boolean;

  ngOnInit() {
    this.title = 'Ticket  List';
    this.loading = true;
  }
}



