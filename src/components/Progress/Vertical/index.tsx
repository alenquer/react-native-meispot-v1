import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../constants/colors';

interface IProps extends Omit<ViewProps, 'onLayout'> {
  step: any;
  steps: any;
  color: string;
  icon: any;
  style?: Omit<ViewStyle, 'backgroundColor'>;
  backgroundColor?: string;
}

export const VerticalProgress: React.FC<IProps> = ({
  step,
  steps,
  color,
  style,
  icon,
  backgroundColor = 'rgba(0,0,0,0.1)',
  ...rest
}) => {
  const [stage, setStage] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const reactive = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (step && steps >= step) {
      reactive.setValue(stage - (stage * step) / steps);
    } else {
      reactive.setValue(stage);
    }
  }, [step, steps, stage]);

  function layout(e: LayoutChangeEvent) {
    setStage(e.nativeEvent.layout.height);
  }

  return (
    <View
      style={[styles.container, { ...style, backgroundColor }]}
      onLayout={layout}
      {...rest}>
      <Animated.View
        style={{
          ...styles.progress,
          backgroundColor: color,
          transform: [
            {
              translateY: animatedValue,
            },
          ],
        }}
      />
      <MaterialCommunityIcons
        name={icon}
        color={Colors.shape}
        size={24}
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          padding: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginHorizontal: 5,
    height: '100%',
    width: 40,
    borderRadius: 999,
  },
  progress: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
