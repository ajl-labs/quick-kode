import { LocalStorage } from './local.storage';

export const savePendingBackgroundTransactions = async (
  payload: ITransactionPostPayload,
) => {
  try {
    const transactions: Record<string, ITransactionPostPayload> = JSON.parse(
      (await LocalStorage.get('pending_transactions')) || '{}',
    );
    transactions[payload.messageId] = payload;
    await LocalStorage.save(
      'pending_transactions',
      JSON.stringify(transactions),
    );
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

export const getPendingBackgroundTransactions = async () => {
  try {
    const transactions: Record<string, ITransactionPostPayload> = JSON.parse(
      (await LocalStorage.get('pending_transactions')) || '{}',
    );
    return transactions;
  } catch (error) {
    console.error('Error getting pending transactions:', error);
    return [];
  }
};

export const removePendingBackgroundTransaction = async (messageId: string) => {
  try {
    const transactions: Record<string, ITransactionPostPayload> = JSON.parse(
      (await LocalStorage.get('pending_transactions')) || '{}',
    );
    delete transactions[messageId];
    await LocalStorage.save(
      'pending_transactions',
      JSON.stringify(transactions),
    );
  } catch (error) {
    console.error('Error clearing pending transactions:', error);
  }
};
