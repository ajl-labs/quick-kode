import { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chip,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { Icon } from '../../../common/components';
import globalStyles from '../../../common/styles/global.styles';
import { ThemeSpacings } from '../../../config/theme';
import {
  addTransactionLabel,
  removeTransactionLabel,
  selectTransactionLabels,
} from '../../../store/features/settings/settings.slice';
import { moderateScale } from 'react-native-size-matters';
import { startCase } from 'lodash';
import { CustomChip } from '../../../common/components/CustomChip';

export const EditTransactionLabel = () => {
  const theme = useTheme();
  const transactionLabels = useSelector(selectTransactionLabels);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    dispatch(addTransactionLabel({ name: text }));
    setText('');
  };

  const handleChipClose = (text: string) => {
    dispatch(removeTransactionLabel({ name: text }));
  };
  return (
    <View
      style={[
        globalStyles.flex,
        globalStyles.column,
        globalStyles.fullWidth,
        { gap: ThemeSpacings.md },
      ]}
    >
      <Text variant="titleMedium">Customize Transaction Labels</Text>
      <TextInput
        mode="outlined"
        left={
          <TextInput.Icon icon={props => <Icon name="Styles" {...props} />} />
        }
        right={
          text?.trim() && (
            <TextInput.Icon
              icon={props => <Icon name="Check" {...props} />}
              onPress={handleSubmit}
            />
          )
        }
        value={text}
        onChangeText={setText}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        style={globalStyles.fullWidth}
      />
      <View
        style={[globalStyles.row, { gap: ThemeSpacings.md, flexWrap: 'wrap' }]}
      >
        {Object.values(transactionLabels).map(label => {
          return (
            <CustomChip
              key={label.name}
              label={startCase(label.name)}
              onPress={() => handleChipClose(label.name)}
              closable
            />
          );
        })}
      </View>
    </View>
  );
};
