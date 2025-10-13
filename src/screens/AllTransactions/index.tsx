import { useSelector } from 'react-redux';
import { TransactionsList } from '../Home/components/TransactionsList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectAllTransactions } from '../../store/features/transactions/transaction.slice';
import globalStyles from '../../common/styles/global.styles';

export const AllTransactions = () => {
  const fullHistoryData = useSelector(selectAllTransactions);
  return (
    <SafeAreaView
      style={[globalStyles.flexGrow, globalStyles.verticalSpacing]}
      edges={['bottom']}
    >
      <TransactionsList
        data={fullHistoryData}
        expanded
        style={[globalStyles.horizontalSpacing]}
      />
    </SafeAreaView>
  );
};
