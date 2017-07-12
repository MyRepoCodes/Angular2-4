export interface Paging {
  page: number;
  size: number;
  total: number;
  rowsPerPageOptions: number[];
}

export const initialPagingState: Paging = {
  page: 1,
  size: 20,
  total: 0,
  rowsPerPageOptions: [20, 50, 100]
};


export class PagingActions {
  static FILTER_CREATED = '[Paging] filter created';
  static PAGE_CHANGED = '[Paging] page changed';
  static PAGE_SIZE_CHANGED = '[Paging] page size changed';
  static COLLECTION_LOADED = '[Paging] collection loaded';

  static filterCreated(payload) {
    return { type: PagingActions.FILTER_CREATED, payload: payload };
  }

  static pageChanged(payload) {
    return { type: PagingActions.PAGE_CHANGED, payload: payload };
  }

  static pageSizeChanged(payload) {
    return { type: PagingActions.PAGE_SIZE_CHANGED, payload: payload };
  }

  static collectionLoaded(payload) {
    return { type: PagingActions.COLLECTION_LOADED, payload: payload };
  }
}

export const pagingReducer = (state = initialPagingState, action: any) => {
  switch (action.type) {
    case PagingActions.FILTER_CREATED:
      const page = action.payload.page || state.page;
      const size = action.payload.size || state.size;
      return Object.assign({}, state, { page: page, size: size });
    case PagingActions.PAGE_CHANGED:
      return Object.assign({}, state, { page: action.payload || state.page });
    case PagingActions.PAGE_SIZE_CHANGED:
      return Object.assign({}, state, { size: action.payload || state.size });
    case PagingActions.COLLECTION_LOADED:
      return Object.assign({}, state, { total: action.payload || 0 });
    default:
      return state;
  }
};
