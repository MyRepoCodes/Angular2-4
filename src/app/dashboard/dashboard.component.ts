import { Component } from '@angular/core';
import { Routes } from '@angular/router';
// import { PgaRoute } from './post-game-analysis/pga.route';
import { ServerStatisticsComponent } from './server-statistics/server-statistics.component';
import { ContainersComponent } from './serverops/containers.component';

export const dashboardRoutes: Routes = [
  // { path: 'post-game-analysis', component: PgaRoute },
  { path: 'server-ops', component: ContainersComponent },
  { path: 'statistics', component: ServerStatisticsComponent },
  {
    path: '', redirectTo: 'statistics', pathMatch: 'full'
  }
];

@Component({
  selector: 'sn-dashboard',
  template: `<router-outlet></router-outlet>`
})
export class DashboardComponent {
}
