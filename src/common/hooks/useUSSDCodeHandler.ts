import { useContext } from 'react';
import { USSDCodeHandlerContext } from '../Context/USSDCodeHandler';

export const useUSSDCodeHandler = () => {
  const ctx = useContext(USSDCodeHandlerContext);

  if (!ctx) {
    throw new Error(
      'useUSSDCodeHandler must be used inside USSDCodeHandlerProvider',
    );
  }

  return ctx; // { open, close }
};
