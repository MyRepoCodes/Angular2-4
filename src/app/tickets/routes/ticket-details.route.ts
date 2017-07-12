import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sn-ticket-details-route',
  template: `
  <sn-ticket-details-container
    [ticketId]="ticketId">
  </sn-ticket-details-container>
  `
})
export class TicketDetailsRouteComponent implements OnInit, OnDestroy {

  ticketId: string;
  private sub;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
   this.sub = this.route.params.subscribe( params => {
     this.ticketId = params['id'];
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
