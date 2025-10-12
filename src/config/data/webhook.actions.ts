export enum WEBHOOK_ACTIONS_KEY {
  POST_TRANSACTION = 'POST/transactions',
  FETCH_TRANSACTIONS = 'FETCH/transactions',
}
const actionsMap = new Map<
  WEBHOOK_ACTIONS_KEY,
  { label: string; value: WEBHOOK_ACTIONS_KEY }
>([
  [
    WEBHOOK_ACTIONS_KEY.POST_TRANSACTION,
    { label: 'Post Transaction', value: WEBHOOK_ACTIONS_KEY.POST_TRANSACTION },
  ],
  [
    WEBHOOK_ACTIONS_KEY.FETCH_TRANSACTIONS,
    {
      label: 'Fetch Transactions',
      value: WEBHOOK_ACTIONS_KEY.FETCH_TRANSACTIONS,
    },
  ],
]);

export default actionsMap;
