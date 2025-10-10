import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  ButtonProps,
  Modal,
  Portal,
  Text,
  TextInput,
  TextInputProps,
  useTheme,
} from 'react-native-paper';
import { Icon, IconProps } from '../Icon';
import { ThemeSpacings } from '../../../config/theme';
import { NumberInput } from '../Input/NumberInput';
import { CheckBox } from '../CheckBox';
import globalStyles from '../../styles/global.styles';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacings.md,
    width: '100%',
  },
  inputContainer: { width: '100%' },
  button: { width: '100%' },
  selectorModalContainer: {
    width: '80%',
    alignSelf: 'center',
    padding: ThemeSpacings.md,
  },
});

interface FormContainerProps {
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
interface FromInputProps extends TextInputProps {
  rightIcon?: IconProps['name'];
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  leftIcon?: IconProps['name'];
  errorMessage?: string;
  secret?: boolean;
}

export const FormInput: React.FC<FromInputProps> = ({
  rightIcon,
  leftIcon,
  onRightIconPress,
  onLeftIconPress,
  errorMessage,
  keyboardType,
  secret = false,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(secret);
  const theme = useTheme();
  const InputComponent =
    keyboardType === 'number-pad' ? NumberInput : TextInput;

  const renderRightIcon = (props: any) => {
    if (rightIcon) {
      return <Icon name={rightIcon} {...props} />;
    }
    if (secret) {
      return (
        <Icon name={secureTextEntry ? 'EyeOff' : 'EyeVisible'} {...props} />
      );
    }
  };

  return (
    <View style={styles.inputContainer}>
      <InputComponent
        keyboardType={keyboardType}
        mode="outlined"
        left={
          leftIcon && (
            <TextInput.Icon
              icon={props => <Icon name={leftIcon} {...props} />}
              onPress={onLeftIconPress}
            />
          )
        }
        right={
          (rightIcon || secret) && (
            <TextInput.Icon
              icon={renderRightIcon}
              onPress={
                onRightIconPress
                  ? onRightIconPress
                  : () => setSecureTextEntry(!secureTextEntry)
              }
            />
          )
        }
        {...props}
        secureTextEntry={secureTextEntry}
      />
      {errorMessage?.trim() && (
        <Text style={{ color: theme.colors.error }}>{errorMessage}</Text>
      )}
    </View>
  );
};

interface SelectorInputProps extends Omit<FromInputProps, 'editable'> {
  options?: { label: string; value: string }[];
}

export const SelectorInput: React.FC<SelectorInputProps> = ({
  options = [],
  value,
  onChangeText,
  placeholder,
  label,
  ...props
}) => {
  const theme = useTheme();
  const [isOptionVisible, setIsOptionsVisible] = useState<boolean>(false);
  const openOptions = () => setIsOptionsVisible(true);
  const closeOptions = () => setIsOptionsVisible(false);

  return (
    <>
      <Portal>
        <Modal
          visible={isOptionVisible}
          onDismiss={closeOptions}
          contentContainerStyle={[
            styles.selectorModalContainer,
            {
              backgroundColor: theme.colors.background,
              borderRadius: theme.roundness * 2,
            },
          ]}
        >
          <View style={[globalStyles.gap]}>
            <Text variant="titleMedium">{label || placeholder}</Text>
            <View style={[globalStyles.gapSm]}>
              {options.map(option => (
                <CheckBox
                  key={option.value}
                  title={option.label}
                  checked={value === option.value}
                  onPress={() => {
                    const newValue = value === option.value ? '' : option.value;
                    onChangeText?.(newValue);
                    if (newValue) setIsOptionsVisible(false);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
      </Portal>
      <TouchableOpacity onPress={openOptions}>
        <FormInput
          editable={false}
          rightIcon="CaretDown"
          onRightIconPress={openOptions}
          value={value}
          placeholder={placeholder}
          label={label}
          {...props}
        />
      </TouchableOpacity>
    </>
  );
};

interface FormButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  iconName?: IconProps['name'];
}
export const FormButton: React.FC<FormButtonProps> = ({
  onPress,
  title,
  style,
  mode = 'contained',
  iconName,
  ...props
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={props =>
        iconName ? <Icon name={iconName} {...props} /> : undefined
      }
      style={[styles.button, style]}
      {...props}
    >
      {title}
    </Button>
  );
};
export default { FormContainer, FormInput, FormButton, SelectorInput };
