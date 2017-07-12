import { Routes } from '@angular/router';
import { conferencesRoutes } from './conferences/conferences.route';
import { sportsRoutes } from './sports/sports.route';
import { divisionsRoutes } from './divisions/divisions.route';
import { gamesRoutes } from './games/games.route';
import { leaguesRoutes } from './leagues/leagues.route';
import { playersRoutes } from './players/players.route';
import { seasonsRoutes } from './seasons/seasons.route';
import { competitionsRoutes } from './competitions/competitions.route';
import { teamsRoutes } from './teams/teams.route';
import { CompareToolComponent } from './compare-tool/compare-tool.component';
import { venuesRoute } from './venues/venues.route';
export const sportRoutes: Routes = [
  { path: 'sports', children: sportsRoutes },
  { path: 'divisions', children: divisionsRoutes },
  { path: 'conferences', children: conferencesRoutes },
  { path: 'games', children: gamesRoutes },
  { path: 'leagues', children: leaguesRoutes },
  { path: 'players', children: playersRoutes },
  { path: 'teams', children: teamsRoutes },
  { path: 'seasons', children: seasonsRoutes },
  { path: 'competitions', children: competitionsRoutes },
  { path: 'venues', children: venuesRoute },
  { path: 'compare-tool', component: CompareToolComponent }
];

