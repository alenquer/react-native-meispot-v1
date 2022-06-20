import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import loadAnimation from '../../assets/lottie/loading.json';

export default function Loading({ ...rest }) {
  return (
    <View style={styles.container}>
      <LottieView
        source={loadAnimation}
        style={{ backgroundColor: 'transparent', width: 200, height: 200 }}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
