import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Scopes } from './scopes';
import { NavigationService } from '../navbar/navigation.service';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private scopes: string[], private authService: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) {
      return Observable.of(false);
    }
    if (!user.isInRole(this.scopes)) {
      this.router.navigate([NavigationService.ACCESS_DENIED_PATH]);
      return Observable.of(false);
    }
    return Observable.of(true);
  }
}

@Injectable()
export class DashboardRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.Dashboard, Scopes.SilverOpsAdmin], authService, router);
  }
}

@Injectable()
export class ReportsRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.PayrollEditor, Scopes.SilverOpsAdmin], authService, router);
  }
}

@Injectable()
export class SportRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.OperationsStuff, Scopes.OperationsAdmin, Scopes.SilverOpsAdmin], authService, router);
  }
}

@Injectable()
export class EncodingRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.OperationsAdmin, Scopes.SilverOpsAdmin], authService, router);
  }
}

@Injectable()
export class TicketingRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.Logger, Scopes.SilverOpsAdmin], authService, router);
  }
}

@Injectable()
export class AdminRouteGuard extends ScopeGuard {
  constructor(authService: AuthService, router: Router) {
    super([Scopes.SilverOpsAdmin], authService, router);
  }
}
