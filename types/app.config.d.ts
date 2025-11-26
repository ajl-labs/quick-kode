import { TransactionGranularity } from '../src/common/constants';

declare global {
  interface IReportQueryParams {
    granularity?: TransactionGranularity;
    months?: number;
  }
  interface IAppConfig {
    userPhoneNumber?: string;
    report: IReportQueryParams;
  }
}
