import { Component } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'sn-sidebar-item',
  template: `
     <div id="layout-menu-cover" class="nano Animated03">
        <div id="layout-menu-cover-scroll-content" class="nano-content">                
           <ul id="layout-menu" class="layout-tab-submenu active" style="height: auto;">
             <!--<sn-menu-item *ngFor="let item of navigationService.getSidebarItems()" [items]="item"></sn-menu-item>-->
           
             <li *ngFor="let item of navigationService.getSidebarItems()" role="menuitem">
              <a href="#" class="menulink"> <span> {{item.label}}</span></a>
              <ul *ngIf="item.items && item.items.length > 0" role="menu">                        
                <li *ngFor="let menu of item.items" role="menuitem">
                  <a class="menulink" [routerLink]="menu.routerLink" routerLinkActive="active-menu">
                    <i class="{{menu.icon}}"></i><span>{{menu.label}}</span>
                  </a>
                </li>
              </ul>
            </li>
           
           </ul>
        </div>
      </div>
  `,
})
export class SidebarItemComponent {
  constructor(public navigationService: NavigationService) {

  }
}
