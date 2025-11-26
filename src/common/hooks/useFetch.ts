import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import { showAndroidToast } from '../helpers/utils';

interface UseFetchListProps<T> {
  dataFetcher: AsyncThunk<any, IPaginatedFetchParams, any>;
  queryParams: IPaginatedFetchParams;
  paginationSelector: (state: any) => IPagination;
  dataSelector: (state: any) => T[];
}

export const useFetchList = <T>({
  dataFetcher,
  queryParams,
  paginationSelector,
  dataSelector,
}: UseFetchListProps<T>) => {
  const renderedRef = useRef<boolean>(null);
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(paginationSelector);
  const data = useSelector(dataSelector);
  const [loadingState, setLoadingState] = useState<
    Record<'isLoading' | 'isFetching' | 'isRefreshing', boolean>
  >({
    isFetching: false,
    isLoading: false,
    isRefreshing: false,
  });

  const fetchData = useCallback(
    async (params?: IPaginatedFetchParams) => {
      if (!renderedRef.current)
        setLoadingState(state => ({ ...state, isLoading: true }));

      try {
        await dispatch(dataFetcher(params ?? queryParams)).unwrap();
      } catch (error) {
        console.log('Error', error);
        showAndroidToast('Error fetching data');
      } finally {
        setLoadingState({
          isLoading: false,
          isFetching: false,
          isRefreshing: false,
        });
      }
    },
    [queryParams],
  );

  const fetchMore = useCallback(async () => {
    if (pagination.nextCursor) {
      setLoadingState(state => ({ ...state, isFetching: true }));
      await fetchData({ ...queryParams, cursor: pagination.nextCursor });
    }
  }, [pagination, queryParams]);

  const onRefresh = useCallback(async () => {
    setLoadingState(state => ({ ...state, isRefreshing: true }));
    await fetchData({ ...queryParams, cursor: null });
  }, [queryParams, pagination]);

  useEffect(() => {
    if (!renderedRef.current) {
      renderedRef.current = true;
      fetchData();
    }
  }, []);

  return {
    data,
    fetchMore,
    fetchData,
    onRefresh,
    ...loadingState,
  };
};
interface UseFetchProps<T, P> {
  dataFetcher: AsyncThunk<any, any, any>;
  queryParams?: P;
  dataSelector: (state: any) => T;
}

export const useFetch = <T, P>({
  queryParams,
  dataFetcher,
  dataSelector,
}: UseFetchProps<T, P>) => {
  const queryStringRef = useRef<string>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [loadingState, setLoadingState] = useState<
    Record<'isLoading' | 'isFetching' | 'isRefreshing', boolean>
  >({
    isFetching: false,
    isLoading: false,
    isRefreshing: false,
  });
  const data = useSelector(dataSelector);

  const fetchData = useCallback(async () => {
    try {
      console.log('going to fetch data>>>>>>>>>>>>>>', queryParams);
      await dispatch(dataFetcher(queryParams)).unwrap();
    } catch (error) {
      showAndroidToast('Error fetching data');
    } finally {
      setLoadingState({
        isLoading: false,
        isFetching: false,
        isRefreshing: false,
      });
    }
  }, [queryParams]);

  const refresh = useCallback(() => {
    setLoadingState(state => ({ ...state, isRefreshing: true }));
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const queryParamString = JSON.stringify(queryParams || {});
    if (
      !queryStringRef.current ||
      queryStringRef.current !== queryParamString
    ) {
      setLoadingState(state => ({ ...state, isLoading: true }));
      queryStringRef.current = queryParamString;
      fetchData();
    }
  }, [queryParams]);

  return {
    data,
    fetchData,
    refresh,
    ...loadingState,
  };
};
