// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { StateUpdates, Effect } from '@ngrx/effects';
// import { ApiService, API_SPORTS_URL, leaguesBySportUrl, API_COMPETITIONS_SEARCH_URL } from '../../shared/api';
// import { PgaActions } from './pga.actions';
// import { createArrayParamFilter, Filter } from '../../shared/fitler';
//
// @Injectable()
// export class PgaFilterEffects {
//   static emptyAction = { type: 'empty action' };
//
//   @Effect() filterCreated$ = this.updates$
//     .whenAction(PgaActions.FILTER_CREATED)
//     .switchMap(update => {
//       let filter = update.action.payload; // update.state.pgaFilter;
//       return Observable.concat(
//         this.api.searchEntities(API_SPORTS_URL)
//           .map(sports => {
//             return PgaActions.filterSportsLoaded(sports);
//           })
//           .catch(err => Observable.of(PgaActions.error(err))),
//         this.loadEntityBySelection(
//           filter.sportId,
//           leaguesBySportUrl(filter.sportId),
//           PgaActions.filterLeaguesLoaded
//         ),
//         this.loadCompetitionsByLeagueList(
//           filter.leagueIds,
//           API_COMPETITIONS_SEARCH_URL,
//           PgaActions.filterCompetitionsLoaded
//         )
//       );
//       }
//     );
//
//   @Effect() sportSelected$ = this.updates$
//     .whenAction(PgaActions.FILTER_SPORT_SELECTED)
//     .map(update => update.action.payload)
//     .switchMap(sportId => {
//         return this.loadEntityBySelection(
//           sportId,
//           leaguesBySportUrl(sportId),
//           PgaActions.filterLeaguesLoaded
//         );
//       }
//     );
//
//   @Effect() leagueSelected$ = this.updates$
//     .whenAction(PgaActions.FILTER_LEAGUES_SELECTED)
//     .map(update => update.action.payload)
//     .switchMap(leagueId => {
//         return Observable.concat(
//           this.loadCompetitionsByLeagueList(
//             leagueId,
//             API_COMPETITIONS_SEARCH_URL,
//             PgaActions.filterCompetitionsLoaded
//           )
//         );
//       }
//     );
//
//   loadEntityBySelection(id, url, loaded) {
//     if (id) {
//       return this.api.searchEntities(url)
//         .map(entities => {
//           return loaded(entities);
//         })
//         .catch(err => Observable.of(PgaActions.error(err)));
//     }
//
//     return Observable.of(PgaFilterEffects.emptyAction);
//   }
//
//   loadCompetitionsByLeagueList(ids, url, loaded) {
//     if (ids && ids.length) {
//       let arrayFilter = createArrayParamFilter('leagueIds', ids);
//       let filter = Filter.create();
//       filter.optional = [arrayFilter];
//       return this.api.searchEntities(url, filter.getParams(true))
//         .map(entities => {
//           return loaded(entities);
//         })
//         .catch(err => Observable.of(PgaActions.error(err)));
//     }
//
//     return Observable.of(PgaFilterEffects.emptyAction);
//   }
//
//   constructor(
//     private api: ApiService,
//     private updates$: StateUpdates<any>
//   ) {
//   }
// }
