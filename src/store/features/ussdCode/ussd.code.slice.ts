import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IconProps } from '../../../common/components';
import { DEFAULT_USSD_CODE_CONFIG } from '../../../common/constants/default.state';

interface USSDCodeStateType {
  codes: Record<string, IUSSDCodeData & { icon?: IconProps['name'] }>;
}

const initialState: USSDCodeStateType = {
  codes: DEFAULT_USSD_CODE_CONFIG,
};

const ussdCodeSlice = createSlice({
  name: 'ussdCode',
  initialState,
  reducers: {
    addCode(
      state,
      action: {
        type: string;
        payload: Pick<IUSSDCodeData, 'code' | 'description' | 'variables'>;
      },
    ) {
      const { code, description, variables } = action.payload;
      state.codes[code] = { code, description, variables };
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

    addUsedCount(state, action: { type: string; payload: { code: string } }) {
      const { code } = action.payload;
      if (state.codes[code]) {
        if (!state.codes[code].usedCount) {
          state.codes[code].usedCount = 0;
        }
        state.codes[code].usedCount! += 1;
      }
    },
  },
});

const { actions, reducer } = ussdCodeSlice;
export const { addCode, removeCode, toogleCodeFavorite, addUsedCount } =
  actions;

export default reducer;
export const selectAllUSSDCodes = createSelector(
  (state: RootState) => state.ussdCode.codes,
  codes => Object.values(codes),
);

export const selectFavoriteUSSDCodes = createSelector(
  (state: RootState) => state.ussdCode.codes,
  codes =>
    Object.values(codes)
      .filter(code => code.isFavorite)
      .sort((a, b) => (b.usedCount ?? 0) - (a.usedCount ?? 0))
      .slice(0, 5),
);

export const selectAllUSSDCodesObject = (state: RootState) =>
  state.ussdCode.codes;
