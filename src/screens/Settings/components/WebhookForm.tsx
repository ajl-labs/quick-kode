import React from 'react';
import Form from '../../../common/components/Form';
import * as Yup from 'yup';
import webhookActions, {
  WEBHOOK_ACTIONS_KEY,
} from '../../../common/constants/webhook.actions';
import { FormikHelpers, useFormik } from 'formik';

const webhookSchema = Yup.object().shape({
  url: Yup.string().required('Webhook URL is required'),
  action: Yup.string()
    .oneOf(Object.values(WEBHOOK_ACTIONS_KEY))
    .required('Webhook action is required'),
});

interface IWebhookFormProps {
  onSubmit: (
    data: Pick<IWebhookData, 'url' | 'action'>,
    formikHelpers: FormikHelpers<any>,
  ) => void;
  initialValues?: Pick<IWebhookData, 'url' | 'action'>;
}

export const WebhookForm: React.FC<IWebhookFormProps> = ({
  onSubmit,
  initialValues = { url: '', action: '' },
}) => {
  const { handleChange, handleSubmit, values, errors, isValid, isSubmitting } =
    useFormik({
      initialValues: initialValues,
      validationSchema: webhookSchema,
      onSubmit: (values, options) => {
        const transformedValue = webhookSchema.cast(values);
        onSubmit(transformedValue, options);
      },
    });
  return (
    <Form.FormContainer>
      <Form.SelectorInput
        label="Action Type"
        placeholder="Action Type"
        leftIcon="Sync"
        onChangeText={handleChange('action')}
        options={Array.from(webhookActions.values())}
        value={values.action}
      />
      <Form.FormInput
        label="Webhook URL"
        placeholder="https://example.com"
        leftIcon="Link"
        onChangeText={handleChange('url')}
        errorMessage={errors.url}
        value={values.url}
      />
      <Form.FormButton
        title="Save Webhook"
        disabled={!isValid}
        loading={isSubmitting}
        onPress={() => handleSubmit()}
      />
    </Form.FormContainer>
  );
};
