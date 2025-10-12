export enum WEBHOOK_ACTIONS_KEY {
  TRANSACTION_ENDPOINT = 'BASE/transactions',
}
const actionsMap = new Map<
  WEBHOOK_ACTIONS_KEY,
  { label: string; value: WEBHOOK_ACTIONS_KEY }
>([
  // [
  //   WEBHOOK_ACTIONS_KEY.POST_TRANSACTION,
  //   { label: 'Post Transaction', value: WEBHOOK_ACTIONS_KEY.POST_TRANSACTION },
  // ],
  // [
  //   WEBHOOK_ACTIONS_KEY.FETCH_TRANSACTIONS,
  //   {
  //     label: 'Fetch Transactions',
  //     value: WEBHOOK_ACTIONS_KEY.FETCH_TRANSACTIONS,
  //   },
  // ],
  // [
  //   WEBHOOK_ACTIONS_KEY.UPDATE_TRANSACTION,
  //   {
  //     label: 'Update Transaction',
  //     value: WEBHOOK_ACTIONS_KEY.UPDATE_TRANSACTION,
  //   },
  // ],
  [
    WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT,
    {
      label: 'Base Transaction Endpoint',
      value: WEBHOOK_ACTIONS_KEY.TRANSACTION_ENDPOINT,
    },
  ],
]);

export default actionsMap;
