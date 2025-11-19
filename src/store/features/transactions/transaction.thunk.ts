import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { RootState } from '../..';
import { markWebhookAsFailed } from '../settings/settings.slice';
import { WEBHOOK_ACTIONS_KEY } from '../../../common/constants/webhook.actions';
import {
  replaceUrlPlaceholders,
  showAndroidToast,
} from '../../../common/helpers/utils';
import {
  addPostTransactionRequest,
  removePostTransactionRequest,
} from '../retryQueue/retry.queue.slice';
import { omit } from 'lodash';
import {
  getPendingBackgroundTransactions,
  removePendingBackgroundTransaction,
} from '../../../service/background.transaction';
import { updateTransactionState } from './transaction.slice';

export const postTransactionData = createAsyncThunk(
  'history/postTransactionData',
  async (
    transactionData: ITransactionPostPayload & { isFromLocalStorage?: boolean },
    { getState, dispatch, rejectWithValue },
  ) => {
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT] || {};
      if (!url) return;
      const { data } = await axios.post(
        url.trim(),
        {
          phone_number: transactionData.phoneNumber,
          message: transactionData.message,
          sender: transactionData.sender,
          message_id: transactionData.messageId,
          message_timestamp: transactionData.timestamp,
          aiEnabled: true,
        },
        { auth: webhookAuth },
      );

      // only fetch if not from local storage
      if (!transactionData.isFromLocalStorage) {
        dispatch(
          removePostTransactionRequest({ key: transactionData.messageId }),
        );
        dispatch(fetchTransactionStatsSummary());
      }

      return data;
    } catch (error) {
      const axiosError = isAxiosError(error);
      const errorMessage = axiosError
        ? error.response?.data?.message
        : (error as Error).message;
      if (
        axiosError &&
        error.response?.data.code === 'INVALID_TRANSACTION_MESSAGE'
      ) {
        dispatch(
          removePostTransactionRequest({ key: transactionData.messageId }),
        );
        return rejectWithValue('You are sending none transaction message !!');
      }

      if (axiosError && error.response?.status !== 500) {
        dispatch(
          markWebhookAsFailed({
            key: WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT,
            failed: true,
          }),
        );
      }
      dispatch(
        addPostTransactionRequest({
          key: transactionData.messageId,
          data: omit(transactionData, ['isFromLocalStorage']),
        }),
      );
      // don't reject when failed for local storage
      if (transactionData.isFromLocalStorage) return;
      return rejectWithValue(errorMessage);
    }
  },
);

export const postPendingTransactions = createAsyncThunk(
  'transactions/postPendingTransactions',
  async (_, { getState, dispatch }) => {
    try {
      const transactions = await getPendingBackgroundTransactions();
      console.log(`pending transactions: ${Object.keys(transactions).length}`);
      for (const [messageId, transactionData] of Object.entries(transactions)) {
        await dispatch(
          postTransactionData({ ...transactionData, isFromLocalStorage: true }),
        ).unwrap();
        await removePendingBackgroundTransaction(messageId);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response);
      }
      showAndroidToast(
        'Failed to fetch transaction data from webhook.',
        'LONG',
      );
      return;
    }
  },
);

export const fetchTransactionData = createAsyncThunk(
  'history/fetchTransactionData',
  async (_, { getState }) => {
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT] || {};
      if (!url) return;
      const { data: responseData } = await axios.get(url.trim(), {
        auth: webhookAuth,
      });
      return responseData;
    } catch (error) {
      console.log('failed to fetch transaction data from webhook', error);
      if (isAxiosError(error)) {
        console.log(error.response);
      }
      showAndroidToast(
        'Failed to fetch transaction data from webhook.',
        'LONG',
      );
      return;
    }
  },
);

export const updateTransactionData = createAsyncThunk(
  'history/updateTransactionData',
  async (
    updateData: {
      record: IDataBaseRecord<ITransaction>;
      payload: Partial<ITransaction>;
    },
    { getState, dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(
        updateTransactionState({
          id: updateData.record.id,
          ...updateData.payload,
        } as Partial<IDataBaseRecord<ITransaction>>),
      );
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT] || {};
      if (!url) return;
      const { data: responseData } = await axios.put(
        replaceUrlPlaceholders(`${url.trim()}/:id`, updateData.record),
        omit(updateData.payload, 'id'),
        { auth: webhookAuth },
      );
      return responseData;
    } catch (error) {
      if (isAxiosError(error)) {
        dispatch(
          markWebhookAsFailed({
            key: WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT,
            failed: true,
          }),
        );
      }
      showAndroidToast('Failed to update transaction data to webhook.', 'LONG');
      return rejectWithValue('Failed to update transaction data to webhook.');
    }
  },
);

export const fetchTransactionStatsSummary = createAsyncThunk(
  'stats/fetchTransactionStatsSummary',
  async (_, { getState }) => {
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT] || {};
      if (!url) return;
      const { data } = await axios.get(`${url.trim()}/stats/summary`, {
        auth: webhookAuth,
      });
      return data;
    } catch (error) {
      let errorMessage = 'Failed to fetch transaction stats from webhook.';
      if (isAxiosError(error)) {
        console.log(error.response);
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      showAndroidToast(errorMessage, 'LONG');
      return;
    }
  },
);

export const fetchTransactionStatsTrends = createAsyncThunk(
  'stats/fetchTransactionStatsTrends',
  async (_, { getState }) => {
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT] || {};
      if (!url) return;
      const { data } = await axios.get(`${url.trim()}/stats/trends`, {
        auth: webhookAuth,
      });
      return data;
    } catch (error) {
      let errorMessage =
        'Failed to fetch transaction stats trends from webhook.';
      if (isAxiosError(error)) {
        console.log(error.response);
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      showAndroidToast(errorMessage, 'LONG');
      return;
    }
  },
);
