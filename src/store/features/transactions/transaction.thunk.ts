import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { RootState } from '../..';
import { markWebhookAsFailed } from '../settings/settings.slice';
export const postTransactionData = createAsyncThunk(
  'history/postTransactionData',
  async (
    transactionData: ITransactionData,
    { getState, rejectWithValue, dispatch },
  ) => {
    let webhookUrl;
    try {
      const webhooks = (getState() as RootState).settings.webhooks;
      const { url, password = '', username = '' } = Object.values(webhooks)[0];
      webhookUrl = url;
      await axios.post(
        `${url.trim()}/transactions/from-ai-prompt`.replaceAll(' ', ''),
        {
          phone_number: transactionData.phoneNumber,
          message: transactionData.message,
          sender: transactionData.sender,
        },
        {
          auth: { username, password },
        },
      );
    } catch (error) {
      if (isAxiosError(error) && webhookUrl) {
        dispatch(markWebhookAsFailed({ url: webhookUrl, failed: true }));
      }
      return rejectWithValue(
        (error as any).message || 'Failed to post transaction data',
      );
    }
  },
);
