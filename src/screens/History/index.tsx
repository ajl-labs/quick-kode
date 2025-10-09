import { HistoryCard } from '../../common/components/Card/HistoryCard';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../../common/styles/global.styles';
import { selectAllTransactions } from '../../store/features/transactions/transaction.slice';

export const HistoryScreen = () => {
  const transactions = useSelector(selectAllTransactions);
  console.log(transactions);
  const _renderItem = ({ item }: { item: ITransaction }) => (
    <HistoryCard title={item.type} content={item.message} />
  );
  return (
    <FlatList<ITransaction>
      data={transactions}
      renderItem={_renderItem}
      keyExtractor={item => item.timestamp.toString()}
      contentContainerStyle={globalStyles.flatListContent}
    />
  );
};
