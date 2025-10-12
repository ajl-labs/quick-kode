import { ToastAndroid } from 'react-native';

export const generateCustomUUID = () => {
  const timestamp = Date.now().toString(36); // base36 = numbers + letters
  const random = Math.random().toString(36).substring(2, 8); // 6 random chars
  return `id-${timestamp}-${random}`;
};

export const to_snake_case = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore before uppercase letters
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
    .toLowerCase(); // Convert to lowercase
};

export const showAndroidToast = (
  message: string,
  duration: 'SHORT' | 'LONG' = 'SHORT',
) => {
  if (typeof message !== 'string') return;
  const toastDuration =
    duration === 'SHORT' ? ToastAndroid.SHORT : ToastAndroid.LONG;
  ToastAndroid.showWithGravityAndOffset(
    message,
    toastDuration,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export const replaceUrlPlaceholders = (
  url: string,
  data: Record<string, any>,
): string => {
  let modifiedUrl = url;
  Object.keys(data).forEach(key => {
    const placeholder = `:${key}`;
    modifiedUrl = modifiedUrl.replace(
      placeholder,
      encodeURIComponent(String(data[key])),
    );
  });
  return modifiedUrl;
};
