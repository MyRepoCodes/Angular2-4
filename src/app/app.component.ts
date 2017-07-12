import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './shared/services/notification.service';
import { Router } from '@angular/router';
import { RouterPatch } from './sport/games/router-patch.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'sn-app',
  template: `
  <p-growl [value]="Notifications" sticky="true"></p-growl>
  <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private notificationService: NotificationService,
              public router: Router) {
  }

  ngOnInit() {
    this.subscription = RouterPatch.navigateByUrl.subscribe((url: string) => {
      this.router.navigateByUrl(url);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get Notifications() {
    return this.notificationService.messages;
  }
}
