import { createSlice } from '@reduxjs/toolkit';

const initialState: IAppConfig = {};

const appConfig = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    addUserPhoneNumber: (state, action) => {
      state.userPhoneNumber = action.payload;
    },
  },
});

const { reducer, actions } = appConfig;
export const { addUserPhoneNumber } = actions;

export default reducer;
