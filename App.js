import React, { useEffect, useRef } from "react";
import { Platform, Alert, LogBox } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core",
  "Setting a timer for a long period of time",
]);

// Configuración de deep linking
const config = {
  screens: {
    VerifyEmail: {
      path: "verify-email",
      parse: {
        email: (email) => `${email}`,
        code: (code) => `${code}`,
      },
    },
    AppointmentDetails: {
      path: "appointment/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
  },
};

const linking = {
  prefixes: ["http://localhost:8080"],
  config,
};

function MainApp() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Configurar canal de notificaciones para Android
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Verificar permisos
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Las notificaciones no funcionarán sin permisos');
      }
    };

    setupNotifications();

    // Escuchar notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    // Escuchar interacción con notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, appointmentId } = response.notification.request.content.data;
      if (screen && appointmentId) {
        // Navegar a la pantalla correspondiente
        // Esto requiere que tengas acceso a navigation en este componente
        // Puedes usar navigationRef si usas NavigationContainer
        console.log(`Navegar a ${screen} con ID: ${appointmentId}`);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
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