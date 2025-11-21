import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Appbar, IconButton, Text, Title } from 'react-native-paper';
import { Icon } from '../Icon';
import { head } from 'lodash';
import { isEmpty } from '../../helpers';
import globalStyles from '../../styles/global.styles';
import { showAndroidToast } from '../../helpers/utils';

interface CustomAppHeaderProps extends NativeStackHeaderProps {}

export const CustomAppHeader: React.FC<CustomAppHeaderProps> = ({
  options,
  navigation,
  back,
  ...rest
}) => {
  console.log({ options, navigation, ...rest });
  const _goBack = () => {
    navigation.goBack();
  };

  const _handleSearch = () => showAndroidToast('Comming soon...');

  const _renderHeaderTitle = () => {
    let headerTitle: React.ReactNode;

    if (options.headerTitle && typeof options.headerTitle !== 'string') {
      headerTitle = (
        <Appbar.Content
          title={<>{options.headerTitle}</>}
          style={[globalStyles.horizontalMargin]}
        />
      );
    } else {
      headerTitle = (
        <Appbar.Content
          title={
            <Text variant="titleMedium">
              {options.headerTitle || options.title}
            </Text>
          }
          style={[globalStyles.horizontalMargin]}
        />
      );
    }
    return headerTitle;
  };

  return (
    <Appbar.Header>
      {back && navigation.canGoBack() && (
        <Appbar.Action
          icon={props => <Icon {...props} name="ArrowBack" />}
          onPress={_goBack}
          style={{ marginHorizontal: 0 }}
        />
      )}
      {_renderHeaderTitle()}

      {!isEmpty(options.headerSearchBarOptions) && (
        <Appbar.Action
          icon={props => <Icon {...props} name="Search" />}
          onPress={_handleSearch}
          style={{ marginHorizontal: 0 }}
        />
      )}
    </Appbar.Header>
  );
};
