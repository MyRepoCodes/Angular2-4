import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { NavigationService } from './navbar/navigation.service';

@Component({
  selector: 'sn-menu',
  template: `
        <div class="menu">
            <ul sn-submenu [item]="model" root="true"></ul>
        </div>
    `
})
export class MenuComponent implements OnInit {

  model: MenuItem[];

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.model = this.navigationService.getSidebarItems();
  }
}

@Component({
  // tslint:disable-next-line
  selector: '[sn-submenu]',
  template: `
        <ul>
            <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
                <li [ngClass]="{'active-menuitem': isActive(i)}">
                    <a [href]="child.url||'#'" (click)="itemClick($event,child,i)">
                        <i class="fa fa-fw" [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <ul sn-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" ></ul>
                </li>
            </ng-template>
        </ul>
    `,
  animations: [
    trigger('children', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class SubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  activeIndex: number;

  constructor(public router: Router, public location: Location) {
  }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    this.activeIndex = (this.activeIndex === index) ? null : index;

    if (!item.url || item.routerLink) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    }

    if (item.routerLink) {
      this.router.navigate(item.routerLink);
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }
}
