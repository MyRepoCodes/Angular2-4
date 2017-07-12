import { Routes } from '@angular/router';
import { PlayersComponent } from './players.component';
import { PlayerComponent } from './player.component';
export const playersRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PlayersComponent },
  { path: 'create', component: PlayerComponent, data: { mode: 'create' } },
  { path: ':id', component: PlayerComponent, data: { mode: 'edit' } }
];
