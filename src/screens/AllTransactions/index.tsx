import { useSelector } from 'react-redux';
import { TransactionsList } from '../Home/components/TransactionsList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectAllTransactions } from '../../store/features/transactions/transaction.slice';

export const AllTransactions = () => {
  const fullHistoryData = useSelector(selectAllTransactions);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TransactionsList data={fullHistoryData} />
    </SafeAreaView>
  );
};
