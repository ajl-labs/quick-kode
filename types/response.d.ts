interface DatabaseAttributes {
  id: string;
  created_at: Date;
  updated_at: Date;
}

type IDataBaseRecord<T> = DatabaseAttributes & T;

interface PaginatedResponse<T> {
  data: IDataBaseRecord<T>[];
  total: number;
  page: number;
  limit: number;
}
