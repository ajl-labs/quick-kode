import { MigrationManifest } from 'redux-persist';
import { RootState } from '.';

// define your migrations
const storeMigration = {
  0: (state: RootState) => state,
  1: (state: RootState) => state,
  2: (state: RootState) => {
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
};

export default storeMigration;
