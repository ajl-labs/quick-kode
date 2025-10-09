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

interface ITransactionData {
  sender: string;
  message: string;
  phoneNumber: string;
  timestamp: number;
}

interface ITransaction {
  amount: number;
  date: string;
  fees: number;
  message: string;
  phoneNumber: string;
  recipient: string;
  sender: string;
  timestamp: number;
  type: 'DEBIT' | 'CREDIT';
}
