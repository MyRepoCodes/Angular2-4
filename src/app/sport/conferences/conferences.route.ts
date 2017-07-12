import { Routes } from '@angular/router';
import { ConferencesComponent } from './conferences.component';
import { ConferenceComponent } from './conference.component';

export const conferencesRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ConferencesComponent },
  { path: 'create', component: ConferenceComponent, data: { mode: 'create' } },
  { path: ':id', component: ConferenceComponent, data: { mode: 'edit' } }
];
