import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../screens/auth/welcome';
import Login from '../screens/auth/login';
import Register from '../screens/auth/register';

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthRoutes() {
  return (
    <Navigator
      initialRouteName="welcome"
      screenOptions={{ headerShown: false }}>
      <Screen name="welcome" component={Welcome} />
      <Screen name="login" component={Login} />
      <Screen name="register" component={Register} />
    </Navigator>
  );
}
