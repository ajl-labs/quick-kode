import * as Yup from 'yup';
export const formatCurrency = (amount: number | string | null): string => {
  if (!amount || isNaN(parseFloat(amount as string))) {
    return '---';
  }
  return parseFloat(amount as string).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency: 'RWF',
    style: 'currency',
  });
};

export const reverseFormatCurrency = (
  value: number,
  originalValue: string,
): number => {
  if (typeof originalValue === 'string') {
    // remove commas, spaces, currency symbols etc.
    const parsed = originalValue.replace(/[^0-9.-]+/g, '').trim();
    return parsed === '' ? 0 : Number(parsed);
  }
  return value;
};

export const formatMoneyShort = (value: number): string => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  if (value >= 100_000) {
    return (value / 1_000).toFixed(0) + 'k';
  }
  return value.toString();
};

export const amountSchema = {
  amount: Yup.number()
    .transform(reverseFormatCurrency)
    .min(1, 'Too small')
    .required('Required'),
};
