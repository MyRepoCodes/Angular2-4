import { Injectable } from '@angular/core';
import {
  CanActivate, Router, ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { NavigationService, IScopedNavigation } from '../navbar/navigation.service';

@Injectable()
export class CheckAccessGuard implements CanActivate {
  // private currentUrl: string;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) {
      return Observable.of(false);
    }

    // const item = this.navigationService.getActiveItem();
    // console.log(item);
    const navigationItem: IScopedNavigation = this.navigationService.findByPath(state.url);

    if (navigationItem && user.isInRole(navigationItem.scopes)) {
      return Observable.of(true);
    }

    this.router.navigate([NavigationService.ACCESS_DENIED_PATH]);
    return Observable.of(false);
  }

}


