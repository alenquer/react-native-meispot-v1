import React, { createContext, useState } from 'react';
import { BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { sleep } from '../utils';
import Loading from '../components/Loading';

interface ManagerContextData {
  setAnimation: (val: string) => Promise<void>;
  animation: string;
}

export const LoadingContext = createContext<ManagerContextData>(
  {} as ManagerContextData,
);

export const LoadingProvider: React.FC = ({ children }) => {
  const [animation, setAnimationType] = useState('');

  async function setAnimation(val: string) {
    Keyboard.dismiss();
    const _back = BackHandler.addEventListener('hardwareBackPress', () => true);

    if (val === '') await sleep(1000);

    setAnimationType(val);
    _back.remove();
  }

  function handleAnimation() {
    switch (animation) {
      case 'download':
        return <Loading />;
      default:
        return <Loading />;
    }
  }

  return (
    <LoadingContext.Provider
      value={{
        setAnimation,
        animation,
      }}>
      {children}
      {animation !== '' && (
        <View style={styles.container}>{handleAnimation()}</View>
      )}
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
  },
});
