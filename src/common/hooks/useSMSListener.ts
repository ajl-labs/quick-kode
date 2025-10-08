import { useEffect, useState } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { postTransactionData } from '../../store/features/history/history.thunk';

const { SmsListener } = NativeModules;
const smsListenerEmitter = new NativeEventEmitter(SmsListener);

const requestSmsPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]);
      if (
        granted['android.permission.READ_SMS'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECEIVE_SMS'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const useSMSListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string>('');
  useEffect(() => {
    const startListener = async () => {
      const hasPermission = await requestSmsPermission();
      if (hasPermission) {
        SmsListener.startSmsListener()
          .then((res: string) => console.log(res))
          .catch((err: Error) => console.error(err));
      }
    };

    startListener();

    const subscription = smsListenerEmitter.addListener(
      'onSmsReceived',
      async (event: { message: string; sender: string }) => {
        Alert.alert(`New SMS from ${event.sender}`, event.message);
        try {
          setMessage(event.message);
          await dispatch(
            postTransactionData({
              message: event.message,
              sender: event.sender,
              phoneNumber: '+250789277275',
            }),
          ).unwrap();
        } catch (error) {
          console.error('Error posting SMS data:', error);
        }
      },
    );

    return () => {
      SmsListener.stopSmsListener()
        .then((res: string) => console.log(res))
        .catch((err: Error) => console.error(err));
      subscription.remove();
    };
  }, []);
  return {
    message,
  };
};
