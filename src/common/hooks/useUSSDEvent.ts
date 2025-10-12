import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { MOMO_USSD_CODES } from '../helpers/ussd.momo.helper';
import { useDispatch } from 'react-redux';

// Access the native USSD module and create an event emitter
const { UssdModule } = NativeModules;
const emitter = new NativeEventEmitter(UssdModule);

export const useUSSDEvent = () => {
  // State for current USSD message and loading/error flags
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  // State for tracking the current action name (e.g., 'SEND_MONEY', 'CHECK_BALANCE')
  const [currentActionName, setCurrentActionName] = useState<
    keyof typeof MOMO_USSD_CODES | null
  >(null);

  // Ref to store the previous message without triggering re-renders
  const prevMessageRef = useRef<string | null>(null);

  // Helper: Reset state and mark error if needed
  const resetEventState = (isError: boolean) => {
    setIsLoading(false);
    setFailed(isError);
    setCurrentMessage(null);
    prevMessageRef.current = null;
  };

  // Helper: Dispatch parsed USSD data into Redux store
  // const handlePersistEventData = (
  //   data: IMomoExtractedData,
  //   eventName: keyof typeof MOMO_USSD_CODES,
  // ) => {
  //   if (data.balance) {
  //     dispatch(setMoMoBalance(data.balance));
  //   }
  //   switch (eventName) {
  //     case 'SEND_MONEY':
  //       if (data.send) {
  //         dispatch(addHistoryEntry(data.send));
  //       }
  //       break;
  //     case 'PAY_GOOD_SERVICE':
  //       if (data.payGoods) {
  //         dispatch(addHistoryEntry(data.payGoods));
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // Handle incoming USSD responses
  const handleUSSDResponse = useCallback(
    (event: { message: string }) => {
      const message = event.message;

      const isError = ['invalid MMI code', 'error', 'problem'].some(err =>
        message.toLowerCase()?.includes(err.toLowerCase()),
      );

      if (message.toLowerCase().includes('running…')) {
        setIsLoading(true);
        setFailed(false);
        return;
      }

      if (isError) {
        resetEventState(isError);
        return;
      }

      // Save current message before updating
      prevMessageRef.current = currentMessage;
      setCurrentMessage(message);
      setIsLoading(false);
      setFailed(false);
    },
    [currentMessage],
  );

  // Listen for USSD responses from the native module
  useEffect(() => {
    const ussdEventListener = emitter.addListener(
      'onUSSDResponse',
      handleUSSDResponse,
    );

    return () => {
      ussdEventListener.remove(); // Cleanup listener on unmount
    };
  }, [handleUSSDResponse]);

  // When current message changes, extract and persist USSD data
  // useEffect(() => {
  //   if (currentActionName && currentMessage) {
  //     const extractedData = extractMomoUSSDData(
  //       currentMessage,
  //       prevMessageRef.current,
  //       currentActionName,
  //     );
  //     handlePersistEventData(extractedData, currentActionName);
  //   }
  // }, [currentMessage, currentActionName]);

  return {
    currentMessage,
    loading: isLoading,
    failed,
    action: currentActionName,
    setAction: setCurrentActionName,
  };
};
