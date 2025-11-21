interface DatabaseAttributes {
  id: string;
  created_at: Date;
  updated_at: Date;
}

type IDataBaseRecord<T> = DatabaseAttributes & T;
interface IPagination {
  nextCursor?: string | null;
  currentCursor?: string | null;
  limit: number;
}
interface PaginatedResponse<T> extends IPagination {
  data: IDataBaseRecord<T>[];
}
