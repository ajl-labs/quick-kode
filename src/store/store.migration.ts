import { RootState } from '.';
import { omit, pick } from 'lodash';
import { DEFAULT_USSD_CODE_CONFIG } from '../common/constants/default.state';

// define your migrations
const storeMigration = {
  0: (state: RootState) => state,
  1: (state: RootState) => state,
  2: (state: any) => {
    return {
      ...state,
      history: {
        ...state.history,
        history: [],
      },
      transactions: {
        ...state.transactions,
        transactions: {},
      },
      settings: {
        ...state.settings,
        webhooks: {},
      },
    };
  },
  3: (state: RootState) => {
    return {
      ...omit(state, ['history', 'momo']),
      transactions: {
        ...state.transactions,
        stats: {},
      },
    };
  },
  4: (state: RootState) => {
    return {
      ...state,
      ussdCode: {
        ...state.ussdCode,
        codes: DEFAULT_USSD_CODE_CONFIG,
      },
    };
  },
  5: (state: RootState): RootState => {
    return {
      _persist: state._persist,
      settings: state.settings,
      retryQueue: state.retryQueue,
      ussdCode: state.ussdCode,
      transactions: {
        ...state.transactions,
        transactions: state.transactions.transactions,
        stats: {
          summary: state.transactions.stats.summary || {
            totalFees: null,
            totalTransactions: null,
            balance: null,
          },
          trends: {
            monthlySpending: [],
            spendingByCategory: [],
          },
        },
      },
    };
  },
};

export default storeMigration;
