import React, { useEffect, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Fonts } from '../../../constants/fonts';
import { ScreenHeight } from '../../../utils/layout';
import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper';
import { Colors } from '../../../constants/colors';
import { CustomButton } from '../../../components/CustomButton';
import { Constants } from '../../../constants';
import { validateEmail } from '../../../utils';
import { BackButton } from '../../../components/BackButton';

import RegisterBrand from '../../../assets/svg/register.svg';
import useAuth from '../../../hooks/useAuth';

const Register: React.FC = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  function checkUser() {
    if (username) {
      return username.length >= Constants.MIN_USERNAME_LENGTH;
    }
  }

  function checkEmail() {
    if (email) {
      return validateEmail(email) !== null;
    }
  }

  function checkPassword() {
    if (password) {
      return password.length >= Constants.MIN_PASSWORD_LENGTH;
    }
  }

  async function _confirm() {
    switch (true) {
      case !checkUser():
        return Alert.alert('', 'Por favor, verifique o nome de usuário.');
      case !checkPassword():
        return Alert.alert(
          '',
          `Senha com menos de ${Constants.MIN_PASSWORD_LENGTH} dígitos!`,
        );
      case !checkEmail():
        return Alert.alert('', 'Por favor, verifique o email.');
      case password !== confirmPassword:
        return Alert.alert('', 'A senha não foi repetida corretamente.');
      default:
        return await signUp({ email, password, username });
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingWrapper contentContainerStyle={{ paddingBottom: 15 }}>
        <View style={{ ...styles.header }}>
          <BackButton />
        </View>
        <Animated.View style={{ opacity: opacity, paddingHorizontal: 15 }}>
          <Text style={styles.greetingPrimary}>Criar uma conta,</Text>
          <Text style={styles.greetingSecondary}>
            Registre-se para começar!
          </Text>
          <RegisterBrand
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
              borderColor: checkUser() === false ? Colors.red : '#ccc',
            }}
            placeholder="Nome de usuário"
            value={username}
            onChangeText={setUsername}
          />
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
            secureTextEntry={true}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            selectionColor={Colors.green}
            style={{
              ...styles.input,
              borderColor: confirmPassword !== password ? Colors.red : '#ccc',
            }}
            placeholder="Repita a sua senha"
            autoCapitalize="none"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <CustomButton
            onPress={_confirm}
            icon="arrow-right-bold-box"
            size={40}
            style={{
              marginVertical: 5,
            }}
          />
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

export default Register;
