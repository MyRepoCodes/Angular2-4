// import '@ngrx/core/add/operator/select';
// import 'rxjs/add/operator/map';
//
// import { Action } from '@ngrx/store';
// import { Observable } from 'rxjs/Observable';
// import {
//   EntityFilterState, initialEntityFilterState,
//   entityFilterReducer, EntityFilterActions
// } from '../../shared/reducers';
// import { Paging, initialPagingState, pagingReducer, PagingActions } from '../../shared/reducers';
// import { PgaActions } from './pga.actions';
// import {
//   SelectManyFilterState,
//   initialSelectManyFilterState, selectManyFilterReducer, SelectManyFilterActions
// } from '../../shared/reducers';
//
// export interface PgaFilterState {
//   sport: EntityFilterState;
//   leagues: SelectManyFilterState;
//   competition: EntityFilterState;
//   phase: EntityFilterState;
//   from: string;
//   to: string;
//   paging: Paging;
// }
// const pgaFilterState = {
//   loading: false,
//   loaded: true,
//   id: 'phase1',
//   ids: ['phase1', 'phase2']
// };
//
// const initialPgaFilterState = {
//   sport: initialEntityFilterState,
//   leagues: initialSelectManyFilterState,
//   competition: initialEntityFilterState,
//   phase: pgaFilterState,
//   from: '',
//   to: '',
//   paging: initialPagingState
// };
//
// export const pgaFilterReducer = (state = initialPgaFilterState, action: Action) => {
//   console.log(action.type);
//   switch (action.type) {
//     case PgaActions.FILTER_CREATED:
//       return Object.assign(
//         {}, state,
//         { sport: entityFilterReducer(state.sport, EntityFilterActions.created(action.payload.sportId)) },
//         { leagues: selectManyFilterReducer(state.leagues, SelectManyFilterActions.created(action.payload.leagueIds)) },
//         { competition: entityFilterReducer(state.competition, EntityFilterActions.created(action.payload.compeititonId)) },
//         { phase: entityFilterReducer(state.phase, EntityFilterActions.created(action.payload.phase)) },
//         { paging: pagingReducer(state.paging, PagingActions.filterCreated(action.payload)) },
//         { from: action.payload.from },
//         { to: action.payload.to }
//       );
//     case PgaActions.FILTER_SPORT_SELECTED:
//       return Object.assign(
//         {}, state,
//         { sport: entityFilterReducer(state.sport, EntityFilterActions.selected(action.payload)) },
//         { leagues: initialSelectManyFilterState },
//         { competition: initialEntityFilterState }
//       );
//     case PgaActions.FILTER_SPORTS_LOADING:
//       return Object.assign(
//         {}, state,
//         { sport: entityFilterReducer(state.sport, EntityFilterActions.loading()) }
//       );
//     case PgaActions.FILTER_SPORTS_LOADED:
//       return Object.assign(
//         {}, state,
//         { sport: entityFilterReducer(state.sport, EntityFilterActions.loaded(action.payload.result)) }
//       );
//
//     case PgaActions.FILTER_LEAGUES_SELECTED:
//       return Object.assign(
//         {}, state,
//         { leagues: selectManyFilterReducer(state.leagues, SelectManyFilterActions.selected(action.payload)) },
//         { competition: initialEntityFilterState }
//       );
//     case PgaActions.FILTER_LEAGUES_LOADING:
//       return Object.assign(
//         {}, state,
//         { leagues: selectManyFilterReducer(state.leagues, SelectManyFilterActions.loading()) }
//       );
//     case PgaActions.FILTER_LEAGUES_LOADED:
//       return Object.assign(
//         {}, state,
//         { leagues: selectManyFilterReducer(state.leagues, SelectManyFilterActions.loaded(action.payload.result)) }
//       );
//
//     case PgaActions.FILTER_COMPETITION_SELECTED:
//       return Object.assign(
//         {}, state,
//         { competition: entityFilterReducer(state.competition, EntityFilterActions.selected(action.payload)) }
//       );
//     case PgaActions.FILTER_COMPETITIONS_LOADING:
//       return Object.assign(
//         {}, state,
//         { competition: entityFilterReducer(state.competition, EntityFilterActions.loading()) }
//       );
//     case PgaActions.FILTER_COMPETITIONS_LOADED:
//       return Object.assign(
//         {}, state,
//         { competition: entityFilterReducer(state.competition, EntityFilterActions.loaded(action.payload.result)) }
//       );
//
//     case PgaActions.FILTER_PHASE_SELECTED:
//       return Object.assign(
//         {}, state,
//         { phase: entityFilterReducer(state.phase, EntityFilterActions.selected(action.payload)) }
//       );
//     case PgaActions.FILTER_PHASES_LOADING:
//       return Object.assign(
//         {}, state,
//         { phase: entityFilterReducer(state.phase, EntityFilterActions.loading()) }
//       );
//     case PgaActions.FILTER_PHASES_LOADED:
//       return Object.assign(
//         {}, state,
//         { phase: entityFilterReducer(state.phase, EntityFilterActions.loaded(action.payload.result)) }
//       );
//
//     case PgaActions.LOADED:
//       const totalRecords = action.payload.totalRecords;
//       return Object.assign(
//         {}, state,
//         { paging: pagingReducer(state.paging, PagingActions.collectionLoaded(totalRecords)) }
//       );
//     case PgaActions.PAGE_CHANGED:
//       return Object.assign({}, state, { paging: pagingReducer(state.paging, PagingActions.pageChanged(action.payload)) });
//     case PgaActions.SIZE_CHANGED:
//       return Object.assign({}, state, { paging: pagingReducer(state.paging, PagingActions.pageSizeChanged(action.payload)) });
//     case PgaActions.FROM_CHANGED:
//       return Object.assign({}, state, { from: action.payload });
//     case PgaActions.TO_CHANGED:
//       return Object.assign({}, state, { to: action.payload });
//     default:
//       return state;
//   }
// };
//
// export function getSport() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.sport);
// }
//
// export function getLeagues() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.leagues);
// }
//
// export function getCompetition() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.competition);
// }
//
// export function getPhase() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.phase);
// }
//
// export function getPaging() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.paging);
// }
//
// export function getFrom() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.from);
// }
//
// export function getTo() {
//   return (state$: Observable<PgaFilterState>) => state$
//     .select(s => s.to);
// }
