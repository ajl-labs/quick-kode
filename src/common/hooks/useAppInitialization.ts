import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { retryPostTransactions } from '../../store/features/retryQueue/retry.queue.thunk';
import { postPendingTransactions } from '../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../store';
import { showAndroidToast } from '../helpers/utils';

export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const results = await Promise.allSettled([
          dispatch(retryPostTransactions()),
          dispatch(postPendingTransactions()),
        ]);
        results.forEach(res => {
          if (res.status === 'rejected') {
            showAndroidToast(res.reason.message);
          }
        });
      } catch (error) {
        showAndroidToast((error as Error).message);
      }
    };

    // on initial mount
    fetchUpdates();

    // on app state change to active
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== appState.current && nextAppState === 'active') {
        fetchUpdates();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
