import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SwipeableProps } from 'react-native-gesture-handler';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface RightActionProps {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  rightAction?: React.ReactNode;
}

const RightAction: React.FC<RightActionProps> = ({
  progress,
  drag,
  rightAction,
}) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });
  if (!rightAction) return null;
  return (
    <Reanimated.View style={[styles.rightAction, styleAnimation]}>
      {rightAction}
    </Reanimated.View>
  );
};

interface ISwipeableProps extends Partial<SwipeableProps> {
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Swipeable: React.FC<ISwipeableProps> = ({
  children,
  rightAction,
  style,
}) => {
  return (
    <ReanimatedSwipeable
      containerStyle={[styles.swipeable, style]}
      friction={3}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(progress, transition) => (
        <RightAction
          progress={progress}
          drag={transition}
          rightAction={rightAction}
        />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignSelf: 'center',
  },

  swipeable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
