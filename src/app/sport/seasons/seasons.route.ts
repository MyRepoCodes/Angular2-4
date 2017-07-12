import { Routes } from '@angular/router';
import { SeasonsComponent } from './seasons.component';
import { SeasonComponent } from './season.component';

export const seasonsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: SeasonsComponent },
  { path: 'create', component: SeasonComponent, data: { mode: 'create' }},
  { path: ':id', component: SeasonComponent, data: { mode: 'edit' }}
];

