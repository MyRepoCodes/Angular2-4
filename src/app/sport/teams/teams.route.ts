import { Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { TeamComponent } from './team.component';
export const teamsRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TeamsComponent },
  { path: 'create', component: TeamComponent, data: { mode: 'create' } },
  { path: ':id', component: TeamComponent, data: { mode: 'edit' } }
];
