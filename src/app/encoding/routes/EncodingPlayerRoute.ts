import { OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  template: `<sn-encoding-player-container [deviceId]="deviceId"></sn-encoding-player-container>`
})
export class EncodingPlayerRouteComponent implements OnInit, OnDestroy {
  public deviceId: string;
  private subscription: Subscription;

    constructor(private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
      this.subscription = this.route.params.subscribe(params => {
        this.deviceId = params['deviceId'];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
