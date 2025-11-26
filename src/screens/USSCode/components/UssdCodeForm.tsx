import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { Icon } from '../../../common/components';
import {
  CustomBottomSheet,
  CustomBottomSheetHandles,
} from '../../../common/components/CustomBottomSheet';
import Form from '../../../common/components/Form';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUssdCode,
  selectAllUSSDCodesObject,
} from '../../../store/features/ussdCode/ussd.code.slice';
import { extractUSSDFormVariable } from '../../../common/helpers';
import { debounce, startCase } from 'lodash';
import { USSDHandlerFormInputTypes } from '../../../common/constants';
import { isPending } from '@reduxjs/toolkit';

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required('USSD Code is required')
    .matches(
      /^\*[^\s#]*#$/,
      'Invalid USSD code format, e.g., *123*{{variable_one}}*{{variable_two}}#',
    ),
  description: Yup.string().required('Description is required'),
  variables: Yup.object().shape({}),
  isEdit: Yup.boolean().optional(),
});

export interface UssdCodeFormHandlers {
  open: (item: IUSSDCodeData) => void;
  close: () => void;
}
interface UssdCodeFormProps {}
export const UssdCodeForm = React.forwardRef<
  UssdCodeFormHandlers,
  UssdCodeFormProps
>((_, ref) => {
  const theme = useTheme();
  const bottomSheetRef = useRef<CustomBottomSheetHandles>(null);
  const dispatch = useDispatch();
  const allUSSDCodes = useSelector(selectAllUSSDCodesObject);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<
    IUSSDCodeData & { isEdit?: boolean }
  >({
    code: '',
    description: '',
    variables: {},
    isEdit: false,
  });

  useImperativeHandle(ref, () => ({
    open: (item: IUSSDCodeData) => {
      setInitialValues({
        code: item.code,
        description: item.description,
        variables: item.variables,
        isEdit: true,
      });
      setVariables(Object.keys(item.variables || {}));
      bottomSheetRef.current?.present();
    },
    close: () => bottomSheetRef.current?.dismiss(),
  }));

  const form = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: {
      code: string;
      description: string;
      variables: IUSSDCodeData['variables'];
      isEdit?: boolean;
    }) => {
      const transformedValue = validationSchema.cast(values);
      if (allUSSDCodes[transformedValue.code] && !values.isEdit) {
        form.setFieldError('code', 'This USSD code already exists.');
        return;
      }
      dispatch(
        setUssdCode({
          code: transformedValue.code,
          description: transformedValue.description,
          variables: transformedValue.variables,
        }),
      );
      bottomSheetRef.current?.dismiss();
    },
  });

  const debouncedExtract = useCallback(
    debounce(value => {
      setVariables(extractUSSDFormVariable(value));
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedExtract(form.values.code);
  }, [form.values.code]);

  useEffect(() => {
    if (!isFormOpen) {
      form.resetForm();
    }
  }, [isFormOpen]);

  return (
    <>
      <CustomBottomSheet ref={bottomSheetRef} onOpenChange={setIsFormOpen}>
        <Form.FormContainer>
          <Form.FormInput
            label="Title"
            onChangeText={form.handleChange('description')}
            onBlur={form.handleBlur('description')}
            value={form.values.description}
            error={!!form.errors.description && form.touched.description}
            errorMessage={form.errors.description}
          />
          <Form.FormInput
            label="USSD Code Base"
            placeholder="182"
            leftIcon="DialPad"
            value={form.values.code}
            onChangeText={form.handleChange('code')}
            onBlur={form.handleBlur('code')}
            error={!!form.errors.code && form.touched.code}
            errorMessage={form.errors.code}
            helperMessage="i.e *123*{{variable_one}}*{{variable_two}}#"
          />
          {variables.map((variable, index) => {
            return (
              <Form.SelectorInput
                key={variable + index}
                options={Object.keys(USSDHandlerFormInputTypes).map(key => ({
                  label: startCase(
                    USSDHandlerFormInputTypes[
                      key as keyof typeof USSDHandlerFormInputTypes
                    ],
                  ),
                  value:
                    USSDHandlerFormInputTypes[
                      key as keyof typeof USSDHandlerFormInputTypes
                    ],
                }))}
                label={`${startCase(variable)} Input Type`}
                placeholder="Select Variable Type"
                value={(form.values.variables as any)?.[variable]?.type}
                onChangeText={value =>
                  form.setFieldValue(`variables.${variable}.type`, value)
                }
              />
            );
          })}
          <Form.FormButton title="Submit" onPress={() => form.handleSubmit()} />
        </Form.FormContainer>
      </CustomBottomSheet>
      <AnimatedFAB
        icon={props => (
          <Icon name="Add" {...props} color={theme.colors.onPrimary} />
        )}
        label={'Label'}
        extended={false}
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
        visible={true}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, { backgroundColor: theme.colors.primary }]}
      />
    </>
  );
});

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    margin: moderateScale(16),
    right: 0,
    bottom: 0,
  },
});
