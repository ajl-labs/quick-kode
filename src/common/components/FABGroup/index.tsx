import * as React from 'react';
import {
  FAB,
  FABGroupProps as FabProps,
  Portal,
  useTheme,
} from 'react-native-paper';
import { Icon } from '../Icon';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface FABGroupProps {
  options: FabProps['actions'];
  style?: FabProps['style'];
  visible?: boolean;
}

export const FABGroup: React.FC<FABGroupProps> = ({
  options,
  style,
  visible = true,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const onStateChange = ({ open }: { open: boolean }) => setIsOpen(open);

  return (
    <>
      <Portal>
        <FAB.Group
          open={isOpen}
          visible={visible}
          icon={props => (
            <Icon name="Add" {...props} color={theme.colors.onPrimary} />
          )}
          actions={options}
          onStateChange={onStateChange}
          onPress={() => {
            if (isOpen) {
              // do something if the speed dial is open
            }
          }}
          style={[
            {
              bottom: verticalScale(40),
              right: moderateScale(0),
              position: 'absolute',
            },
            style,
          ]}
          fabStyle={{ backgroundColor: theme.colors.primary }}
        />
      </Portal>
    </>
  );
};
