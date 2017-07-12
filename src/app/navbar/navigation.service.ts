import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { EncodingRoutingConstants } from '../encoding/routes/encoding.route';
import { AuthService } from '../auth/auth.service';
import { Scopes } from '../auth/scopes';
import { Router } from '@angular/router';

export interface IScopedNavigation {
  scopes?: string[];
  navigationItems: MenuItem[];
}

@Injectable()
export class NavigationService {
  public static ACCESS_DENIED_PATH = '/access-denied';

  private entries: IScopedNavigation[] = [
    {
      scopes: [Scopes.OperationsStuff, Scopes.OperationsAdmin, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'GAME TRACKER',
          icon: 'fa-futbol-o',
          routerLink: ['/game-tracker']
        }
      ]
    },
    /*{
      scopes: [Scopes.OperationsStuff, Scopes.OperationsAdmin, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'GAMES',
          icon: 'fa-futbol-o',
          routerLink: ['/sport/games/list']
        },
      ],
    },*/
    {
      scopes: [Scopes.Dashboard, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'DASHBOARD',
          icon: 'fa-home',
          items: [
            { label: 'Dashboard', routerLink: ['/dashboard/statistics'], icon: 'fa-bars' },
            { label: 'PGA', routerLink: ['/dashboard/post-game-analysis'], icon: 'fa-bars' },
            { label: 'Server Ops', routerLink: ['/dashboard/server-ops'], icon: 'fa-bars' },
            // { label: 'Acces Denied', routerLink: ['/access-denied'], icon: 'fa-bars' },
            // { label: 'Not Found', routerLink: ['/not-found'], icon: 'fa-bars' },
            // { label: 'Error', routerLink: ['/error'], icon: 'fa-bars' },
          ]
        },
      ],
    },
    {
      scopes: [Scopes.PayrollEditor, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'REPORTS',
          icon: 'fa-file-o',
          items: [
            { label: 'Payroll', routerLink: ['/reports/payroll'], icon: 'fa-money' }
          ]
        }
      ]
    },
    {
      scopes: [Scopes.OperationsStuff, Scopes.OperationsAdmin, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'SPORT',
          icon: 'fa-futbol-o',
          items: [
            { label: 'Sports', routerLink: ['/sport/sports/list'], icon: 'fa-square' },
            { label: 'Leagues', routerLink: ['/sport/leagues'], icon: 'fa-square' },
            { label: 'Conferences', routerLink: ['/sport/conferences/list'], icon: 'fa-square' },
            { label: 'Divisions', routerLink: ['/sport/divisions/list'], icon: 'fa-square' },
            { label: 'Teams', routerLink: ['/sport/teams/list'], icon: 'fa-square' },
            { label: 'Players', routerLink: ['/sport/players/list'], icon: 'fa-square' },
            { label: 'Games', routerLink: ['/sport/games/list'], icon: 'fa-square' },
            { label: 'Seasons', routerLink: ['/sport/seasons/list'], icon: 'fa-square' },
            { label: 'Competitions', routerLink: ['/sport/competitions/list'], icon: 'fa-square' },
            { label: 'Venues', routerLink: ['/sport/venues/list'], icon: 'fa-square' },
            { label: 'Compare tool', routerLink: ['/sport/compare-tool'], icon: 'fa-square' }
          ]
        }
      ]
    },
    {
      scopes: [Scopes.OperationsAdmin, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'ENCODING',
          icon: 'fa-video-camera',
          routerLink: [EncodingRoutingConstants.PREFIX],
          items: [
            {
              label: 'Player',
              routerLink: [EncodingRoutingConstants.PREFIX + '/' + EncodingRoutingConstants.PLAYER],
              icon: 'fa-square'
            },
            {
              label: 'Schedule',
              routerLink: [EncodingRoutingConstants.PREFIX + '/' + EncodingRoutingConstants.SCHEDULE],
              icon: 'fa-square'
            },
            {
              label: 'Recordings',
              routerLink: [EncodingRoutingConstants.PREFIX + '/' + EncodingRoutingConstants.RECORDINGS],
              icon: 'fa-square'
            }
          ]
        },
      ]
    },
    {
      scopes: [Scopes.Logger, Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'TICKETING',
          icon: 'fa-tasks',
          items: [
            { label: 'Tickets', routerLink: ['/tickets'], icon: 'fa-square' },
            // todo: notImplemented
            // { label: 'Ticket Groups', routerLink: ['/tickets/groups'], icon: 'fa-square' }
          ]
        }
      ]
    },
    {
      scopes: [Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          label: 'ADMIN',
          icon: 'fa-snowflake-o',
          items: [
            { label: 'Logger Mappings', routerLink: ['/admin/loggers-mapping'], icon: 'fa-square' }
          ]
        }
      ]
    },
    {
      scopes: [Scopes.SilverOpsAdmin],
      navigationItems: [
        {
          icon: 'fa-spoon',
          label: 'CONFLICT RESOLUTION',
          items: [
            { label: 'Rules', routerLink: ['/scraping/rules'], icon: 'fa-square' },
            { label: 'Conflicts', routerLink: ['/scraping/conflicts'], icon: 'icon-list3' }
          ]
        }
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
  }

  public getSidebarItems(): MenuItem[] {
    const results = this.entries.filter(i => this.checkScopes(i))
      .map((item) => item.navigationItems)
      .reduce((pre, cur) => pre.concat(cur));
    return results;
  }

  public findByPath(path: string): IScopedNavigation {
    const matchedScoupes = this.entries.filter(e => {
      for (const item of e.navigationItems) {
        if (this.findItemByPath(item, path)) {
          return true;
        }
        return false;
      }
    });
    if (matchedScoupes.length > 0) {
      return matchedScoupes[0];
    }
    return null;
  }

  public getStartUrl(): string[] {
    const user = this.authService.currentUser();
    const matchedScoupes = this.entries.filter(entry => {
      return user.isInRole(entry.scopes);
    });

    const result = this.getFirstPath(matchedScoupes[0].navigationItems);
    return result || [NavigationService.ACCESS_DENIED_PATH];
  }

  private getFirstPath(items: MenuItem[]) {
    if (!items) {
      return false;
    }

    for (const item of items) {
      if (item.routerLink) {
        return item.routerLink;
      }

      const result = this.getFirstPath(item.items);
      if (result) {
        return result;
      }
    }
  }

  private findItemByPath(item: MenuItem, needle: string) {
    // console.log('findItemByPath. Item: ' + item.label + '|' + item.routerLink + ' Needle: ' + needle);
    if (!item.items) {
      return false;
    }
    for (const child of item.items) {
      if (!child.routerLink) {
        return false;
      }
      // console.log('Try to compare ' + child.routerLink + ' with ' + needle);
      const pattern = child.routerLink + '.?';
      const regex = new RegExp(pattern);

      let result = regex.test(needle);
      if (result) {
        return result;
      } else {
        result = this.findItemByPath(child, needle);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }

  private checkScopes(item: IScopedNavigation) {
    if (!item.scopes) {
      return true;
    }

    const matchedScopes = this.authService.currentUser().scopes.filter(s => {
      return item.scopes.indexOf(s) >= 0;
    });
    return matchedScopes.length > 0;
  }
}
