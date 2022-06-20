import React, { createContext, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Alert } from 'react-native';

import * as Keychain from 'react-native-keychain';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormatCurrencyFunction } from '../utils/currency';
import { api } from '../services/api';

import useAnimation from '../hooks/useAnimation';

interface AuthContextData {
  error: string | undefined;
  user: IAuthUser;
  settings: ISettings;
  setUser: (val: IAuthUser) => void;
  setSettings: (val: ISettings) => void;
  formatCurrency: (amount: any) => [string, number, string, number];
  signIn(user: IAuthContent): Promise<IAuthResponse>;
  signUp(user: IAuthContent): Promise<IAuthResponse>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

const initialSettings = {
  currency: 'BRL',
  language: 'pt-br',
};

const initialUser = {
  email: '',
  username: '',
  groups: [{ id: undefined, name: 'default' }],
  id: undefined,
};

export const AuthProvider: React.FC = ({ children }) => {
  const { setAnimation } = useAnimation();
  const [user, setUser] = useState<IAuthUser>(initialUser);
  const [error, setError] = useState<string | undefined>();
  const [settings, setSettings] = useState(initialSettings);

  function formatCurrency(amount: any) {
    return FormatCurrencyFunction({ amount, code: settings.currency });
  }

  async function signIn(auth: IAuthContent): Promise<IAuthResponse | any> {
    try {
      setAnimation('loading');

      const settings = await AsyncStorage.getItem('@settings');
      const response: AxiosResponse<IAuthResponse> = await api.post(
        '/auth/login',
        {
          email: auth.email.trim(),
          password: auth.password,
        },
      );

      if (settings) {
        setSettings(JSON.parse(settings));
      }

      if (response.status === 200) {
        api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

        await Keychain.setGenericPassword(auth.email, auth.password);

        setUser(response.data.user);
      }
    } catch (e) {
      Alert.alert('', 'Algo deu errado, tente novamente!');
    } finally {
      setAnimation('');
    }
  }

  async function signUp(auth: IAuthContent): Promise<IAuthResponse | any> {
    try {
      setAnimation('loading');

      const settings = await AsyncStorage.getItem('@settings');
      const response: AxiosResponse<IAuthResponse> = await api.post(
        '/auth/register',
        {
          email: auth.email.trim(),
          username: auth.username,
          password: auth.password,
        },
      );

      if (settings) {
        setSettings(JSON.parse(settings));
      }

      if (response.status === 200) {
        api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

        await Keychain.setGenericPassword(auth.email, auth.password);

        setUser(response.data.user);
      }
    } catch (e) {
      console.log(e);
      Alert.alert('', 'Algo deu errado, tente novamente!');
    } finally {
      setAnimation('');
    }
  }

  async function signOut() {
    try {
      setAnimation('loading');
      await Keychain.resetGenericPassword();
      await AsyncStorage.multiRemove(['@user']);
    } catch (e) {
      console.log(e);
      Alert.alert('', 'Algo deu errado, tente novamente!');
    } finally {
      PushNotification.cancelAllLocalNotifications();
      api.defaults.headers.common.Authorization = '';
      setUser(initialUser);
      setAnimation('');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        settings,
        setSettings,
        formatCurrency,
        error,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
