import { IconProps } from '../components';

export const DEFAULT_USSD_CODE_CONFIG: Record<
  string,
  IUSSDCodeData & { icon?: IconProps['name'] }
> = {
  '*123#': { code: '*123#', description: 'Airtime Balance', variables: {} },
  '*182*1*1*{{phoneNumber}}*{{amount}}#': {
    code: '*182*1*1*{{phoneNumber}}*{{amount}}#',
    icon: 'SendMoney',
    description: 'Send money',
    variables: {
      phoneNumber: { type: 'phone' },
      amount: { type: 'currency' },
    },
    isFavorite: true,
    usedCount: 0,
  },
  '*182*8*1*{{paymentCode}}*{{amount}}#': {
    code: '*182*8*1*{{paymentCode}}*{{amount}}#',
    icon: 'CreditCard',
    description: 'Pay goods/services',
    variables: {
      paymentCode: { type: 'text' },
      amount: { type: 'currency' },
    },
    isFavorite: true,
    usedCount: 0,
  },
  '*182*2*1*1*1#': {
    code: '*182*2*1*1*1#',
    icon: 'PhonePause',
    description: 'Buy airtime',
    variables: {},
    isFavorite: true,
    usedCount: 0,
  },
};
