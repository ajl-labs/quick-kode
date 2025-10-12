import { RootState } from '.';
import { omit } from 'lodash';

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
};

export default storeMigration;
