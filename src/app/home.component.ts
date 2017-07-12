import {
  Component, AfterViewInit, OnDestroy, ViewChild, ElementRef,
  Renderer, trigger, state, transition, style, animate
} from '@angular/core';
import { Routes } from '@angular/router';
import { EncodingRouterComponent, encodingRoutes } from './encoding/routes/encoding.route';
import { sportRoutes } from './sport/sport.routes';
import { DashboardComponent, dashboardRoutes } from './dashboard/dashboard.component';
import { TicketingRoutes } from './tickets/module/ticketing.route';
import { AuthService } from './auth/auth.service';
import { ReportsComponent, reportsRoutes } from './reports';
import { User } from './auth/user.models';
import { adminRoutes } from './admin/admin.router';
import { environment } from '../environments/environment';
import {
  DashboardRouteGuard, SportRouteGuard, EncodingRouteGuard,
  TicketingRouteGuard, ReportsRouteGuard, AdminRouteGuard
} from './auth/scope.guard';
import { scrapingRoutes } from './scraping/scraping.module';
import { Title } from '@angular/platform-browser';
import { GameTrackerRouterComponent } from './game-tracker/game-tracker.component';

export const homeRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, children: dashboardRoutes, canActivate: [DashboardRouteGuard] },
  { path: 'sport', children: sportRoutes, canActivate: [SportRouteGuard] },
  { path: 'game-tracker', component: GameTrackerRouterComponent, canActivate: [SportRouteGuard] },
  { path: 'encoding', component: EncodingRouterComponent, children: encodingRoutes, canActivate: [EncodingRouteGuard] },
  { path: 'tickets', children: TicketingRoutes, canActivate: [TicketingRouteGuard] },
  { path: 'reports', component: ReportsComponent, children: reportsRoutes, canActivate: [ReportsRouteGuard] },
  { path: 'admin', children: adminRoutes, canActivate: [AdminRouteGuard] },
  { path: 'scraping', children: scrapingRoutes }
  // {
  //   path: '',
  //   redirectTo: '/dashboard/statistics'
  // },
];

declare var jQuery: any;

