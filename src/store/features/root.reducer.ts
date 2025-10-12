import { combineReducers } from '@reduxjs/toolkit';
import settings from './settings/settings.slice';
import transactions from './transactions/transaction.slice';
import retryQueue from './retryQueue/retry.queue.slice';

export const rootReducer = combineReducers({
  settings,
  transactions,
  retryQueue,
});
