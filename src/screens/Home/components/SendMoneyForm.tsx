import React from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { ThemeSpacings } from '../../../config/theme';
import { selectContactPhone } from 'react-native-select-contact';
import { removeCountryCode } from '../../../common/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { MOMO_USSD_CODES } from '../../../common/helpers/ussd.momo.helper';
import { amountSchema } from '../../../common/helpers/currency.helpers';
import { moderateScale } from 'react-native-size-matters';
import Form from '../../../common/components/Form';

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
    <Form.FormContainer>
      <Form.FormInput
        keyboardType="phone-pad"
        mode="outlined"
        label={contactName.trim().slice(0, 15) ?? 'Phone Number'}
        style={styles.input}
        leftIcon="Phone"
        rightIcon="AccountBox"
        onRightIconPress={pickContact}
        value={formik.values.phoneNumber}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        onChangeText={formik.handleChange('phoneNumber')}
        onBlur={formik.handleBlur('phoneNumber')}
        errorMessage={formik.errors.phoneNumber}
      />
      <Form.FormInput
        keyboardType="decimal-pad"
        mode="outlined"
        label="Amount"
        style={styles.input}
        leftIcon="Cash"
        value={formik.values.amount}
        onChangeText={formik.handleChange('amount')}
        onBlur={formik.handleBlur('amount')}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        errorMessage={formik.errors.amount}
      />
      <Form.FormButton
        title="Send Money"
        mode="contained"
        iconName="SendMoney"
        onPress={formik.handleSubmit as any}
        loading={loading}
        disabled={loading}
      />
      <Form.FormButton
        title="Cancel"
        mode="outlined"
        onPress={handleCancel}
        disabled={loading}
      />
    </Form.FormContainer>
  );
};
