import React, { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Linking,
  PermissionsAndroid,
  View,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../../styles/global.styles';
import { showAndroidToast } from '../../helpers/utils';

const READ_SMS_PERMISSION_MESSAGE =
  'We need SMS permission to read your transaction messages and help you track and analyze your finances.';
interface IBottomTabHeaderProps extends BottomTabHeaderProps {}

export const BottomTabHeader: React.FC<IBottomTabHeaderProps> = props => {
  const [hasReadSMSPermission, setHasReadSMSPermission] = useState<boolean>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const requestPermission = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (e) {
      showAndroidToast('Error requesting permission');
    }
  }, []);

  useEffect(() => {
    const checkPermission = async (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        const permission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        );
        setHasReadSMSPermission(permission);
      }
    };
    const subscription = AppState.addEventListener('change', checkPermission);

    // run on mount
    checkPermission('active');
    // unscribe on unamount
    return () => subscription.remove();
  }, []);

  return (
    <View
      style={[
        globalStyles.verticalSpacingSm,
        globalStyles.horizontalSpacingSm,
        globalStyles.column,
        globalStyles.gapSm,
        { marginTop: insets.top },
      ]}
    >
      {typeof props.options.headerTitle === 'string' ? (
        <Text variant="titleLarge">{props.options.headerTitle}</Text>
      ) : (
        <>{props.options.headerTitle}</>
      )}
      {typeof hasReadSMSPermission === 'boolean' && !hasReadSMSPermission && (
        <View
          style={[
            globalStyles.spacingSm,
            globalStyles.gapSm,
            {
              backgroundColor: theme.colors.errorContainer,
              borderRadius: theme.roundness,
            },
          ]}
        >
          <Text variant="labelSmall" style={{ color: theme.colors.error }}>
            {READ_SMS_PERMISSION_MESSAGE}
          </Text>
          <Button
            mode="outlined"
            style={{ alignSelf: 'flex-end' }}
            textColor={theme.colors.onErrorContainer}
            theme={{ colors: { outline: theme.colors.error } }}
            contentStyle={[globalStyles.noSpacing]}
            onPress={requestPermission}
          >
            <Text variant="labelSmall"> ALLOW PERMISSION</Text>
          </Button>
        </View>
      )}
    </View>
  );
};
