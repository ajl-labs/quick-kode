interface DatabaseAttributes {
  id: string;
  created_at: Date;
  updated_at: Date;
}

type IDataBaseRecord<T> = DatabaseAttributes & T;
