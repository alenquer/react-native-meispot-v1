import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/core';
import { ScreenHeight } from '../../../utils/layout';
import { Colors } from '../../../constants/colors';
import WelcomeBrand from '../../../assets/svg/welcome.svg';

const Welcome: React.FC = () => {
  const Navigation = useNavigation();

  function _toLogin() {
    Navigation.navigate('login' as never);
  }

  return (
    <View style={styles.container}>
      <WelcomeBrand width="100%" height={ScreenHeight(20)} />
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Bem vindo ao Mundo dos Negócios,
        </Text>
        <Text style={styles.greetingText}>
          Organize a sua empresa e comece na frente!
        </Text>
      </View>
      <TouchableOpacity onPress={_toLogin} activeOpacity={0.4}>
        <MaterialCommunityIcons
          name="arrow-right-bold-box"
          size={50}
          color={Colors.green}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginVertical: 15,
    alignItems: 'center',
  },
  greetingText: {
    color: 'grey',
    fontSize: 13,
    fontFamily: Fonts.text,
  },
});

export default Welcome;
