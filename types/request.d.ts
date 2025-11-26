import { TransactionGranularity } from '../src/common/constants';

declare global {
  interface IPaginatedFetchParams {
    limit: number;
    search?: string | null;
    cursor?: string | null;
  }
}
