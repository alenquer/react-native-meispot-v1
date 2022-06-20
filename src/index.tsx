import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './contexts/auth';
import { LoadingProvider } from './contexts/loading';

import Routes from './routes';

import 'moment/min/locales';

export const App: React.FC = () => {
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoadingProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </LoadingProvider>
    </GestureHandlerRootView>
  );
};
