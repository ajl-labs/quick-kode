import { getProviderFromPhone } from './phone.helpers';
import { generateCustomUUID } from './utils';

export const MOMO_USSD_CODES: Record<IHistoryData['action'], string> = {
  SEND_MONEY: '*182*1*1*{phoneNumber}*{amount}#',
  PAY_GOOD_SERVICE: '*182*8*1*{paymentCode}*{amount}#',
  CHECK_BALANCE: '*182*6*1#',
  BUY_AIRTIME: '*182*2*1*1*1#',
};

export const USS_HISTORY_ACTION_TITLE: Partial<
  Record<IHistoryData['action'], string>
> = {
  SEND_MONEY: 'Send Money',
  PAY_GOOD_SERVICE: 'Pay Good Service',
  BUY_AIRTIME: 'Buy Airtime',
};

export const extractMomoUSSDData = (
  currentMessage: string,
  previousMessage: string | null,
  action: IHistoryData['action'] | null,
) => {
  //let text = currentMessage.trim();
  const extractedData: IMomoExtractedData = {
    balance: null,
  };
  if (
    action === 'CHECK_BALANCE' &&
    (currentMessage.startsWith('Musigaranye aya mafaranga') ||
      currentMessage.startsWith('Your balance is'))
  ) {
    const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?\s?RWF)/i;
    const match = currentMessage.match(regex);
    extractedData.balance = match
      ? match[1].replace(/,/g, '').replace(/RWF/, '')
      : null;

    /**
     * TODO:
     * - cover for english
     * - cover for other lines (Airtel)
     */
  } else if (
    action === 'SEND_MONEY' &&
    previousMessage?.startsWith('Washyizeho:') &&
    currentMessage.startsWith('Wohereje')
  ) {
    const [_, name, phoneNumber, amount, fees] =
      previousMessage.match(
        /Washyizeho:\s(.+?)\s(\d+),\s([\d,]+)\sRWF.*?RWF\s(\d+)\skirakurikizwa/,
      ) || [];
    const balance = currentMessage.match(/Usigaranye\s([\d,]+)\sRWF/);

    if (balance && balance[1]) {
      extractedData.balance = balance[1].replace(/,/g, '');
    }

    const transactionData: Partial<IHistoryData['transaction']> = {
      name: name || undefined,
      amount: amount?.replace(/,/g, '') || undefined,
      fees: fees?.replace(/,/g, '') || null,
      phoneNumber: phoneNumber || undefined,
    };

    if (
      Object.values(transactionData).some(
        value => value !== undefined && value !== null,
      )
    ) {
      extractedData['send'] = {
        id: generateCustomUUID(),
        action: 'SEND_MONEY',
        text: previousMessage,
        timestamp: Date.now(),
        transaction: {
          ...transactionData,
          provider: getProviderFromPhone(phoneNumber),
          status: 'completed',
        },
      };
    }
  } else if (
    action === 'PAY_GOOD_SERVICE' &&
    previousMessage?.startsWith('Ugiye kwishyura') &&
    (currentMessage.startsWith("Y'ello. Wishyuye") ||
      currentMessage.startsWith("Y'ello. Wishyuye") ||
      currentMessage.startsWith('Wishyuye'))
  ) {
    const amount = currentMessage.match(/Wishyuye (.*?) RWF/)?.[1];
    const names = currentMessage.match(/kuri (.+?),/)?.[1];
    // Extract paymentCode as the word that follows names (after "kuri {names},")
    const paymentCode = currentMessage
      .match(/kuri .+?,\s*(\S+)/)?.[1]
      ?.replace('.', '');
    const fees = currentMessage.match(/ikiguzi (.+?) RWF/)?.[1];
    const transactionId =
      currentMessage.match(/Transaction ID 2 (\d+)/)?.[1] ||
      currentMessage.match(/Transaction ID (\d+)/)?.[1];

    // TODO: extract balance if available

    if (paymentCode && amount) {
      extractedData['payGoods'] = {
        id: generateCustomUUID(),
        action: 'PAY_GOOD_SERVICE',
        text: currentMessage,
        timestamp: Date.now(),
        transaction: {
          paymentCode,
          amount: amount.replace(/,/g, ''),
          status: 'completed',
          provider: 'MTN',
          transactionId,
          name: names,
          fees: fees?.replace(/,/g, ''),
        },
      };
    }
  }
  return extractedData;
};
