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

export const postTransactionData = createAsyncThunk(
  'history/postTransactionData',
  async (
    transactionData: ITransactionPostPayload,
    { getState, dispatch, rejectWithValue },
  ) => {
    console.log('Posting transaction data:', transactionData.messageId);
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.POST_TRANSACTION] || {};
      if (!url) return;
      const { data } = await axios.post(
        url.trim(),
        {
          phone_number: transactionData.phoneNumber,
          message: transactionData.message,
          sender: transactionData.sender,
          message_id: transactionData.messageId,
          message_timestamp: transactionData.timestamp,
        },
        { auth: webhookAuth },
      );
      dispatch(
        removePostTransactionRequest({ key: transactionData.messageId }),
      );
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

      if (axiosError && error.response?.status !== 500)
        dispatch(
          markWebhookAsFailed({
            key: WEBHOOK_ACTIONS_KEY.POST_TRANSACTION,
            failed: true,
          }),
        );
      dispatch(
        addPostTransactionRequest({
          key: transactionData.messageId,
          data: transactionData,
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchTransactionData = createAsyncThunk(
  'history/fetchTransactionData',
  async (_, { getState }) => {
    try {
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.FETCH_TRANSACTIONS] || {};
      if (!url) return;
      const { data: responseData } = await axios.get(url.trim(), {
        auth: webhookAuth,
      });
      return responseData;
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
      const { webhookAuth, webhooks } = (getState() as RootState).settings;
      const { url } = webhooks[WEBHOOK_ACTIONS_KEY.UPDATE_TRANSACTION] || {};
      if (!url) return;
      const { data: responseData } = await axios.put(
        replaceUrlPlaceholders(url.trim(), updateData.record),
        omit(updateData.payload, 'id'),
        { auth: webhookAuth },
      );
      return responseData;
    } catch (error) {
      if (isAxiosError(error)) {
        dispatch(
          markWebhookAsFailed({
            key: WEBHOOK_ACTIONS_KEY.UPDATE_TRANSACTION,
            failed: true,
          }),
        );
      }
      showAndroidToast('Failed to update transaction data to webhook.', 'LONG');
      return rejectWithValue('Failed to update transaction data to webhook.');
    }
  },
);
