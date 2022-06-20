import React from 'react';
import LottieView from 'lottie-react-native';
import loadAnimation from '../../assets/lottie/download.json';
import { LinearGradient } from 'react-native-linear-gradient';
import { Constants } from '../../constants';
import { Colors } from '../../constants/colors';

export function Download() {
  return (
    <LinearGradient
      colors={[Colors.green_bright, Colors.green]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={loadAnimation}
        style={{
          backgroundColor: 'transparent',
          width: Constants.GROUP_ICON_SIZE,
          height: Constants.GROUP_ICON_SIZE,
        }}
        autoPlay
        loop
      />
    </LinearGradient>
  );
}
