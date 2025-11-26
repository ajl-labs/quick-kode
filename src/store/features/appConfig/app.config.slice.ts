import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { TransactionGranularity } from '../../../common/constants';
import { pick } from 'lodash';

const initialState: IAppConfig = {
  report: {
    granularity: TransactionGranularity.MONTH,
    months: 3,
  },
};

const appConfig = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    addUserPhoneNumber: (state, action) => {
      state.userPhoneNumber = action.payload;
    },
    setReportGranularity: (
      state,
      action: { payload: IAppConfig['report']['granularity'] },
    ) => {
      state.report = {
        ...state.report,
        granularity: action.payload,
      };
    },
    setReportDateRange: (
      state,
      action: { payload: Pick<IAppConfig['report'], 'months'> },
    ) => {
      state.report = {
        ...state.report,
        ...pick(action.payload, ['months']),
      };
    },
  },
});

const { reducer, actions } = appConfig;
export const { addUserPhoneNumber, setReportGranularity, setReportDateRange } =
  actions;

export default reducer;

export const selectReportGranularity = (state: RootState) =>
  state.config.report?.granularity;
export const selectReportPeriod = (state: RootState) =>
  state.config.report.months;
