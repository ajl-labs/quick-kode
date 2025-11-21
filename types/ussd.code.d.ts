import { IconProps } from '../src/common/components';

declare global {
  interface IUSSDCodeData {
    code: string;
    icon?: IconProps['name'];
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
}
