import { capitalize } from 'lodash';
import { TransactionCategory, WEBHOOK_ACTIONS_KEY } from '../constants';
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

export const getTransactionEndpoint = (
  webhookData: Record<string, IWebhookData>,
  key: WEBHOOK_ACTIONS_KEY,
  action: 'GET' | 'GET_ONE' | 'CREATE' | 'UPDATE',
): string => {
  const baseUrl = webhookData[WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT];
  switch (action) {
    case 'GET':
      return `${baseUrl}/transactions`;
    case 'GET_ONE':
      return `${baseUrl}/transactions/:id`;
    case 'CREATE':
      return `${baseUrl}/transactions`;
    case 'UPDATE':
      return `${baseUrl}/transactions/:id`;
    default:
      return webhookData[key].url;
  }
};
