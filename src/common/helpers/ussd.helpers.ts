import {
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';

export const dialUSSD = async (ussdCode: string) => {
  if (Platform.OS === 'android') {
    console.log('Dialing USSD code:', ussdCode?.trim());
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      NativeModules.UssdModule.dialUssdCode(ussdCode);
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Permission to dial USSD code denied.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      throw new Error(
        'Permission to make phone calls denied. Please enable it in settings.',
      );
    }
  } else {
    Linking.openURL(`tel:${ussdCode.trim()}`);
  }
};

export const checkAccessibilityPermission = async () => {
  if (Platform.OS === 'android') {
    const isEnabled =
      await NativeModules.UssdModule.isAccessibilityServiceEnabled();
    console.log('Accessibility service enabled:', isEnabled);
    if (!isEnabled) {
      console.log('Accessibility service not enabled');
      // Optionally open settings
      NativeModules.UssdModule.openAccessibilitySettings();
    }
  }
};
