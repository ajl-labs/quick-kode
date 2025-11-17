import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './features/root.reducer';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  MigrationManifest,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createMigrate from 'redux-persist/es/createMigrate';
import storeMigration from './store.migration';

const REDUX_PERSIST_KEY = 'root';

const persistConfig: any = {
  key: REDUX_PERSIST_KEY,
  version: 4,
  storage: AsyncStorage,
  migrate: createMigrate(storeMigration as unknown as MigrationManifest, {
    debug: true,
  }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
