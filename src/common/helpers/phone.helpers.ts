export const formatRwandaPhone = (phone?: string) => {
  if (!phone) return '';
  return phone.replace(/^(\+250|0)?(\d{3})(\d{3})(\d{3})$/, '+250 $2 $3 $4');
};

export const removeCountryCode = (phone?: string) => {
  if (!phone) return '';
  // Remove country code
  let cleaned = phone.replace(/^(\+25|25)/, '');
  // Remove '-', '(', ')', and spaces
  cleaned = cleaned.replace(/[-()\s]/g, '');
  return cleaned;
};

export const getProviderFromPhone = (
  phone?: string,
): ITransactionPayload['provider'] => {
  if (!phone) return 'Unknown';
  const cleaned = removeCountryCode(phone);
  if (cleaned.startsWith('078') || cleaned.startsWith('079')) {
    return 'MTN';
  } else if (cleaned.startsWith('072') || cleaned.startsWith('073')) {
    return 'Airtel';
  }
  return 'Unknown';
};
