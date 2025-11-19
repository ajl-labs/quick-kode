import { Alert, PermissionsAndroid, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import Form from './index';
import { useMemo, useRef, useState } from 'react';
import { startCase } from 'lodash';
import { formatCallableUSSDQuickCode, removeCountryCode } from '../../helpers';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { amountSchema } from '../../helpers/currency.helpers';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { ContactPicker } from '../../native-modules';

interface USSDHandlerFormProps {
  config?: IUSSDCodeData;
  onSubmit: (formattedCode: string) => void;
  onClose?: () => void;
}

export const USSDHandlerForm: React.FC<USSDHandlerFormProps> = ({
  config: { code, variables = {}, description, icon } = {},
  onSubmit,
  onClose,
}) => {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const formikRef = useRef<FormikProps<any>>(null);
  // 1. Set Formik initialValues
  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    Object.keys(variables).forEach(key => (values[key] = ''));
    return values;
  }, [variables]);
  // 2. Build dynamic validation schema
  const validationSchema = useMemo(() => {
    const shape: Record<string, any> = {};

    Object.keys(variables).forEach(key => {
      if (variables[key].type === 'currency') {
        shape[key] = amountSchema.amount;
      } else {
        shape[key] = Yup.string()
          .trim()
          .required(`${startCase(key)} is required`);
      }
    });

    return Yup.object().shape(shape);
  }, [variables]);

  const pickContact = async (variableName: string) => {
    const phoneResults = await ContactPicker.pickContact();
    if (phoneResults.name) {
      setLabels(prev => ({ ...prev, [variableName]: phoneResults.name }));
    }
    if (phoneResults.phoneNumber) {
      formikRef.current?.setFieldValue(variableName, phoneResults.phoneNumber);
    }
  };

  return !code ? (
    <View>
      <Text>No short USSD code provided</Text>
    </View>
  ) : (
    <Formik
      initialValues={initialValues}
      innerRef={formikRef}
      onSubmit={values => {
        const transformedValue = validationSchema.cast(values);
        const formattedCode = formatCallableUSSDQuickCode(
          code,
          transformedValue,
        );
        onSubmit(formattedCode);
      }}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        handleSubmit,
        touched,
      }) => (
        <Form.FormContainer>
          {Object.keys(variables).map((variableKey, index) => {
            let { type, label = startCase(variableKey) } =
              variables[variableKey];
            // Override label if custom label from the state exists
            if (labels[variableKey]) {
              label = labels[variableKey];
            }
            const extraProps: Partial<
              React.ComponentProps<typeof Form.FormInput>
            > = {};

            if (type === 'currency') {
              extraProps.keyboardType = 'decimal-pad';
              extraProps.isNumberInput = true;
              extraProps.leftIcon = 'Cash';
            } else if (type === 'phone') {
              extraProps.keyboardType = 'phone-pad';
              extraProps.leftIcon = 'Phone';
              extraProps.rightIcon = 'AccountBox';
              extraProps.onRightIconPress = () => {
                pickContact(variableKey);
              };
            }
            return (
              <Form.FormInput
                key={index}
                label={label}
                value={values[variableKey]}
                onChangeText={handleChange(variableKey)}
                onBlur={handleBlur(variableKey)}
                error={Boolean(errors[variableKey] && touched[variableKey])}
                errorMessage={errors[variableKey] as string}
                mode="outlined"
                style={{ width: '100%' }}
                {...extraProps}
              />
            );
          })}
          <Form.FormButton
            title={description ?? 'Send'}
            iconName={(icon as IconProps['name']) ?? undefined}
            mode="contained"
            onPress={() => handleSubmit()}
          />
          <Form.FormButton title="Cancel" mode="outlined" onPress={onClose} />
        </Form.FormContainer>
      )}
    </Formik>
  );
};
