// import { Observable } from 'rxjs/Observable';
// import { AppState } from '../../app.state';
// import { compose } from '@ngrx/core/compose';
// import * as fromEntities from '../../shared/reducers';
// import * as fromPgaFilter from './pga.filter';
//
// function getSportState() {
//   return (state$: Observable<AppState>) => state$
//     .select(s => s.sports);
// }
// function getLeagueState() {
//   return (state$: Observable<AppState>) => state$
//     .select(s => s.leagues);
// }
// function getCompetitionState() {
//   return (state$: Observable<AppState>) => state$
//     .select(s => s.competitions);
// }
// function getPhaseState() {
//   return (state$: Observable<AppState>) => state$
//     .select(s => s.phases);
// }
//
// function getSportEntity(id: string) {
//   return compose(fromEntities.getApiEntity(id), getSportState());
// }
// function getSportList(entityIds: string[]) {
//   return compose(fromEntities.getApiEntitiesList(entityIds), getSportState());
// }
// function getLeagueList(entityIds: string[]) {
//   return compose(fromEntities.getApiEntitiesList(entityIds), getLeagueState());
// }
// function getCompetitionEntity(id: string) {
//   return compose(fromEntities.getApiEntity(id), getCompetitionState());
// }
// function getCompetitionList(entityIds: string[]) {
//   return compose(fromEntities.getApiEntitiesList(entityIds), getCompetitionState());
// }
// function getPhaseEntity(id: string) {
//   return compose(fromEntities.getApiEntity(id), getPhaseState());
// }
// function getPhaseList(entityIds: string[]) {
//   return compose(fromEntities.getApiEntitiesList(entityIds), getPhaseState());
// }
//
// function getFilterState() {
//   return(state$: Observable<AppState>) => state$
//     .select(s => {
//       return s.pgaFilter;
//     });
// }
//
// function getSportFilterState() {
//   return compose(fromPgaFilter.getSport(), getFilterState());
// }
// function getLeaguesFilterState() {
//   return compose(fromPgaFilter.getLeagues(), getFilterState());
// }
// function getCompetitionFilterState() {
//   return compose(fromPgaFilter.getCompetition(), getFilterState());
// }
// function getPhaseFilterState() {
//   return compose(fromPgaFilter.getPhase(), getFilterState());
// }
//
// export function getPaging() {
//   return compose(fromPgaFilter.getPaging(), getFilterState());
// }
//
// export function getFrom() {
//   return compose(fromPgaFilter.getFrom(), getFilterState());
// }
//
// export function getTo() {
//   return compose(fromPgaFilter.getTo(), getFilterState());
// }
//
// export function getSelectedSport() {
//   return (state$: Observable<AppState>) => state$
//     .let(getSportFilterState())
//     .switchMap(f => state$.let(getSportEntity(f.id)));
// }
// export function getSports() {
//   return (state$: Observable<AppState>) => state$
//     .let(getSportFilterState())
//     .switchMap(f => state$.let(getSportList(f.ids)));
// }
//
// export function getSelectedLeagues() {
//   return (state$: Observable<AppState>) => state$
//     .let(getLeaguesFilterState())
//     .switchMap(f => state$.let(getLeagueList(f.selected)));
// }
// export function getLeagues() {
//   return (state$: Observable<AppState>) => state$
//     .let(getLeaguesFilterState())
//     .switchMap(f => state$.let(getLeagueList(f.ids)));
// }
// export function getSelectedCompetition() {
//   return (state$: Observable<AppState>) => state$
//     .let(getCompetitionFilterState())
//     .switchMap(f => state$.let(getCompetitionEntity(f.id)));
// }
// export function getCompetitions() {
//   return (state$: Observable<AppState>) => state$
//     .let(getCompetitionFilterState())
//     .switchMap(f => state$.let(getCompetitionList(f.ids)));
// }
// export function getSelectedPhase() {
//   return (state$: Observable<AppState>) => state$
//     .let(getPhaseFilterState())
//     .switchMap(f => state$.let(getPhaseEntity(f.id)));
// }
// export function getPhases() {
//   return (state$: Observable<AppState>) => state$
//     .let(getPhaseFilterState())
//     .switchMap(f => state$.let(getPhaseList(f.ids)));
// }
