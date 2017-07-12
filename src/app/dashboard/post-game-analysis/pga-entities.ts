// import { Action } from '@ngrx/store';
// import { initialEntityState } from '../../shared/reducers';
// import { PgaActions } from './pga.actions';
//
// export const pgaEntitiesReducer = (state = initialEntityState, action: Action) => {
//   switch (action.type) {
//     case PgaActions.LOADED:
//       const entities: any[] = action.payload.result;
//       const newEntities = entities.filter(entity => !state.entities[entity.logger.id]);
//       const newEntitiesIds = newEntities.map(entity => entity.logger.id);
//
//       const newEntitiesEntities = entities.reduce((entities: { [id: string]: any }, entity) => {
//         return Object.assign(entities, {
//           [entity.logger.id]: entity
//         });
//       }, {});
//
//       return {
//         ids: [...state.ids, ...newEntitiesIds],
//         entities: Object.assign({}, state.entities, newEntitiesEntities)
//       };
//     default:
//       return state;
//   }
// };
//
// const initialPhasesState = {
//   ids: ['phase1', 'phase2'],
//   entities: {
//     phase1: { id: 'phase1', name: 'Phase 1'},
//     phase2: { id: 'phase2', name: 'Phase 2'}
//   }
// };
// export const phasesEntitiesReducer = (state = initialPhasesState, action: Action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };
