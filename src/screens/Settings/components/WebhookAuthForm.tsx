import React from 'react';
import Form from '../../../common/components/Form';
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const webhookAuthSchema = Yup.object().shape({
  username: Yup.string().required('Webhook username is required'),
  password: Yup.string(),
});

interface IWebhookFormProps {
  onSubmit: (
    data: Pick<IWebhookData, 'username' | 'password'>,
    formikHelpers: FormikHelpers<any>,
  ) => void;
  initialValues?: { username?: string; password?: string };
}
export const WebhookAuthForm: React.FC<IWebhookFormProps> = ({
  onSubmit,
  initialValues = { username: '', password: '' },
}) => {
  const { handleChange, values, errors, isSubmitting, isValid, handleSubmit } =
    useFormik({
      validationSchema: webhookAuthSchema,
      initialValues: initialValues,
      onSubmit: (values, options) => {
        const transformedValue = webhookAuthSchema.cast(values);
        onSubmit(transformedValue, options);
      },
    });
  return (
    <>
      <Text style={{ marginVertical: moderateScale(10) }}>
        Webhook authorization, now we are supporting basic auth.
      </Text>
      <Form.FormContainer>
        <Form.FormInput
          label="Username"
          placeholder="Enter your username"
          onChangeText={handleChange('username')}
          errorMessage={errors.username}
          value={values.username}
        />

        <Form.FormInput
          label="Password"
          placeholder="Enter your password"
          leftIcon="Lock"
          onChangeText={handleChange('password')}
          errorMessage={errors.password}
          value={values.password}
          secret
          returnKeyType="done"
          returnKeyLabel="Submit"
        />
        <Form.FormButton
          title="Save Webhook"
          disabled={!isValid}
          loading={isSubmitting}
          onPress={() => handleSubmit()}
        />
      </Form.FormContainer>
    </>
  );
};
