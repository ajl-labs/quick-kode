import { useSelector } from 'react-redux';
import { TransactionsList } from '../Home/components/TransactionsList';
import { selectAllTransactions } from '../../store/features/transactions/transaction.slice';
import globalStyles from '../../common/styles/global.styles';
import { Container } from '../../common/Container';
import { ThemeSpacings } from '../../config/theme';

export const AllTransactions = () => {
  const fullHistoryData = useSelector(selectAllTransactions);
  return (
    <Container style={[globalStyles.noSpacing]}>
      <TransactionsList
        data={fullHistoryData}
        showMessage
        style={[globalStyles.horizontalSpacing]}
        contentContainerStyle={{
          paddingTop: ThemeSpacings.md,
          paddingBottom: ThemeSpacings.md,
        }}
      />
    </Container>
  );
};
