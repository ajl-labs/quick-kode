import { Alert, PermissionsAndroid, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import Form from '.';
import { useMemo, useRef, useState } from 'react';
import { startCase } from 'lodash';
import { selectContactPhone } from 'react-native-select-contact';
import { formatCallableUSSDQuickCode, removeCountryCode } from '../../helpers';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { amountSchema } from '../../helpers/currency.helpers';

interface USSDHandlerFormProps {
  config?: IUSSDCodeData;
  onSubmit: (formattedCode: string) => void;
}

export const USSDHandlerForm: React.FC<USSDHandlerFormProps> = ({
  config: { code, variables = {} } = {},
  onSubmit,
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

  const pickContact = async (variableName: string) => {
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
      setLabels(prev => ({ ...prev, [variableName]: contactName }));
    }
    if (phoneNumber) {
      formikRef.current?.setFieldValue(variableName, phoneNumber);
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
      {({ handleChange, handleBlur, values, errors, handleSubmit }) => (
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
                error={Boolean(errors[variableKey] && values[variableKey])}
                errorMessage={errors[variableKey] as string}
                mode="outlined"
                style={{ width: '100%' }}
                {...extraProps}
              />
            );
          })}
          <Form.FormButton
            title="Submit"
            mode="contained"
            onPress={() => handleSubmit()}
          />
        </Form.FormContainer>
      )}
    </Formik>
  );
};
