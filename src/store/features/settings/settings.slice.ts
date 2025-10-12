import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { to_snake_case } from '../../../common/helpers/utils';
import { WEBHOOK_ACTIONS_KEY } from '../../../common/constants/webhook.actions';

const initialState: {
  transactionLabels: Record<string, TransactionLabel>;
  webhooks: Record<string, IWebhookData>;
  webhookAuth: { username: string; password: string };
} = {
  transactionLabels: {},
  webhooks: {},
  webhookAuth: { username: '', password: '' },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    addTransactionLabel(
      state,
      action: { payload: Pick<TransactionLabel, 'name'>; type: string },
    ) {
      state.transactionLabels = {
        ...state.transactionLabels,
        [to_snake_case(action.payload.name)]: {
          name: action.payload.name,
          updatedAt: new Date().toISOString(),
        },
      };
    },

    removeTransactionLabel(
      state,
      action: { payload: Pick<TransactionLabel, 'name'>; type: string },
    ) {
      delete state.transactionLabels[to_snake_case(action.payload.name)];
    },

    addWebhook(
      state,
      action: {
        payload: IWebhookData & { key: WEBHOOK_ACTIONS_KEY };
        type: string;
      },
    ) {
      const { key, ...data } = action.payload;
      state.webhooks = {
        ...state.webhooks,
        [key]: { ...data, failed: false },
      };
    },

    addWebhookAuth(
      state,
      action: {
        payload: { username: string; password: string };
        type: string;
      },
    ) {
      state.webhookAuth = action.payload;
    },
    removeWebhook(
      state,
      action: { payload: { key: WEBHOOK_ACTIONS_KEY }; type: string },
    ) {
      const { [action.payload.key]: _, ...rest } = state.webhooks;
      state.webhooks = rest;
    },

    markWebhookAsFailed(
      state,
      action: {
        payload: { failed: boolean; key: WEBHOOK_ACTIONS_KEY };
        type: string;
      },
    ) {
      const webhook = state.webhooks[action.payload.key];
      if (webhook) {
        webhook.failed = action.payload.failed;
      }
    },
  },
});

const { actions, reducer } = settingsSlice;

export const {
  addTransactionLabel,
  removeTransactionLabel,
  addWebhook,
  removeWebhook,
  markWebhookAsFailed,
  addWebhookAuth,
} = actions;

export default reducer;

export const selectTransactionLabels = (state: RootState) =>
  state.settings.transactionLabels;

export const selectTransactionLabelEnabled = createSelector(
  (state: RootState) => state.settings.transactionLabels,
  labels => Object.keys(labels).length > 0,
);
export const selectWebhooks = createSelector(
  (state: RootState) => state.settings.webhooks,
  webhooks => Object.values(webhooks || {}),
);

export const selectWebhookAuth = (state: RootState) =>
  state.settings.webhookAuth;
