import { StyleSheet } from 'react-native';
import React from 'react';
import { ThemeSpacings } from '../../../config/theme';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { MOMO_USSD_CODES } from '../../../common/helpers/ussd.momo.helper';
import { amountSchema } from '../../../common/helpers/currency.helpers';
import { moderateScale } from 'react-native-size-matters';
import Form from '../../../common/components/Form';
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
    <Form.FormContainer>
      <Form.FormInput
        keyboardType="numeric"
        mode="outlined"
        label={contactName.trim().slice(0, 15) ?? 'Payment Code'}
        style={styles.input}
        leftIcon="Numbers"
        value={formik.values.paymentCode}
        error={formik.touched.paymentCode && Boolean(formik.errors.paymentCode)}
        onChangeText={formik.handleChange('paymentCode')}
        onBlur={formik.handleBlur('paymentCode')}
        errorMessage={formik.errors.paymentCode}
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
        isNumberInput
      />
      <Form.FormButton
        title="Pay Goods/Service"
        mode="contained"
        iconName="CreditCard"
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
