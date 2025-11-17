import { StyleProp, View, ViewStyle } from 'react-native';
import { QuickAction } from '../../../common/components';
import { FC } from 'react';
import { MOMO_USSD_CODES } from '../../../common/helpers/ussd.momo.helper';
import { useSelector } from 'react-redux';
import { selectFavoriteUSSDCodes } from '../../../store/features/ussdCode/ussd.code.slice';
import { useUSSDCodeHandler } from '../../../common/hooks/useUSSDCodeHandler';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

interface HomeQuickActionsProps {
  style: StyleProp<ViewStyle>;
  currentCode?: keyof typeof MOMO_USSD_CODES | null;
  loading?: boolean;
}
export const HomeQuickActions: FC<HomeQuickActionsProps> = ({
  style,
  currentCode,
  loading,
}) => {
  const favoriteUSSDCodes = useSelector(selectFavoriteUSSDCodes);
  const { onOpen } = useUSSDCodeHandler();

  return (
    <View style={style}>
      {favoriteUSSDCodes.map(code => (
        <QuickAction
          key={code.code}
          icon={(code.icon as IconProps['name']) || 'DialPad'}
          onPress={() => onOpen(code)}
          loading={loading && currentCode === code.code}
          disabled={loading}
        >
          {code.description}
        </QuickAction>
      ))}
    </View>
  );
};
