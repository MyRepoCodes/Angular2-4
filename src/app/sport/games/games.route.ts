import { Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { GameComponent } from './game.component';
import { GameDetailsComponent } from './game-details.component';

export const gamesRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: GamesComponent },
  { path: 'create', component: GameComponent, data: { mode: 'create' } },
  { path: ':id', component: GameComponent, data: { mode: 'edit' } },
  { path: ':id/details', component: GameDetailsComponent }
];

