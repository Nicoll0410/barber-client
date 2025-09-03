if (Platform.OS === 'web') {
  require('./webPolyfills');
}

import React, { useEffect, useRef } from "react";
import { Platform, Alert, LogBox, AppState, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Constants from "expo-constants";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { configurePushNotifications, playNotificationSound } from './utils/notifications';
import io from 'socket.io-client';

// Configuración completa de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configurar el canal de notificaciones para Android
async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificaciones de Barbería',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      showBadge: true,
      enableLights: true,
      enableVibrate: true,
    });
  }
}

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  "AsyncStorage has been extracted",
  "Setting a timer",
  "Remote debugger",
  "Require cycle:"
]);

function MainApp() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);
  const navigationRef = useRef();
  const socketRef = useRef(null);
  const { user, token } = useAuth();

  // Función para manejar deep links
  const handleDeepLink = (event) => {
    try {
      let url = event.url;
      console.log('Deep link recibido:', url);
      
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const params = Object.fromEntries(urlObj.searchParams.entries());
      
      if (path.includes('/verify-email')) {
        if (navigationRef.current) {
          navigationRef.current.navigate('VerifyEmail', {
            email: params.email,
            code: params.code,
            autoVerify: params.autoVerify === 'true',
            success: params.success === 'true',
            verified: params.verified === 'true'
          });
        }
      }
    } catch (error) {
      console.error('Error procesando deep link:', error);
    }
  };

  // Configurar Socket.io
  const setupSocket = async () => {
    try {
      if (!user || !token) return;

      // Cerrar socket existente si hay uno
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Crear nueva conexión socket
      socketRef.current = io('https://barber-server-6kuo.onrender.com', {
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        }
      });

      // Eventos del socket
      socketRef.current.on('connect', () => {
        console.log('✅ Conectado al servidor Socket.io');
        // Unirse a la sala del usuario
        socketRef.current.emit('unir_usuario', user.userId || user.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Desconectado del servidor Socket.io');
      });

      socketRef.current.on('nueva_notificacion', async (data) => {
        console.log('📩 Notificación recibida:', data);
        
        // Reproducir sonido
        await playNotificationSound();
        
        // Mostrar alerta
        Alert.alert(
          data.titulo, 
          data.cuerpo, 
          [
            {
              text: 'Ver',
              onPress: () => {
                if (data.cita && data.cita.id) {
                  navigationRef.current?.navigate('DetalleCita', { id: data.cita.id });
                } else {
                  navigationRef.current?.navigate('Notificaciones');
                }
              }
            },
            { 
              text: 'OK', 
              onPress: () => {} 
            }
          ]
        );
      });

    } catch (error) {
      console.error('Error configurando socket:', error);
    }
  };

  // Registrar el token push
  const registerForPushNotifications = async () => {
    try {
      if (!Device.isDevice) {
        console.warn('Debes usar un dispositivo físico para recibir notificaciones push');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Las notificaciones no funcionarán sin los permisos necesarios'
        );
        return;
      }

      const pushToken = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;

      console.log('Expo Push Token:', pushToken);

    } catch (error) {
      console.error('Error al registrar notificaciones push:', error);
    }
  };

  // Manejar cambios en el estado de la app
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // Reconectar socket cuando la app vuelve al frente
      if (user && token) {
        await setupSocket();
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    // Configurar notificaciones
    setupNotificationChannel();
    configurePushNotifications();
    registerForPushNotifications();

    // Configurar listeners de notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida en primer plano:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario interactuó con notificación:', response);
    });

    // Configurar listener para deep links
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Manejar el deep link inicial
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    }).catch(err => console.error('Error obteniendo URL inicial:', err));

    // Escuchar cambios en el estado de la app
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Limpiar listeners
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
      linkingSubscription.remove();
      appStateSubscription.remove();
      
      // Desconectar socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Efecto para configurar socket cuando el usuario cambia
  useEffect(() => {
    if (user && token) {
      setupSocket();
    }
  }, [user, token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: [
          'mybarberapp://',
          'https://mybarberapp.com',
          'https://*.mybarberapp.com'
        ],
        config: {
          screens: {
            VerifyEmail: 'verify-email',
          },
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}