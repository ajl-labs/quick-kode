import {
  TransactionCategory,
  TransactionType,
} from '../src/common/constants/enum';
declare global {
  interface ITransaction {
    amount: string;
    completed_at: string;
    created_at: string;
    fees: string;
    id: string;
    message: string;
    phone_number: string;
    recipient: string;
    sender: string;
    type: TransactionType;
    updated_at: string;
    label?: string;
    transaction_category?: TransactionCategory;
    payment_code?: string;
    transaction_reference?: string;
    summary?: string;
    transaction_reference: number;
  }
  interface ITransactionPayload {
    balance?: string | null;
    name?: string;
    amount?: string;
    fees?: string | null;
    phoneNumber?: string;
    paymentCode?: string;
    provider: 'MTN' | 'Airtel' | 'Unknown';
    status: 'pending' | 'completed' | 'failed';
    description?: string;
    transactionId?: string;
  }

  interface ITransactionPostPayload {
    sender: string;
    message: string;
    phoneNumber: string;
    timestamp: number;
    messageId: string;
  }

  interface ITransactionStatsSummary {
    balance: number | null;
    totalTransactions: number | null;
    totalFees: number | null;
  }
  interface IMonthlyStats {
    month: string;
    total_amount: number;
    total_fees: number;
  }

  interface ISpendingByCategory {
    label: string;
    total_amount: number;
    total_fees: number;
  }
  interface ITransactionStatsTrends {
    monthlySpending: IMonthlyStats[];
    spendingByCategory: ISpendingByCategory[];
  }

  interface IStatCardPayload {
    labels: string[];
    data: number[];
    key: 'spendingByCategory' | 'monthlySpending';
  }
}
