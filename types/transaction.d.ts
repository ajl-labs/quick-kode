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
  type: 'DEBIT' | 'CREDIT';
  updated_at: string;
}
