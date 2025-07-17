import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';

// Configuración de deep linking
const config = {
  screens: {
    VerifyEmail: {
      path: 'verify-email',
      parse: {
        email: (email) => `${email}`,
        code: (code) => `${code}`,
      },
    },
  },
};

const linking = {
  prefixes: ['http://localhost:8080'], // Reemplaza con tu URL real
  config,
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}