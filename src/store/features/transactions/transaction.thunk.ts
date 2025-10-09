import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

import { camelCase } from 'lodash';
export const postTransactionData = createAsyncThunk(
  'history/postTransactionData',
  async (transactionData: ITransactionData, thunkAPI) => {
    const config = __DEV__
      ? require('../../../../config.development.json')
      : require('../../../../config.production.json');
    try {
      const response = await axios.post(
        config.N8N_WEBHOOK_URL,
        transactionData,
        {
          auth: {
            username: config.N8N_WEBHOOK_USERNAME,
            password: config.N8N_WEBHOOK_PASSWORD,
          },
        },
      );

      const data = response.data[0] ?? response.data;
      return Object.keys(data).reduce((acc, key) => {
        acc[camelCase(key)] = data[key];
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      return thunkAPI.rejectWithValue(
        (error as any).message || 'Failed to post transaction data',
      );
    }
  },
);
