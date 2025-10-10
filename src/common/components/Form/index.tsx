import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View,
} from 'react-native';
import {
  Button,
  ButtonProps,
  Text,
  TextInput,
  TextInputProps,
  useTheme,
} from 'react-native-paper';
import { Icon, IconProps } from '../Icon';
import { ThemeSpacings } from '../../../config/theme';
import { NumberInput } from '../Input/NumberInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacings.md,
    width: '100%',
  },
  inputContainer: { width: '100%' },
  button: { width: '100%' },
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
export default { FormContainer, FormInput, FormButton };
