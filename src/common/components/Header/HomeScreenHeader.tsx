import React, { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Linking,
  PermissionsAndroid,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  Appbar,
  Divider,
  ListItemProps,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import globalStyles from '../../styles/global.styles';
import { showAndroidToast } from '../../helpers/utils';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import { CustomButton } from '../CustomButton';
import { Icon } from '../Icon';
import { List } from 'react-native-paper';
import {
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import ReAnimated from 'react-native-reanimated';
import { startCase } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectReportGranularity,
  setReportGranularity,
  setReportDateRange,
  selectReportPeriod,
} from '../../../store/features/appConfig/app.config.slice';
import { TransactionGranularity } from '../../constants';

const READ_SMS_PERMISSION_MESSAGE =
  'We need SMS permission to read your transaction messages and help you track and analyze your finances.';

export const HomeScreenHeader: React.FC<NativeStackHeaderProps> = props => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasReadSMSPermission, setHasReadSMSPermission] = useState<boolean>();
  const title = getHeaderTitle(props.options, props.route.name);
  const theme = useTheme();
  const dispatch = useDispatch();
  const granularity = useSelector(selectReportGranularity);
  const reportPeriod = useSelector(selectReportPeriod);
  const requestPermission = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (e) {
      showAndroidToast('Error requesting permission');
    }
  }, []);

  const handleDateSelection = (months: number) => {
    dispatch(setReportDateRange({ months }));
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 500);
  };

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

  const selectedListItemProps: Partial<ListItemProps> = {
    titleStyle: {
      color: theme.colors.onPrimary,
    },
    style: {
      backgroundColor: theme.colors.primary,
    },
    right: props => (
      <Icon {...props} name="Check" color={theme.colors.onPrimary} />
    ),
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <View style={styles.moreMenuContainer}>
          <Appbar.Action
            icon={props => <Icon name="More" {...props} />}
            onPress={() => setIsMenuOpen(state => !state)}
            animated={false}
          />
          {isMenuOpen && (
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10,
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height,
              }}
              onPress={() => {
                setIsMenuOpen(false);
              }}
            />
          )}
          <ReAnimated.View
            style={[
              styles.moreMenu,
              {
                height: isMenuOpen ? Dimensions.get('screen').height : 0,
                transitionProperty: ['height', 'opacity'],
                transitionDuration: 300,
                opacity: isMenuOpen ? 1 : 0,
              },
            ]}
          >
            <Surface
              style={[
                {
                  borderRadius: theme.roundness,
                  width: '100%',
                },
              ]}
            >
              <List.Section title="Granularity">
                <Divider />
                {[
                  TransactionGranularity.WEEK,
                  TransactionGranularity.MONTH,
                  TransactionGranularity.YEAR,
                ].map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setReportGranularity(item));
                      setTimeout(() => {
                        setIsMenuOpen(false);
                      }, 500);
                    }}
                    key={item}
                  >
                    <List.Item
                      title={startCase(item)}
                      {...(item === granularity ? selectedListItemProps : {})}
                    />
                  </TouchableOpacity>
                ))}
              </List.Section>
              <Divider />
              <List.Section title="Period">
                <Divider />
                {[
                  { title: 'Month', value: 1 },
                  {
                    title: '3 Months',
                    value: 3,
                  },
                  { title: '6 Months', value: 6 },
                  { title: '1 Year', value: 12 },
                ].map(item => (
                  <TouchableOpacity
                    onPress={handleDateSelection.bind(null, item.value)}
                    key={`select-period-${item.title}`}
                  >
                    <List.Item
                      title={item.title}
                      left={props => (
                        <Icon
                          name="Calendar"
                          {...props}
                          {...(item.value === reportPeriod
                            ? { color: theme.colors.onPrimary }
                            : {})}
                        />
                      )}
                      {...(item.value === reportPeriod
                        ? selectedListItemProps
                        : {})}
                    />
                  </TouchableOpacity>
                ))}
              </List.Section>
            </Surface>
          </ReAnimated.View>
        </View>
      </Appbar.Header>
      {typeof hasReadSMSPermission === 'boolean' && !hasReadSMSPermission && (
        <View style={[globalStyles.spacing]}>
          <View
            style={[
              globalStyles.row,
              globalStyles.spacingSm,
              globalStyles.gapSm,
              {
                backgroundColor: theme.colors.errorContainer,
                borderRadius: theme.roundness,
              },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.error, flexShrink: 1 }}
            >
              {READ_SMS_PERMISSION_MESSAGE}
            </Text>
            <CustomButton
              mode="outlined"
              textColor={theme.colors.onErrorContainer}
              theme={{ colors: { outline: theme.colors.error } }}
              contentStyle={[globalStyles.noSpacing]}
              onPress={requestPermission}
            >
              ALLOW
            </CustomButton>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  moreMenuContainer: {
    position: 'relative',
  },
  moreMenu: {
    position: 'absolute',
    top: moderateScale(35),
    right: moderateScale(35),
    width: moderateVerticalScale(150),
    zIndex: 20,
  },
});
