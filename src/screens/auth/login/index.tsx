import React, { useEffect, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/core';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Fonts } from '../../../constants/fonts';
import { ScreenHeight } from '../../../utils/layout';
import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper';
import { Colors } from '../../../constants/colors';
import { Constants } from '../../../constants';
import { validateEmail } from '../../../utils';
import { BackButton } from '../../../components/BackButton';

import LoginBrand from '../../../assets/svg/login.svg';
import useAuth from '../../../hooks/useAuth';

const Login: React.FC = () => {
  const { navigate } = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [opacity] = useState(new Animated.Value(0));
  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 95 }));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function checkPassword() {
    if (password) {
      return password.length >= Constants.MIN_PASSWORD_LENGTH;
    }
  }

  function checkEmail() {
    if (email) {
      return validateEmail(email) !== null;
    }
  }

  async function _login() {
    if (!checkEmail() || !checkPassword()) {
      return Alert.alert(
        '',
        'Por favor, verifique se os campos foram preenchidos corretamente.',
      );
    }

    return await signIn({ email, password });
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingWrapper contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={{ ...styles.header }}>
          <BackButton />
          <TouchableOpacity
            hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}
            onPress={() => {
              return Alert.alert('', 'Disponível na próxima atualização.');
              //navigate('forgot' as never);
            }}
            style={styles.forgotButton}>
            <Text style={styles.forgotTextButton}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={{ opacity: opacity, paddingHorizontal: 15 }}>
          <Text style={styles.greetingPrimary}>Bem vindo,</Text>
          <Text style={styles.greetingSecondary}>Entre para continuar!</Text>
          <LoginBrand
            width="100%"
            height={ScreenHeight(20)}
            style={{ marginVertical: 25 }}
          />
        </Animated.View>
        <Animated.View
          style={{
            alignItems: 'center',
            transform: [
              {
                translateY: offset.y,
              },
            ],
          }}>
          <TextInput
            selectionColor={Colors.green}
            style={{
              ...styles.input,
              borderColor: checkEmail() === false ? Colors.red : '#ccc',
            }}
            placeholder="Digite o seu Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            selectionColor={Colors.green}
            style={{
              ...styles.input,
              borderColor: checkPassword() === false ? Colors.red : '#ccc',
            }}
            placeholder="Digite a sua senha"
            autoCapitalize="none"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigate('register' as never)}
              style={styles.registerButton}>
              <Text style={styles.textButton}>Criar uma conta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={_login} style={styles.loginButton}>
              <MaterialCommunityIcons
                name="arrow-right-bold"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Constants.STATUS_BAR_HEIGHT,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomColor: '#eee',
  },
  greetingPrimary: {
    fontFamily: Fonts.heading,
    fontSize: ScreenHeight(4.5),
    color: 'black',
  },
  greetingSecondary: {
    fontFamily: Fonts.text,
    fontSize: ScreenHeight(2.8),
    color: 'black',
  },
  input: {
    width: 300,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 11,
    padding: 10,
    borderColor: '#ccc',
  },
  registerButton: {
    backgroundColor: 'orange',
    borderRadius: 5,
    flexShrink: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontFamily: Fonts.heading,
    fontSize: 11.5,
    color: 'white',
    textAlign: 'center',
  },
  forgotTextButton: {
    fontFamily: Fonts.heading,
    fontSize: 9,
    color: Colors.green,
  },
  forgotButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: Colors.green,
  },
  loginButton: {
    borderRadius: 5,
    backgroundColor: Colors.green,
    marginLeft: 10,
    height: '100%',
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 30,
    marginVertical: 5,
  },
});

export default Login;
