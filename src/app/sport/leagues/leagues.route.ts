import { Routes } from '@angular/router';
import { LeaguesComponent } from './leagues.component';
import { LeagueComponent } from './league.component';

export const leaguesRoutes: Routes = [
  { path: '', component: LeaguesComponent },
  { path: 'create', component: LeagueComponent, data: { mode: 'create' } },
  { path: ':id', component: LeagueComponent, data: { mode: 'edit' } }
];
