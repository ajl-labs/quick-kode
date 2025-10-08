import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { Icon } from '../../../common/components';
import { ThemeSpacings } from '../../../config/theme';
import { selectContactPhone } from 'react-native-select-contact';
import { removeCountryCode } from '../../../common/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { MOMO_USSD_CODES } from '../../../common/helpers/ussd.momo.helper';
import { NumberInput } from '../../../common/components/Input/NumberInput';
import { amountSchema } from '../../../common/helpers/currency.helpers';
import { moderateScale } from 'react-native-size-matters';

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Required'),
  ...amountSchema,
});
const styles = StyleSheet.create({
  container: {
    gap: ThemeSpacings.lg,
  },
  input: {
    height: moderateScale(56),
  },
});

interface SendMoneyFormProps {
  onCancel?: () => void;
  loading?: boolean;
  onConfirm?: (data: {
    amount: string;
    receiver: string;
    ussCodeKey: keyof typeof MOMO_USSD_CODES;
  }) => void;
}
export const SendMoneyForm: React.FC<SendMoneyFormProps> = ({
  onCancel,
  onConfirm,
  loading,
}) => {
  const theme = useTheme();

  const [contactName, setContactName] = React.useState('');
  const formik = useFormik({
    initialValues: { amount: '', phoneNumber: '' },
    validationSchema,
    onSubmit: values => {
      const transformedValue = validationSchema.cast(values);
      onConfirm?.({
        amount: transformedValue.amount.toString(),
        receiver: transformedValue.phoneNumber,
        ussCodeKey: 'SEND_MONEY',
      });
    },
  });

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickContact = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access contacts');
      return;
    }
    const { phoneNumber, contactName } = await selectContactPhone().then(
      selection => {
        if (!selection) {
          Alert.alert('No contact selected', 'Please select a contact');
          return {};
        }

        let { contact, selectedPhone } = selection;
        const formattedPhone = removeCountryCode(selectedPhone.number);
        const contactName = contact.name || 'Unknown Contact';
        const contactType = selectedPhone.type || 'Unknown Type';

        return { phoneNumber: formattedPhone, contactName, contactType };
      },
    );
    if (contactName) {
      setContactName(contactName);
    }
    if (phoneNumber) {
      formik.setFieldValue('phoneNumber', phoneNumber);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setContactName('');
    onCancel?.();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View>
          <TextInput
            keyboardType="phone-pad"
            mode="outlined"
            label={contactName.trim().slice(0, 15) ?? 'Phone Number'}
            style={styles.input}
            left={
              <TextInput.Icon
                icon={props => <Icon name="Phone" {...props} />}
              />
            }
            right={
              <TextInput.Icon
                icon={props => <Icon name="AccountBox" {...props} />}
                onPress={pickContact}
              />
            }
            value={formik.values.phoneNumber}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            onChangeText={formik.handleChange('phoneNumber')}
            onBlur={formik.handleBlur('phoneNumber')}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <Text style={{ color: theme.colors.error }}>
              {formik.errors.phoneNumber}
            </Text>
          ) : null}
        </View>
        <View>
          <NumberInput
            keyboardType="decimal-pad"
            mode="outlined"
            label="Amount"
            style={styles.input}
            left={
              <TextInput.Icon icon={props => <Icon name="Cash" {...props} />} />
            }
            value={formik.values.amount}
            onChangeText={formik.handleChange('amount')}
            onBlur={formik.handleBlur('amount')}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
          />
          {formik.touched.amount && formik.errors.amount ? (
            <Text style={{ color: theme.colors.error }}>
              {formik.errors.amount}
            </Text>
          ) : null}
        </View>

        <Button
          mode="contained"
          icon={props => <Icon name="ArrowTopRight" {...props} />}
          onPress={formik.handleSubmit as any}
          loading={loading}
          disabled={loading}
        >
          Send Money
        </Button>
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          onPress={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
