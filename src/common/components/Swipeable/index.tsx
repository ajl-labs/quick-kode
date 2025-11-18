import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  Gesture,
  GestureDetector,
  SwipeableProps,
} from 'react-native-gesture-handler';
import type { Swipeable as GHSwipeable } from 'react-native-gesture-handler';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface RightActionProps {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  rightAction?: React.ReactNode;
}

interface CustomSwipeableHandles {
  close: () => void;
}

export type { Swipeable as GHSwipeable } from 'react-native-gesture-handler';
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

export const Swipeable = forwardRef<CustomSwipeableHandles, ISwipeableProps>(
  ({ children, rightAction, style }, ref) => {
    const internalRef = useRef<GHSwipeable>(null);
    const panGesture = Gesture.Pan();
    useImperativeHandle(ref, () => ({
      close: () => internalRef.current?.close(),
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <ReanimatedSwipeable
          simultaneousWithExternalGesture={panGesture}
          ref={internalRef}
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
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  rightAction: {
    alignSelf: 'center',
  },

  swipeable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
