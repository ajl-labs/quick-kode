export enum WEBHOOK_ACTIONS_KEY {
  POST_TRANSACTION = 'POST/transactions',
  GET_TRANSACTION = 'GET/transactions',
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
    WEBHOOK_ACTIONS_KEY.GET_TRANSACTION,
    { label: 'Fetch Transactions', value: WEBHOOK_ACTIONS_KEY.GET_TRANSACTION },
  ],
]);

export default actionsMap;
