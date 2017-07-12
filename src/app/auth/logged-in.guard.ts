import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.authService.isLogged()) {
      this.authService.redirectUrl = state.url;
      this.router.navigate(['/auth']);
      return Observable.of(false);
    } else {
      if (this.authService.currentUser()) {
        return Observable.of(true);
      } else {
        Observable.of(false);
      }
    }
  }
}
