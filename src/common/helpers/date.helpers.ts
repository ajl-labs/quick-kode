import moment from 'moment';

export const formatDate = (
  date: Date | string | number,
  format: string = 'DD/MM/YYYY',
) => {
  if (!date) return '';
  if (format === 'week') return formatWeek(date);
  return moment(date).format(format);
};

export const formatWeek = (date: Date | string | number) => {
  if (!date) return '';
  const start = moment(date).startOf('week').format('DD');
  const end = moment(date).endOf('week').format('DD MMM');
  return `${start}-${end}`;
};

export const formatDateTime = (
  date: Date | string | number,
  format: string = 'DD/MM/YYYY HH:mm:ss',
) => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatTime = (
  date: Date | string | number,
  format: string = 'HH:mm:ss',
) => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatRelativeTime = (date: Date | string | number) => {
  if (!date) return '';
  return moment(date).fromNow();
};

export const isToday = (date: Date | string | number) => {
  if (!date) return false;
  return moment(date).isSame(moment(), 'day');
};

export const subtractDate = (date: Date, days: number) => {
  if (!date) return '';
  return moment(date).subtract(days, 'days').toISOString();
};
