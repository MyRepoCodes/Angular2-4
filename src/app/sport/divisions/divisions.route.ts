import { Routes } from '@angular/router';
import { DivisionsComponent } from './divisions.component';
import { DivisionComponent } from './division.component';

export const divisionsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: DivisionsComponent },
  { path: 'create', component: DivisionComponent, data: { mode: 'create' } },
  { path: ':id', component: DivisionComponent, data: { mode: 'edit' } }
];

