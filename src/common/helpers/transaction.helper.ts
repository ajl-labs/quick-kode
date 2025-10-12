import { capitalize } from 'lodash';
import { TransactionCategory } from '../constants';
import { getProviderFromPhone, removeCountryCode } from './phone.helpers';

export const extractTransactionSummary = (item: ITransaction): string => {
  if (item.summary) {
    return item.summary;
  }

  switch (item.transaction_category) {
    case TransactionCategory.TRANSFER:
      return `Sent to ${item.recipient}${
        item.phone_number ? ` - ${removeCountryCode(item.phone_number)}` : ''
      }`;
    case TransactionCategory.AIRTIME_PURCHASE:
      return `Airtime purchase from ${
        getProviderFromPhone(item.phone_number) || 'Unknown'
      }`;
    case TransactionCategory.GOODS_PAYMENT:
      return `Paid to ${item.recipient}, Code: ${item.payment_code || 'N/A'}`;
    case TransactionCategory.WITHDRAWAL:
      return `You have withdrawn money`;
    case TransactionCategory.LOAN_DISBURSEMENT:
      return `You received a loan from ${item.sender || 'unknown'}`;
    default:
      return `${capitalize(item.type)} transaction of unknown nature.`;
  }
};
