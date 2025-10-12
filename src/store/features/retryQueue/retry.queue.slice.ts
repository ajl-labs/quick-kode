import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';

type AddFailedRequestPayload<T> = {
  key: string;
  attempts: number;
  data: T;
};

const initialState: {
  postTransactionsRequests: Record<
    string,
    AddFailedRequestPayload<ITransactionPostPayload>
  >;
} = {
  postTransactionsRequests: {},
};

const retryQueue = createSlice({
  name: 'retryQueue',
  initialState,
  reducers: {
    addPostTransactionRequest(
      state,
      action: {
        payload: Omit<
          AddFailedRequestPayload<ITransactionPostPayload>,
          'attempts'
        >;
        type: string;
      },
    ) {
      const { key, data } = action.payload;
      state.postTransactionsRequests = {
        ...state.postTransactionsRequests,
        [key]: {
          key,
          attempts: (state.postTransactionsRequests[key]?.attempts || 0) + 1,
          data,
        },
      };
    },

    removePostTransactionRequest(
      state,
      action: { payload: { key: string }; type: string },
    ) {
      const { [action.payload.key]: _, ...rest } =
        state.postTransactionsRequests || {};
      state.postTransactionsRequests = rest;
    },
  },
});

const { reducer, actions } = retryQueue;

export const { addPostTransactionRequest, removePostTransactionRequest } =
  actions;

export const selectPostTransactionRequests = createSelector(
  (state: RootState) => state.retryQueue.postTransactionsRequests,
  requests => Object.values(requests || {}),
);

export const selectNumberOfFailedPostTransactionRequests = createSelector(
  (state: RootState) => state.retryQueue.postTransactionsRequests,
  requests => Object.keys(requests || {}).length,
);

export default reducer;
