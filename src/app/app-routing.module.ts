import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, homeRoutes } from './home.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { LoginComponent } from './auth/login.component';
import { AccessDeniedComponent } from './auth/access-denied.component';
import { NotFoundComponent } from './auth/not-found.component';
import { ErrorComponent } from './auth/error.component';
const routes: Routes = [
  { path: 'auth', component: LoginComponent },
  { path: '', component: HomeComponent, children: homeRoutes, canActivate: [LoggedInGuard] },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: []
})
export class WebopsRoutingModule { }
