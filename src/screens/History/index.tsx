import { HistoryCard } from '../../common/components/Card/HistoryCard';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../../common/styles/global.styles';
import { selectAllTransactions } from '../../store/features/transactions/transaction.slice';

export const HistoryScreen = () => {
  const transactions = useSelector(selectAllTransactions);
  const _renderItem = ({ item }: { item: IDataBaseRecord<ITransaction> }) => {
    return (
      <HistoryCard
        title={item.type === 'CREDIT' ? item.sender : item.recipient}
        content={item.message}
        createdAt={item.created_at}
        highlighted={item.type === 'CREDIT'}
      />
    );
  };
  return (
    <FlatList<IDataBaseRecord<ITransaction>>
      data={transactions}
      renderItem={_renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={globalStyles.flatListContent}
    />
  );
};
