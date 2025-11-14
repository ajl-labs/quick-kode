import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface USSDCodeStateType {
  codes: Record<string, IUSSDCodeData>;
}

const initialState: USSDCodeStateType = {
  codes: {
    '*123#': { code: '*123#', description: 'Airtime Balance' },
    '*182*1*1*{{phoneNumber}}*{{amount}}#': {
      code: '*182*1*1*{{phoneNumber}}*{{amount}}#',
      description: 'Send money',
      isFavorite: true,
    },
    '*182*8*1*{{paymentCode}}*{{amount}}#': {
      code: '*182*8*1*{{paymentCode}}*{{amount}}#',
      description: 'Pay for goods and services',
      isFavorite: true,
    },
    '*182*2*1*1*1#': {
      code: '*182*2*1*1*1#',
      description: 'Buy airtime',
      isFavorite: true,
    },
  },
};

const ussdCodeSlice = createSlice({
  name: 'ussdCode',
  initialState,
  reducers: {
    addCode(
      state,
      action: { type: string; payload: { code: string; description: string } },
    ) {
      const { code, description } = action.payload;
      state.codes[code] = { code, description };
    },

    removeCode(state, action: { type: string; payload: { code: string } }) {
      const { code } = action.payload;
      delete state.codes[code];
    },

    toogleCodeFavorite(
      state,
      action: { type: string; payload: { code: string; isFavorite: boolean } },
    ) {
      const { code, isFavorite } = action.payload;
      if (state.codes[code]) {
        state.codes[code].isFavorite = isFavorite;
      }
    },
  },
});

const { actions, reducer } = ussdCodeSlice;
export const { addCode, removeCode, toogleCodeFavorite } = actions;

export default reducer;
export const selectAllUSSDCodes = createSelector(
  (state: RootState) => state.ussdCode.codes,
  codes => Object.values(codes),
);
