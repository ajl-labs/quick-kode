import { useRef, createContext, useState, useEffect, useCallback } from 'react';
import {
  CustomBottomSheet,
  CustomBottomSheetHandles,
} from '../components/CustomBottomSheet';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { dialUSSD } from '../helpers';
import { USSDHandlerForm } from '../components/Form/USSDHandlerForm';
import { useDispatch } from 'react-redux';
import { addUsedCount } from '../../store/features/ussdCode/ussd.code.slice';

type ContextType = {
  onClose: () => void;
  onOpen: (codeConfig: IUSSDCodeData) => void;
};
export const USSDCodeHandlerContext = createContext<ContextType | null>(null);

interface USSDCodeHandlerProviderProps {
  children?: React.ReactNode;
}

export const USSDCodeHandlerProvider = ({
  children,
}: USSDCodeHandlerProviderProps) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<CustomBottomSheetHandles>(null);
  const [currentCodeConfig, setCurrentCodeConfig] = useState<IUSSDCodeData>();

  const open = (config: IUSSDCodeData) => {
    // if no variables to fill, dial immediately
    if (!config.code.includes('{{')) {
      handleSubmit(config.code);
      return;
    } else {
      setCurrentCodeConfig(config);
      bottomSheetRef.current?.present();
    }
  };

  const close = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleUsedCount = useCallback(() => {
    if (currentCodeConfig?.code) {
      dispatch(
        addUsedCount({
          code: currentCodeConfig?.code,
        }),
      );
    }
  }, [currentCodeConfig?.code, dispatch]);

  const handleSubmit = useCallback(
    (formattedCode: string) => {
      dialUSSD(formattedCode);
      bottomSheetRef.current?.dismiss();
      handleUsedCount();
    },
    [handleUsedCount],
  );

  useEffect(() => {
    if (!currentCodeConfig) {
      bottomSheetRef.current?.dismiss();
    }
  }, [currentCodeConfig]);

  return (
    <USSDCodeHandlerContext.Provider value={{ onOpen: open, onClose: close }}>
      {children}
      <CustomBottomSheet ref={bottomSheetRef}>
        <USSDHandlerForm config={currentCodeConfig} onSubmit={handleSubmit} />
      </CustomBottomSheet>
    </USSDCodeHandlerContext.Provider>
  );
};
