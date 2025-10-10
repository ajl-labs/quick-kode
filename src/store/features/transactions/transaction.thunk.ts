import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { RootState } from '../..';
import { markWebhookAsFailed } from '../settings/settings.slice';
import webhookActions, {
  WEBHOOK_ACTIONS_KEY,
} from '../../../config/data/webhook.actions';
export const postTransactionData = createAsyncThunk(
  'history/postTransactionData',
  async (
    transactionData: ITransactionData,
    { getState, rejectWithValue, dispatch },
  ) => {
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
        },
        { auth: webhookAuth },
      );
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response);
        dispatch(
          markWebhookAsFailed({
            key: WEBHOOK_ACTIONS_KEY.POST_TRANSACTION,
            failed: true,
          }),
        );
      }
      return rejectWithValue(
        (error as any).message || 'Failed to post transaction data',
      );
    }
  },
);