@Component({
  selector: 'sn-home',

  template: `
<div class="wrapper" [ngClass]="{'sidebar-inactive-l':menuInactiveDesktop, 'sidebar-active-m':menuActiveMobile}">
    <div class="topbar clearfix"  [style.background]= "topBarColor">
        <a id="omega-menu-button" href="#" (click)="toggleMenu($event)">
            <span class="fa fa-bars"></span>
        </a>
        <span class="topbar-title">{{title.getTitle()}}</span>
        <a id="options-menu-button" href="#" (click)="toggleTopMenu($event)">
            <span class="fa fa-ellipsis-h"></span>
        </a>
        <div id="topbar-icons" class="animated" [ngClass]="{'topbar-icons-visible flipInX':topMenuActive,'flipOutX':topMenuLeaving}">
            <!--<span class="topbar-search" (click)="onSearchClick($event)">-->
                <!--<input type="text" placeholder="Search" />-->
                <!--<span class="topbar-search-icon fa fa-search"></span>-->
            <!--</span>-->
            <!--<a href="#">-->
                <!--<span class="topbar-item-text">Messages</span>-->
                <!--<span class="topbar-icon fa fa-envelope-o animated swing"></span>-->
                <!--<span class="topbar-badge animated rubberBand">5</span>-->
            <!--</a>-->
            <!--<a href="#">-->
                <!--<span class="topbar-item-text">Settings</span>-->
                <!--<span class="topbar-icon fa fa-gear"></span>-->
            <!--</a>-->
            <!--<a href="#">-->
                <!--<span class="topbar-item-text">User</span>-->
                <!--<span class="topbar-icon fa fa-user"></span>-->
            <!--</a>-->
            <a href="javascript:void(0)" sn-chat></a>
            <a href="javascript:void(0)" sn-user-actions [user]="user"></a>
        </div>
    </div>
    <div class="sidebar" (click)="onMenuClick($event)">
        <div #scroller class="nano">
            <div class="nano-content sidebar-scroll-content">
                <div class="logo">
                    <img src="assets/images/logo/Synergy-logo-405x151.png" alt="" width="113">
                </div>
                <!--<div class="profile">-->
                    <!--<img src="assets/layout/images/profile.png" alt="" />-->
                    <!--<a id="profile-button" href="#" (click)="toggleProfile($event)">-->
                        <!--<span class="username">Peggy Olson</span>-->
                        <!--<i class="fa fa-fw fa-cog"></i>-->
                    <!--</a>-->
                    <!--<ul [@submenu]="profileActive ? 'visible' : 'hidden'">-->
                        <!--<li><a href="#"><i class="fa fa-fw fa-sliders"></i><span>Account</span></a></li>-->
                        <!--<li><a href="#"><i class="fa fa-fw fa-bell"></i><span>Notifications</span><span class="menu-badge">-->
                          <!--2-->
                        <!--</span></a></li>-->
                        <!--<li><a href="#"><i class="fa fa-fw fa-sign-out"></i><span>Logout</span></a></li>-->
                    <!--</ul>-->
                <!--</div>-->
                <sn-menu></sn-menu>
            </div>
        </div>
    </div>
    <div class="main">
        <router-outlet></router-outlet>
    </div>
    <div class="footer">
        <!--<img src="assets/layout/images/logo-colored.png" alt="" width="32">-->
        <span class="footer-text">Version: {{version}}</span>
    </div>
</div>





    <!-- LAYOUT TOPBAR COVER -->
    <!--
    <div id="layout-topbar-cover">
      <div id="layout-topbar-row">
        <div id="layout-topbar-left">
          <a href="#" id="logo"><img src="assets/images/logo/logo_50_nonprop.jpg"></a>
        </div>
        <div id="layout-topbar-right">
          <a id="menu-resize-btn" class="topbar-link Animated03">
            <img src="assets/images/menu-resize-btn-icon.svg" id="menu-resize-btn" />
          </a>
          <a id="mobile-menu-btn" class="topbar-link Animated03">
            <img src="assets/images/menu-btn-icon.svg" id="menu-btn-icon" />
          </a>
          <sn-user-top-link [user]="user"></sn-user-top-link>
          <sn-chat></sn-chat>
        </div>
      </div>
    </div>
    -->
    <!-- LAYOUT CONTAINER -->
    <!--
    <div id="layout-container">
      <div id="layout-container-row">
        <sn-sidebar-item></sn-sidebar-item>
        <div id="layout-portlets-cover">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    -->
`,
  animations: [
    trigger('submenu', [
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
export class HomeComponent implements AfterViewInit, OnDestroy {
  public user: User;
  public menuInactiveDesktop: boolean;
  public menuActiveMobile: boolean;
  public profileActive: boolean;
  public topMenuActive: boolean;
  public topMenuLeaving: boolean;
  public topBarColor: string;
  @ViewChild('scroller') public scrollerViewChild: ElementRef;
  public scroller: HTMLDivElement;
  documentClickListener: Function;
  menuClick: boolean;
  topMenuButtonClick: boolean;
  version: string;

  constructor(public renderer: Renderer,
              private authService: AuthService,
              public title: Title) {
    this.user = authService.currentUser();
    this.topBarColor = environment.topBarColor;
    this.version = environment.version;
  }

  ngAfterViewInit() {
    this.scroller = <HTMLDivElement> this.scrollerViewChild.nativeElement;

    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
      if (!this.isDesktop()) {
        if (!this.menuClick) {
          this.menuActiveMobile = false;
        }

        if (!this.topMenuButtonClick) {
          this.hideTopMenu();
        }

        this.menuClick = false;
        this.topMenuButtonClick = false;
      }
    });
  }

  toggleMenu(event: Event) {
    this.menuClick = true;
    if (this.isDesktop()) {
      this.menuInactiveDesktop = !this.menuInactiveDesktop;
      if (this.menuInactiveDesktop) {
        this.menuActiveMobile = false;
      }
    } else {
      this.menuActiveMobile = !this.menuActiveMobile;
      if (this.menuActiveMobile) {
        this.menuInactiveDesktop = false;
      }
    }

    if (this.topMenuActive) {
      this.hideTopMenu();
    }

    event.preventDefault();
  }

  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) {
      this.hideTopMenu();
    } else {
      this.topMenuActive = true;
    }

    event.preventDefault();
  }

  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 500);
  }

  onMenuClick(v) {
    this.menuClick = true;

    setTimeout(() => {
      jQuery(this.scroller).nanoScroller();
    }, 600);
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }
}
