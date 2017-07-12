// import { Action } from '@ngrx/store';
// import { initialCollectionState } from '../../shared/reducers';
// import { PgaActions } from './pga.actions';
// import { Pagination } from '../../shared/paginator.model';
//
// export const pgaCollectionReducer = (state = initialCollectionState, action: Action) => {
//   switch (action.type) {
//     case PgaActions.LOADED:
//       const entities: any[] = action.payload.result;
//
//       return {
//         loaded: true,
//         loading: false,
//         adding: false,
//         ids: entities.map(entity => entity.logger.id),
//         pagination: new Pagination(),
//         error: state.error
//       };
//     default:
//       return state;
//   }
// };
