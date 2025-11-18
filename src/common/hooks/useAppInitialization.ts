import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { retryPostTransactions } from '../../store/features/retryQueue/retry.queue.thunk';
import {
  fetchTransactionData,
  postPendingTransactions,
} from '../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../store';
import { showAndroidToast } from '../helpers/utils';

export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const handleReduxState = useCallback(async () => {
    try {
      await Promise.allSettled([
        dispatch(retryPostTransactions()),
        dispatch(postPendingTransactions()),
      ]);
      await dispatch(fetchTransactionData());
    } catch (error) {
      showAndroidToast((error as Error).message);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('app state change', nextAppState);
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        handleReduxState();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    handleReduxState();
  }, [dispatch]);
};
