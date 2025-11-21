interface IPaginatedFetchParams {
  limit: number;
  search?: string | null;
  cursor?: string | null;
}
