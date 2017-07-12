// import { Injectable } from '@angular/core';
// import { StateUpdates, Effect } from '@ngrx/effects';
// import { ApiService, API_PGA_SEARCH_URL } from '../../shared/api';
// import { EntityEffects2 } from '../../shared/entity.effects';
// import { Filter } from '../../shared/fitler';
// import { PgaActions } from './pga.actions';
//
// @Injectable()
// export class PgaEffects extends EntityEffects2 {
//   @Effect() search$ = this.searchEffect$;
//
//   constructor(
//     api: ApiService,
//     updates$: StateUpdates<any>
//   ) {
//     super(api, updates$);
//   }
//
//   protected getSearchActionType() {
//     return PgaActions.SEARCH;
//   }
//
//   protected getFilter(state) {
//     return Filter.createByType(state.pgaFilter, 'pga');
//   }
//
//   protected getUrl() {
//     return API_PGA_SEARCH_URL;
//   }
//
//   protected getEntityUrl(id) {
//     throw 'Call getUrl instead';
//   }
//
//   protected getLoadedAction(result) {
//     return PgaActions.loaded(result);
//   }
//
//   protected getLoadedOneAction(entity) {
//     throw 'Not Implemented. getLoadedOneAction';
//   }
//
//   protected getLoadOneAction(id) {
//     throw 'Not Implemented. getLoadOneAction';
//   }
//
//   protected getDeletedAction(id) {
//     throw 'Not Implemented. getDeletedAction';
//   }
//
//   protected getErrorAction(err) {
//     return PgaActions.error(err);
//   }
//
//   protected getLoadOneActionType() {
//     return PgaActions.LOADED_ONE;
//   }
//   protected getAddActionType() {
//     return PgaActions.ADD;
//   }
//   protected getPatchActionType() {
//     return PgaActions.PATCH;
//   }
//   protected getRemoveActionType() {
//     return PgaActions.DELETE;
//   }
// }
