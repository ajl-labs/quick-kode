import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { Icon } from '../../../common/components';
import React from 'react';
import { ThemeSpacings } from '../../../config/theme';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { MOMO_USSD_CODES } from '../../../common/helpers/ussd.momo.helper';
import { NumberInput } from '../../../common/components/Input/NumberInput';
import { amountSchema } from '../../../common/helpers/currency.helpers';
import { moderateScale } from 'react-native-size-matters';

const validationSchema = Yup.object().shape({
  paymentCode: Yup.string().required('Required'),
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

interface PayGoodsFormProps {
  onCancel?: () => void;
  loading?: boolean;
  onConfirm?: (data: {
    amount: string;
    receiver: string;
    ussCodeKey: keyof typeof MOMO_USSD_CODES;
  }) => void;
}
export const PayGoodsForm: React.FC<PayGoodsFormProps> = ({
  onCancel,
  onConfirm,
  loading,
}) => {
  const theme = useTheme();

  const [contactName, setContactName] = React.useState('');
  const formik = useFormik({
    initialValues: { amount: '', paymentCode: '' },
    validationSchema,
    onSubmit: values => {
      const transformedValue = validationSchema.cast(values);
      onConfirm?.({
        amount: transformedValue.amount.toString(),
        receiver: transformedValue.paymentCode,
        ussCodeKey: 'PAY_GOOD_SERVICE',
      });
    },
  });

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
            keyboardType="number-pad"
            mode="outlined"
            label={contactName.trim().slice(0, 15) ?? 'Payment Code'}
            style={styles.input}
            left={
              <TextInput.Icon
                icon={props => <Icon name="Numbers" {...props} />}
              />
            }
            value={formik.values.paymentCode}
            error={
              formik.touched.paymentCode && Boolean(formik.errors.paymentCode)
            }
            onChangeText={formik.handleChange('paymentCode')}
            onBlur={formik.handleBlur('paymentCode')}
          />
          {formik.touched.paymentCode && formik.errors.paymentCode ? (
            <Text style={{ color: theme.colors.error }}>
              {formik.errors.paymentCode}
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
          Pay Goods/Service
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
