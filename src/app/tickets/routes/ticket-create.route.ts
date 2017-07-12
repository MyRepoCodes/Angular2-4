import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sn-ticket-create-route',
  template: `
  <sn-ticket-create-container
    (created)="onCreated($event)"
    [gameIid]="gameIid">
  </sn-ticket-create-container>
  `
})
export class TicketCreateRouteComponent implements OnInit, OnDestroy {

  gameIid: string;
  private sub;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe( params => {
      this.gameIid = params['gameIid'];
    });
  }


  onCreated(ticketId) {
    this.router.navigate(['/tickets/tickets', ticketId]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
