import { Routes } from '@angular/router';
import { VenuesComponent } from './venues.component';
import { VenueComponent } from './venue.component';

export const venuesRoute: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: VenuesComponent },
  { path: 'create', component: VenueComponent, data: { mode: 'create' }},
  { path: ':id', component: VenueComponent, data: { mode: 'edit' }}
];

