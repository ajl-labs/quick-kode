import { useRef, useState } from 'react';
import {
  Button,
  Divider,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  Alert,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Container } from '../../common/Container';
import {
  CustomBottomSheet,
  CustomBottomSheetHandles,
} from '../../common/components/CustomBottomSheet';

import { Icon } from '../../common/components';
import { FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addWebhook,
  addWebhookAuth,
  removeWebhook,
  selectWebhookAuth,
  selectWebhooks,
} from '../../store/features/settings/settings.slice';
import globalStyles from '../../common/styles/global.styles';
import { moderateScale } from 'react-native-size-matters';
import { FABGroup } from '../../common/components/FABGroup';
import { WebhookForm } from './components/WebhookForm';
import { WebhookAuthForm } from './components/WebhookAuthForm';
import { pick } from 'lodash';
import { Swipeable } from '../../common/components/Swipeable';
import { WEBHOOK_ACTIONS_KEY } from '../../config/data/webhook.actions';

export const WebhookSettings = () => {
  const webhooksList = useSelector(selectWebhooks);
  const webhooksAuth = useSelector(selectWebhookAuth);
  const bottomSheetRef = useRef<CustomBottomSheetHandles>(null);
  const [formType, setFormType] = useState<'webhook' | 'webhook-auth'>(
    'webhook',
  );
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] =
    useState<Pick<IWebhookData, 'url' | 'action'>>();

  const theme = useTheme();
  const dispatch = useDispatch();

  const handleWebhookSubmit = async (
    data: IWebhookData,
    { resetForm, setSubmitting }: FormikHelpers<any>,
  ) => {
    try {
      setSubmitting(true);
      dispatch(
        addWebhook({
          ...data,
          key: data.action as WEBHOOK_ACTIONS_KEY,
        }),
      );
      await setTimeout(() => {
        resetForm();
        bottomSheetRef.current?.dismiss();
      }, 500);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  const handleWebhookAuthSubmit = async (
    data: Pick<IWebhookData, 'username' | 'password'>,
    { resetForm, setSubmitting }: FormikHelpers<any>,
  ) => {
    try {
      setSubmitting(true);
      // Dispatch an action to save webhook auth details
      dispatch(
        addWebhookAuth({ username: data.username!, password: data.password! }),
      );
      await setTimeout(() => {
        resetForm();
        bottomSheetRef.current?.dismiss();
      }, 500);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSheet = (name: 'webhook' | 'webhook-auth') => {
    setFormType(name);
    bottomSheetRef.current?.present();
  };

  const deleteWebhookAlert = (url: string) =>
    Alert.alert(
      'Webhook Delete',
      'Are you sure you want remove this webhook?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(removeWebhook({ url }));
          },
        },
      ],
    );

  const renderWebhookItem = ({ item }: { item: IWebhookData }) => {
    const color = item.failed ? theme.colors.error : theme.colors.primary;
    return (
      <Swipeable
        rightAction={
          <IconButton
            icon={props => <Icon name="Delete" {...props} />}
            onPress={deleteWebhookAlert.bind(null, item.url)}
            containerColor={`${theme.colors.error}`}
            iconColor={theme.colors.background}
            style={[globalStyles.noRadius, { height: '100%' }]}
          />
        }
        style={[globalStyles.horizontalSpacing]}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedWebhook(item);
            handleOpenSheet('webhook');
          }}
          style={[
            globalStyles.row,
            globalStyles.gap,
            globalStyles.fullWidth,
            {
              height: moderateScale(60),
            },
          ]}
        >
          <Icon
            name={item.action.includes('GET') ? 'Download' : 'Upload'}
            color={color}
          />
          <Text
            variant="bodyMedium"
            style={{
              color,
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.url}
          </Text>
        </TouchableOpacity>
        <Divider />
      </Swipeable>
    );
  };

  const renderListHeader = (
    <Container>
      <View style={[globalStyles.gap, { marginBottom: moderateScale(10) }]}>
        <Text variant="bodyMedium">
          A webhook is a way for apps to send real-time data to other services.
          Here, you can configure the endpoint where collected data will be sent
          and fetched. Webhooks help automate data sharing between QuickKode and
          your chosen service.
        </Text>
      </View>
      {!webhooksList.length && (
        <View style={[globalStyles.row, globalStyles.gap]}>
          <Button
            mode="contained"
            icon={props => <Icon {...props} name="Add" />}
            onPress={() => handleOpenSheet('webhook')}
          >
            Webhook
          </Button>
          <Button
            mode="outlined"
            icon={props => <Icon {...props} name="Settings" />}
            onPress={() => handleOpenSheet('webhook-auth')}
          >
            Webhook Config
          </Button>
        </View>
      )}
    </Container>
  );

  return (
    <View style={[globalStyles.flex]}>
      {webhooksList.length > 0 && (
        <FABGroup
          visible={!bottomSheetOpen}
          options={[
            {
              icon: props => <Icon {...props} name="Webhook" />,
              label: 'Add Webhook',
              onPress: () => handleOpenSheet('webhook'),
            },
            {
              icon: props => <Icon {...props} name="Settings" />,
              label: 'Configure Webhook',
              onPress: () => handleOpenSheet('webhook-auth'),
            },
          ]}
        />
      )}

      <FlatList
        ListHeaderComponent={renderListHeader}
        data={webhooksList}
        keyExtractor={item => item.action}
        renderItem={renderWebhookItem}
        contentContainerStyle={[globalStyles.flexGrow, globalStyles.gapSm]}
      />

      <CustomBottomSheet ref={bottomSheetRef} onOpenChange={setBottomSheetOpen}>
        {formType === 'webhook-auth' ? (
          <WebhookAuthForm
            onSubmit={handleWebhookAuthSubmit}
            initialValues={pick(webhooksAuth, ['username', 'password'])}
          />
        ) : (
          <WebhookForm
            onSubmit={handleWebhookSubmit}
            initialValues={selectedWebhook}
          />
        )}
      </CustomBottomSheet>
    </View>
  );
};
