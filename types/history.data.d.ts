interface IHistoryData {
  id: string;
  action: 'SEND_MONEY' | 'PAY_GOOD_SERVICE' | 'CHECK_BALANCE' | 'BUY_AIRTIME';
  text: string;
  timestamp: number;
  label?: string;
  transaction?: ITransactionPayload;
}
