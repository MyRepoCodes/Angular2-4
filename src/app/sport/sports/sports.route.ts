import { Routes } from '@angular/router';
import { SportsComponent } from './sports.component';
import { SportComponent } from './sport.component';

export const sportsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: SportsComponent },
  { path: 'create', component: SportComponent, data: { mode: 'create' } },
  { path: ':id', component: SportComponent, data: { mode: 'edit' } }
];
