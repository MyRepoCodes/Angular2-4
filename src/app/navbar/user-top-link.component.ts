import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../auth';
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { User } from '../auth/user.models';

@Component({
  // tslint:disable-next-line
  selector: '[sn-user-actions]',
  template: `
<!--<p-menu #menu popup="popup" [model]="items"></p-menu>-->
<span class="topbar-item-text">Logout</span>
<span class="topbar-icon fa fa-sign-out" (click)="logoutAction()"></span>
<!--<span class="topbar-icon fa fa-sign-out" (click)="toggelMenu(menu, $event)">-->
`
})
export class UserActionsComponent implements OnInit {
  @Input() user: User;
  @Output() onLogout = new EventEmitter(false);

  public items: MenuItem[];

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.items = [
      { label: 'User Profile', icon: 'fa-user' },
      { label: 'Settings', icon: 'fa-gear' },
      { label: 'Logout', icon: 'fa-sign-out', command: (event) => { this.logoutAction(); } }
    ];
  }

  toggelMenu(menu, event) {
    console.log('user clicked');
    menu.toggle(event);
    return false;
  }

  logoutAction() {
    this.authService.logout().subscribe(
      res => this.router.navigate(['/auth']),
      err => console.log(err)
    );
    this.onLogout.emit(true);
  }
}
