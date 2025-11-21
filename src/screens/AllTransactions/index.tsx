import { TransactionsList } from '../Home/components/TransactionsList';
import {
  selectAllTransactions,
  selectTransactionPagination,
} from '../../store/features/transactions/transaction.slice';
import globalStyles from '../../common/styles/global.styles';
import { Container } from '../../common/Container';
import { ThemeSpacings } from '../../config/theme';
import { useFetchList } from '../../common/hooks/useFetch';
import { fetchTransactionData } from '../../store/features/transactions/transaction.thunk';
import { ActivityIndicator } from 'react-native-paper';

export const AllTransactions = () => {
  const { data, isLoading, isFetching, isRefreshing, onRefresh, fetchMore } =
    useFetchList({
      dataSelector: selectAllTransactions,
      dataFetcher: fetchTransactionData,
      paginationSelector: selectTransactionPagination,
      queryParams: {
        limit: 25,
      },
    });
  return (
    <Container style={[globalStyles.noSpacing]}>
      <TransactionsList
        data={data}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
        showMessage
        style={[globalStyles.horizontalSpacing]}
        contentContainerStyle={{
          marginBottom: ThemeSpacings.md,
        }}
      />
    </Container>
  );
};
