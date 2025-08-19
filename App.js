import React, { useEffect, useRef } from "react";
import { Platform, Alert, LogBox, AppState } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Constants from "expo-constants";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { configurePushNotifications } from './utils/notifications';

// Configuración completa de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configurar el canal de notificaciones para Android (canal "default")
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

  // Función para registrar el token push
  const registerForPushNotifications = async () => {
    try {
      // Verificar si estamos en un dispositivo físico
      if (!Device.isDevice) {
        console.warn('Debes usar un dispositivo físico para recibir notificaciones push');
        return;
      }

      // Verificar permisos
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

      // Obtener el token push
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;

      console.log('Expo Push Token:', token);

      // Aquí deberías enviar este token a tu backend para guardarlo
      // Ejemplo: await api.post('/notifications/save-token', { token });

    } catch (error) {
      console.error('Error al registrar notificaciones push:', error);
      Alert.alert('Error', 'No se pudo configurar las notificaciones push');
    }
  };

  // Manejar cambios en el estado de la app
  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // La app acaba de entrar en primer plano
      // Actualizar el badge count
      try {
        const currentCount = await Notifications.getBadgeCountAsync();
        console.log('Current badge count:', currentCount);
        
        // Aquí podrías sincronizar con tu backend
        // Ejemplo: await fetchNotifications();
        
      } catch (error) {
        console.error('Error al actualizar badge count:', error);
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    // Configurar el canal de notificaciones
    setupNotificationChannel();
      if (Platform.OS === 'web') {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
  }
  // Antes de renderizar tu app
configurePushNotifications();

    // Registrar el token push
    registerForPushNotifications();

    // Configurar listeners de notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida en primer plano:', notification);
      
      // Aquí puedes actualizar el estado de tu app
      // Ejemplo: incrementar el contador de notificaciones no leídas
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Usuario interactuó con notificación:', data);
      
      // Navegar a pantallas específicas basadas en los datos de la notificación
      // Ejemplo:
      // if (data.screen === 'DetalleCita') {
      //   navigation.navigate('DetalleCita', { id: data.citaId });
      // }
    });

    // Escuchar cambios en el estado de la app
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Limpiar listeners
     if (notificationListener.current) {
  notificationListener.current.remove();
}
if (responseListener.current) {
  responseListener.current.remove();
}
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
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