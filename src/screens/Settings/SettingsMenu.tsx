import { Text, useTheme } from 'react-native-paper';
import { Container } from '../../common/Container';
import { Icon, IconProps } from '../../common/components';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../common/styles/global.styles';
import React, { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CustomBottomSheet } from '../../common/components/CustomBottomSheet';
import { EditTransactionLabel } from './components/EditTransactionLabel';
import { ThemeSpacings } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import { SettingsStackScreens } from '../../navigation/navigation.constants';

interface SettingsItemProps {
  title: string;
  leadingIcon?: IconProps['name'];
  trailingIcon?: IconProps['name'];
  onPress: () => void;
}
const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  leadingIcon,
  trailingIcon,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        borderColor: theme.colors.onSurface,
        borderWidth: StyleSheet.hairlineWidth * 1.3,
        borderRadius: theme.roundness,
      }}
    >
      <View
        style={[
          globalStyles.spacedRow,
          globalStyles.fullWidth,
          globalStyles.verticalSpacing,
          globalStyles.horizontalSpacing,
        ]}
      >
        <View style={[globalStyles.row, { gap: 16 }]}>
          {leadingIcon && (
            <Icon name={leadingIcon} color={theme.colors.onSurface} />
          )}
          <Text variant="titleMedium">{title}</Text>
        </View>
        {trailingIcon && (
          <View style={{ alignSelf: 'flex-end' }}>
            <Icon name={trailingIcon} color={theme.colors.onSurface} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export const SettingsMenu = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const menuItems: SettingsItemProps[] = [
    {
      title: 'Transaction Labels',
      leadingIcon: 'Styles',
      trailingIcon: 'ArrowForward',
      onPress: () => {
        sheetRef.current?.present();
      },
    },
    {
      title: 'Webhook Settings',
      leadingIcon: 'Webhook',
      trailingIcon: 'ArrowForward',
      onPress: navigateTo.bind(null, SettingsStackScreens.WebhookSettings),
    },
  ];

  const renderSettingsItem = ({ item }: { item: SettingsItemProps }) => (
    <SettingsItem {...item} />
  );
  return (
    <Container>
      <FlatList
        data={menuItems}
        renderItem={renderSettingsItem}
        contentContainerStyle={{ gap: ThemeSpacings.md }}
      />
      <CustomBottomSheet ref={sheetRef}>
        <EditTransactionLabel />
      </CustomBottomSheet>
    </Container>
  );
};
