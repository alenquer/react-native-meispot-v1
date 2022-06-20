import React, { useEffect, useState } from 'react';

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AxiosResponse } from 'axios';

import { api } from '../services/api';

import useAuth from '../hooks/useAuth';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import Loading from '../components/Loading';
import { API_URL } from '@env';

export default function Routes() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const { user, setUser, setSettings, signOut } = useAuth();

  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const data = await AsyncStorage.getItem('@user');
      const settings = await AsyncStorage.getItem('@settings');

      function setCachedData() {
        if (data && !isLoadingComplete) {
          setUser(JSON.parse(data));
        }
      }

      if (settings && !isLoadingComplete) {
        setSettings(JSON.parse(settings));
      }

      if (credentials) {
        try {
          const response: AxiosResponse<IAuthResponse> = await api.post(
            '/auth/login',
            {
              email: credentials.username.trim(),
              password: credentials.password,
            },
          );

          if (response.status === 403) {
            return await signOut();
          }

          api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
          setUser(response.data.user);
        } catch (e) {
          setCachedData();
        }
      }

      if (!isLoadingComplete) {
        console.log(API_URL);
        setLoadingComplete(true);
        await RNBootSplash.hide();
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      {!isLoadingComplete ? (
        <Loading />
      ) : user.id ? (
        <AppRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
