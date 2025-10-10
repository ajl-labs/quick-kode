import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Button,
  Divider,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { Container } from '../../common/Container';
import { CustomBottomSheet } from '../../common/components/CustomBottomSheet';
import Form from '../../common/components/Form';
import * as Yup from 'yup';
import { Icon } from '../../common/components';
import { FormikHelpers, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addWebhook,
  selectWebhooks,
} from '../../store/features/settings/settings.slice';
import globalStyles from '../../common/styles/global.styles';
import { moderateScale } from 'react-native-size-matters';

const webhookSchema = Yup.object().shape({
  url: Yup.string().required('Webhook URL is required'),
  username: Yup.string(),
  password: Yup.string(),
});

export const WebhookSettings = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const webhooksList = useSelector(selectWebhooks);

  const handleSubmit = async (
    data: IWebhookData,
    { resetForm, setSubmitting }: FormikHelpers<any>,
  ) => {
    try {
      setSubmitting(true);
      dispatch(addWebhook(data));
      await setTimeout(() => {
        resetForm();
        sheetRef.current?.dismiss();
      }, 500);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: { url: '', username: '', password: '' },
    validationSchema: webhookSchema,
    onSubmit: (values, options) => {
      const transformedValue = webhookSchema.cast(values);
      handleSubmit(
        {
          url: transformedValue.url,
          username: transformedValue.username,
          password: transformedValue.password,
        },
        options,
      );
    },
  });

  const renderWebhookItem = ({ item }: { item: IWebhookData }) => {
    const color = item.failed ? theme.colors.error : theme.colors.primary;
    return (
      <View>
        <View style={[globalStyles.spacedRow, globalStyles.fullWidth]}>
          <View style={[globalStyles.row, globalStyles.gap]}>
            <Icon name="Webhook" color={color} />
            <Text variant="bodyMedium" style={{ color }}>
              {item.url}
            </Text>
          </View>
          <IconButton
            icon={props => <Icon name="Edit" {...props} />}
            size={moderateScale(15)}
            onPress={() => {
              formik.setValues({
                url: item.url,
                username: item.username || '',
                password: item.password || '',
              });
              sheetRef.current?.present();
            }}
            iconColor={color}
            containerColor={`${color}20`}
          />
        </View>
        <Divider />
      </View>
    );
  };
  return (
    <>
      <Container>
        <Text variant="titleLarge">Webhook Settings</Text>
        <Text variant="bodyMedium">
          A webhook is a way for apps to send real-time data to other services.
          Here, you can configure the endpoint where collected data will be sent
          and fetched. Webhooks help automate data sharing between QuickKode and
          your chosen service.
        </Text>
        <Button
          mode="outlined"
          onPress={() => sheetRef.current?.present()}
          icon={props => <Icon name="Webhook" {...props} />}
        >
          Add Webhook
        </Button>
        <FlatList
          data={webhooksList}
          keyExtractor={item => item.url}
          renderItem={renderWebhookItem}
        />
      </Container>
      <CustomBottomSheet ref={sheetRef}>
        <Form.FormContainer>
          <Form.FormInput
            label="Webhook URL"
            placeholder="https://example.com"
            leftIcon="Link"
            onChangeText={formik.handleChange('url')}
            errorMessage={formik.errors.url}
            value={formik.values.url}
          />
          <View>
            <Text variant="labelSmall">
              Webhook authorization, now we are supporting basic auth.
            </Text>
            <Form.FormInput
              label="Username"
              placeholder="Enter your username"
              onChangeText={formik.handleChange('username')}
              errorMessage={formik.errors.username}
              value={formik.values.username}
            />
          </View>
          <Form.FormInput
            label="Password"
            placeholder="Enter your password"
            leftIcon="Lock"
            onChangeText={formik.handleChange('password')}
            errorMessage={formik.errors.password}
            value={formik.values.password}
            secret
            returnKeyType="done"
            returnKeyLabel="Submit"
          />
          <Form.FormButton
            title="Save Webhook"
            disabled={!formik.isValid}
            loading={formik.isSubmitting}
            onPress={() => formik.handleSubmit()}
          />
        </Form.FormContainer>
      </CustomBottomSheet>
    </>
  );
};
