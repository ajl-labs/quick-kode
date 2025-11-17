interface IUSSDCodeData {
  code: string;
  icon?: string;
  variables: Record<
    string,
    {
      type: 'text' | 'number' | 'integer' | 'currency' | 'phone';
      label?: string;
    }
  >;
  usedCount?: number;
  description: string;
  isFavorite?: boolean;
}
