// import { Injectable } from '@angular/core';
// import { Action } from '@ngrx/store';
// import { API_TEAMS_SEARCH_URL, teamsByLeagueUrl, API_TEAMS_URL } from '../../shared/api';
// import { Actions, EntityActionCreator } from '../../shared/actions';
//
// export class PgaActions {
//   static SEARCH = '[PGA Actions] SEARCH';
//   static LOADED = '[PGA Actions] LOADED';
//   static DELETED = '[PGA Actions] DELETED';
//
//   static LOADED_ONE = '[PGA Actions] LOADED_ONE';
//   static ADD = '[PGA Actions] ADD';
//   static PATCH = '[PGA Actions] PATCH';
//   static DELETE = '[PGA Actions] DELETE';
//
//   static FILTER_CREATED = '[PGA Actions] FILTER_CREATED';
//   static FILTER_LOADED = '[PGA Actions] FILTER_LOADED';
//   static FILTER_SPORT_SELECTED = '[PGA Actions] FILTER_SPORT_SELECTED';
//   static FILTER_SPORTS_LOADING = '[PGA Actions] FILTER_SPORTS_LOADING';
//   static FILTER_SPORTS_LOADED = '[PGA Actions] FILTER_SPORTS_LOADED';
//   static FILTER_LEAGUES_SELECTED = '[PGA Actions] FILTER_LEAGUES_SELECTED';
//   static FILTER_LEAGUES_LOADING = '[PGA Actions] FILTER_LEAGUES_LOADING';
//   static FILTER_LEAGUES_LOADED = '[PGA Actions] FILTER_LEAGUES_LOADED';
//   static FILTER_COMPETITION_SELECTED = '[PGA Actions] FILTER_COMPETITION_SELECTED';
//   static FILTER_COMPETITIONS_LOADING = '[PGA Actions] FILTER_COMPETITIONS_LOADING';
//   static FILTER_COMPETITIONS_LOADED = '[PGA Actions] FILTER_COMPETITIONS_LOADED';
//   static FILTER_PHASE_SELECTED = '[PGA Actions] FILTER_PHASE_SELECTED';
//   static FILTER_PHASES_LOADING = '[PGA Actions] FILTER_PHASES_LOADING';
//   static FILTER_PHASES_LOADED = '[PGA Actions] FILTER_PHASES_LOADED';
//   static PAGE_CHANGED = '[PGA Actions] PAGE_CHANGED';
//   static SIZE_CHANGED = '[PGA Actions] SIZE_CHANGED';
//   static FROM_CHANGED = '[PGA Actions] FROM_CHANGED';
//   static TO_CHANGED = '[PGA Actions] TO_CHANGED';
//
//   static search(): Action {
//     return { type: PgaActions.SEARCH };
//   }
//
//   static loaded(result: any): Action {
//     return { type: PgaActions.LOADED, payload: result };
//   }
//
//   static filterCreated(
//     sportId: string, leagueIds: string[], competitionId: string, phase: string, from: string, to: string,
//     page?: number, size?: number
//   ): Action {
//     return { type: PgaActions.FILTER_CREATED, payload: {
//       sportId, leagueIds, competitionId, phase, from, to, page, size }
//     };
//   }
//
//   static filterSportSelected(sportId: string): Action {
//     return { type: PgaActions.FILTER_SPORT_SELECTED, payload: sportId };
//   }
//
//   static filterSportsLoaded(result: any): Action {
//     return { type: PgaActions.FILTER_SPORTS_LOADED, payload: result };
//   }
//
//   static filterLeaguesSelected(leagueIds: string): Action {
//     return { type: PgaActions.FILTER_LEAGUES_SELECTED, payload: leagueIds };
//   }
//
//   static filterLeaguesLoaded(result: any): Action {
//     return { type: PgaActions.FILTER_LEAGUES_LOADED, payload: result };
//   }
//
//   static filterCompetitionSelected(competitionId: string): Action {
//     return { type: PgaActions.FILTER_COMPETITION_SELECTED, payload: competitionId };
//   }
//
//   static filterCompetitionsLoaded(result: any): Action {
//     return { type: PgaActions.FILTER_COMPETITIONS_LOADED, payload: result };
//   }
//
//   static filterPhaseSelected(phase: string): Action {
//     return { type: PgaActions.FILTER_PHASE_SELECTED, payload: phase };
//   }
//
//   static filterPhasesLoaded(result: any): Action {
//     return { type: PgaActions.FILTER_PHASES_LOADED, payload: result };
//   }
//
//   static pageChanged(page: number): Action {
//     return { type: PgaActions.PAGE_CHANGED, payload: page };
//   }
//
//   static sizeChanged(size: number): Action {
//     return { type: PgaActions.SIZE_CHANGED, payload: size };
//   }
//
//   static fromChanged(from: string): Action {
//     return { type: PgaActions.FROM_CHANGED, payload: from };
//   }
//
//   static toChanged(to: string): Action {
//     return { type: PgaActions.TO_CHANGED, payload: to };
//   }
//
//   static error(err): Action {
//     return { type: 'error', payload: err };
//   }
// }
//
// @Injectable()
// export class PgaActions2 extends Actions {
//   entityType(): string {
//     return 'team';
//   }
//
//   url(): string {
//     return API_TEAMS_SEARCH_URL;
//   }
//
//   entityUrl(): string {
//     return API_TEAMS_URL;
//   }
//
//   urlByEntity(entityId: string): string {
//     return teamsByLeagueUrl(entityId);
//   }
//
//   urlByLeague(leagueId: string): string {
//     return teamsByLeagueUrl(leagueId);
//   }
// }
//
// @Injectable()
// export class PgaActionCreator extends EntityActionCreator {
//   constructor() {
//     super(new PgaActions2());
//   }
// }
