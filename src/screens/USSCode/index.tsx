import { Alert, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import globalStyles from '../../common/styles/global.styles';
import { IconButton, List, useTheme } from 'react-native-paper';
import {
  removeCode,
  selectAllUSSDCodes,
  toogleCodeFavorite,
} from '../../store/features/ussdCode/ussd.code.slice';
import { Icon } from '../../common/components';
import { NewCodeForm } from './components/NewCodeForm';
import { Swipeable } from '../../common/components/Swipeable';

export const USSDCodeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const USSDCodes = useSelector(selectAllUSSDCodes);

  const toogleFavorite = (code: string, isFavorite: boolean) =>
    Alert.alert(
      'Add to Favorites',
      'Do you want to add this code to your favorites?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('canceled');
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => dispatch(toogleCodeFavorite({ code, isFavorite })),
        },
      ],
    );

  const deleteCodeAlert = (code: string) => {
    Alert.alert(
      'Delete USSD Code',
      'Are you sure you want to delete this USSD code?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('canceled');
          },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Dispatch delete action here
            dispatch(removeCode({ code }));
          },
          style: 'destructive',
        },
      ],
    );
  };
  const _renderItem = ({ item }: { item: IUSSDCodeData }) => {
    return (
      <Swipeable
        rightAction={
          <IconButton
            icon={props => <Icon name="Delete" {...props} />}
            onPress={deleteCodeAlert.bind(null, item.code)}
            containerColor={`${theme.colors.error}`}
            iconColor={theme.colors.background}
            style={[globalStyles.noRadius, { height: '100%' }]}
          />
        }
      >
        <List.Item
          title={item.description}
          onPress={() => {}}
          onLongPress={() => {
            toogleFavorite(item.code, !Boolean(item.isFavorite));
          }}
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
          style={[globalStyles.fullWidth]}
        />
      </Swipeable>
    );
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <FlatList<IUSSDCodeData>
        data={USSDCodes}
        renderItem={_renderItem}
        keyExtractor={item => item.code}
        contentContainerStyle={[globalStyles.spacingSm]}
      />
      <NewCodeForm />
    </View>
  );
};
