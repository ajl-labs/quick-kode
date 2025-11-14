import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import globalStyles from '../../common/styles/global.styles';
import { IconButton, List, Text, useTheme } from 'react-native-paper';
import {
  selectAllUSSDCodes,
  toogleCodeFavorite,
} from '../../store/features/ussdCode/ussd.code.slice';
import { Icon } from '../../common/components';
import { useCallback } from 'react';

export const USSDCodeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const USSDCodes = useSelector(selectAllUSSDCodes);

  const toogleFavorite = useCallback((code: string, isFavorite: boolean) => {
    dispatch(toogleCodeFavorite({ code, isFavorite }));
  }, []);
  const _renderItem = ({ item }: { item: IUSSDCodeData }) => {
    return (
      <List.Item
        title={item.description}
        onPress={() => {}}
        left={props => (
          <Icon
            {...props}
            name="DialPad"
            color={item.isFavorite ? theme.colors.primary : props.color}
          />
        )}
        right={props => (
          <Icon {...props} name="ArrowForward" color={theme.colors.outline} />
        )}
      />
      //   {/* <List.Item
      //     title=""
      //     // title={
      //     //   <Text
      //     //     style={globalStyles.code}
      //     //     numberOfLines={1}
      //     //     lineBreakMode="tail"
      //     //   >
      //     //     {item.code}
      //     //   </Text>
      //     // }
      //     description={
      //       <Text
      //         style={globalStyles.code}
      //         numberOfLines={1}
      //         lineBreakMode="tail"
      //       >
      //         {item.code}
      //       </Text>
      //     }
      //     // left={props => (
      //     //   <Icon
      //     //     {...props}
      //     //     name="DialPad"
      //     //     color={item.isFavorite ? theme.colors.primary : props.color}
      //     //   />
      //     // )}
      //     // right={props => (
      //     //   <IconButton
      //     //     {...props}
      //     //     iconColor={props.color}
      //     //     contentStyle={[globalStyles.centered]}
      //     //     icon={iconProps => (
      //     //       <Icon
      //     //         {...iconProps}
      //     //         color={item.isFavorite ? theme.colors.primary : iconProps.color}
      //     //         name={item.isFavorite ? 'Bookmark' : 'AddBookmark'}
      //     //       />
      //     //     )}
      //     //     onPress={() => toogleFavorite(item.code, !item.isFavorite)}
      //     //   />
      //     // )}
      //   /> */}
      //   <Text style={globalStyles.code} numberOfLines={1} lineBreakMode="tail">
      //     {item.code}
      //   </Text>
      // </List.Item>
    );
  };

  return (
    <FlatList<IUSSDCodeData>
      data={USSDCodes}
      renderItem={_renderItem}
      keyExtractor={item => item.code}
      contentContainerStyle={[globalStyles.spacingSm]}
    />
  );
};
