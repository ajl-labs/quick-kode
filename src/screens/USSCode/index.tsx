import { useRef } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import globalStyles from '../../common/styles/global.styles';
import { IconButton, useTheme, Text } from 'react-native-paper';
import {
  removeCode,
  selectAllUSSDCodes,
  toogleCodeFavorite,
} from '../../store/features/ussdCode/ussd.code.slice';
import { Icon } from '../../common/components';
import { NewCodeForm } from './components/NewCodeForm';
import { Swipeable, GHSwipeable } from '../../common/components/Swipeable';
import { useUSSDCodeHandler } from '../../common/hooks/useUSSDCodeHandler';
import { moderateScale } from 'react-native-size-matters';

export const USSDCodeScreen = () => {
  const swipeableRef = useRef<GHSwipeable>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { openUSSSHandlerForm } = useUSSDCodeHandler();

  const USSDCodes = useSelector(selectAllUSSDCodes);

  const toogleFavorite = (codeConfig: IUSSDCodeData, isFavorite: boolean) => {
    let title = 'Add to Favorites';
    let message = `Do you want to add ${codeConfig.description} to your favorites?`;

    if (isFavorite) {
      title = 'Remove from Favorites';
      message = `Do you want to remove ${codeConfig.description} from your favorites?`;
    }

    return Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('canceled');
        },
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () =>
          dispatch(
            toogleCodeFavorite({
              code: codeConfig.code,
              isFavorite: !isFavorite,
            }),
          ),
      },
    ]);
  };

  const deleteCodeAlert = (code: string) => {
    Alert.alert(
      'Delete USSD Code',
      'Are you sure you want to delete this USSD code?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            swipeableRef.current?.close();
          },
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
        ref={swipeableRef}
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
        <TouchableOpacity
          onPress={() => openUSSSHandlerForm(item)}
          onLongPress={() => {
            toogleFavorite(item, Boolean(item.isFavorite));
          }}
          style={styles.listItem}
        >
          <View
            style={[
              globalStyles.fullWidth,
              globalStyles.row,
              globalStyles.spacedRow,
            ]}
          >
            <IconButton
              icon={props => (
                <Icon
                  {...props}
                  name={item.icon || 'DialPad'}
                  color={item.isFavorite ? theme.colors.primary : props.color}
                />
              )}
            />
            <View style={styles.listItemContent}>
              <Text variant="bodyLarge">{item.description}</Text>
            </View>
            <IconButton
              icon={props => (
                <Icon
                  {...props}
                  name="ArrowForward"
                  color={theme.colors.outline}
                />
              )}
            />
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <FlatList<IUSSDCodeData>
        data={USSDCodes}
        renderItem={_renderItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.listContentContainer}
      />
      <NewCodeForm />
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: { gap: moderateScale(4) },
  listItem: {},
  listItemContent: {
    flexGrow: 1,
  },
});
