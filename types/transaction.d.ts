interface ITransaction {
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
