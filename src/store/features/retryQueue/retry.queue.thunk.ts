import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { postTransactionData } from '../transactions/transaction.thunk';
import { showAndroidToast } from '../../../common/helpers/utils';

export const retryPostTransactions = createAsyncThunk(
  'retryQueue/retryPostTransactions',
  async (_, { getState, dispatch }) => {
    try {
      console.log('Retrying post transactions...');
      const postTransactionRequests = Object.values(
        (getState() as RootState).retryQueue.postTransactionsRequests || {},
      ).filter(item => item.attempts < 5);
      console.log(postTransactionRequests);
      if (postTransactionRequests.length < 1) return;

      await Promise.allSettled(
        postTransactionRequests.map(transactionRequest =>
          dispatch(postTransactionData(transactionRequest.data)),
        ),
      );
    } catch (error) {
      console.log(error);
      showAndroidToast((error as Error).message, 'LONG');
    }
  },
);
