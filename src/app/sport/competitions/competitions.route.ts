import { Routes } from '@angular/router';
import { CompetitionsComponent } from './competitions.component';
import { CompetitionComponent } from './competition.component';
export const competitionsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: CompetitionsComponent },
  { path: 'create', component: CompetitionComponent, data: { mode: 'create' } },
  { path: ':id', component: CompetitionComponent, data: { mode: 'edit' } }
];
