import React from 'react';
import { View, Animated } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { ScreenWidth } from '../../../../utils/layout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const LeftActions = (
  progress: any,
  dragX: Animated.AnimatedInterpolation,
) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.red }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          width: ScreenWidth(15),
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          transform: [
            {
              translateX: dragX.interpolate({
                inputRange: [0, ScreenWidth(100)],
                outputRange: [
                  -ScreenWidth(15),
                  ScreenWidth(100) - ScreenWidth(15),
                ],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          color="white"
          size={24}
        />
      </Animated.View>
    </View>
  );
};
