if (Platform.OS === 'web') {
  require('./webPolyfills');
}

import React, { useEffect, useRef, useState } from "react";
import { Platform, Alert, LogBox, AppState, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Constants from "expo-constants";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { configurePushNotifications } from './utils/notifications';
import { Audio } from 'expo-av';
import io from 'socket.io-client';

// Configuración completa de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Reproducir sonido
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sound/notification.mp3')
      );
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 2000);
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: false, // Ya lo manejamos nosotros
      shouldSetBadge: true,
    };
  },
});

// Handler para cuando se recibe una notificación en primer plano
const handleReceivedNotification = (notification) => {
  console.log('Notificación recibida:', notification);
  // Aquí puedes actualizar el estado de tu app con la nueva notificación
};

// Handler para cuando el usuario toca una notificación
const handleSelectedNotification = (response) => {
  const data = response.notification.request.content.data;
  console.log('Usuario interactuó con notificación:', data);
  
  // Navegar a la pantalla correspondiente
  if (data.screen === 'DetalleCita' && data.citaId) {
    navigationRef.current?.navigate('DetalleCita', { id: data.citaId });
  }
};

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
  const navigationRef = useRef();
  const socketRef = useRef(null);
  const [notificationSound, setNotificationSound] = useState(null);
  const { authState } = useAuth();

  // Cargar sonido de notificación
  const loadNotificationSound = async () => {
    try {
      console.log("Cargando sonido de notificación...");
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sound/notification.mp3')
      );
      setNotificationSound(sound);
    } catch (error) {
      console.error("Error cargando sonido:", error);
    }
  };

  // Reproducir sonido de notificación
  const playNotificationSound = async () => {
    try {
      console.log("Reproduciendo sonido de notificación...");
      if (notificationSound) {
        await notificationSound.replayAsync();
      }
    } catch (error) {
      console.error("Error reproduciendo sonido:", error);
    }
  };

  // Función para manejar deep links
  const handleDeepLink = (event) => {
    try {
      let url = event.url;
      console.log('Deep link recibido:', url);
      
      // Parsear la URL
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const params = Object.fromEntries(urlObj.searchParams.entries());
      
      console.log('Path:', path);
      console.log('Params:', params);
      
      // Manejar diferentes tipos de deep links
      if (path.includes('/verify-email')) {
        // Redirigir a la pantalla de verificación de email con los parámetros
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

  // USE EFFECT CORREGIDO - Manejo de sockets y notificaciones
  useEffect(() => {
    let socket;
    let notificationSubscription;
    let responseSubscription;
    let appStateSubscription;
    let linkingSubscription;

    const initializeSocket = async () => {
      try {
        // Obtener el token de autenticación
        const token = await AsyncStorage.getItem("token");
        
        if (!token) {
          console.log("No hay token, no se inicializará socket");
          return;
        }

        const BASE_URL = Platform.OS === "android" 
          ? "https://barber-server-6kuo.onrender.com" 
          : "https://barber-server-6kuo.onrender.com";

        // Configurar Socket.IO con autenticación
        socket = io(BASE_URL, {
          transports: ["websocket", "polling"],
          auth: {
            token: token
          }
        });

        // Eventos de conexión
        socket.on("connect", () => {
          console.log("✅ Conectado al servidor de sockets");
          
          // Unirse a la sala del usuario después de conectar
          if (authState.user?.userId) {
            socket.emit("join-user-room");
            console.log("✅ Unido a la sala del usuario");
          }
        });

        socket.on("disconnect", (reason) => {
          console.log("❌ Desconectado del servidor de sockets:", reason);
        });

        socket.on("connect_error", (error) => {
          console.error("❌ Error de conexión con socket:", error);
          
          // Intentar reconectar después de un delay
          setTimeout(() => {
            if (socket && !socket.connected) {
              console.log("🔄 Intentando reconectar...");
              socket.connect();
            }
          }, 3000);
        });

        // Manejar notificaciones en tiempo real
        socket.on("nueva_notificacion", (notificationData) => {
          console.log("📩 Notificación recibida vía socket:", notificationData);
          
          // Verificar si la notificación es para el usuario actual
          if (authState.user && notificationData.usuarioID === authState.user.userId) {
            // Actualizar estado con la nueva notificación
            setAuthState(prev => {
              // Evitar duplicados
              const exists = prev.notifications.some(n => n.id === notificationData.id);
              if (exists) return prev;

              return {
                ...prev,
                notifications: [notificationData, ...prev.notifications],
                unreadCount: prev.unreadCount + 1,
                lastNotification: notificationData
              };
            });

            // Reproducir sonido de notificación
            playNotificationSound();
            
            // Mostrar alerta nativa (opcional)
            if (notificationData.sound) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: notificationData.titulo,
                  body: notificationData.cuerpo,
                  data: notificationData
                },
                trigger: null
              });
            }
          }
        });

        // Guardar la referencia al socket
        socketRef.current = socket;

      } catch (error) {
        console.error("Error inicializando socket:", error);
      }
    };

    // Configurar handlers de notificaciones
    const setupNotificationHandlers = () => {
      // Notificación recibida en primer plano
      notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificación recibida:', notification);
        
        // Actualizar badge count
        Notifications.getBadgeCountAsync().then(count => {
          setAuthState(prev => ({
            ...prev,
            unreadCount: count || 0
          }));
        });
      });

      // Usuario tocó la notificación
      responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        console.log('Usuario interactuó con notificación:', data);
        
        // Navegar a la pantalla correspondiente
        if (data.screen === 'DetalleCita' && data.citaId) {
          navigationRef.current?.navigate('DetalleCita', { id: data.citaId });
        }
      });
    };

    // Inicializar
    const initialize = async () => {
      try {
        await loadNotificationSound();
        await setupNotificationChannel();
        setupNotificationHandlers();
        
        // Configurar push notifications
        configurePushNotifications();

        // Registrar el token push
        await registerForPushNotifications();
        
        // Solo inicializar socket si el usuario está autenticado
        if (authState.isLoggedIn && authState.token) {
          await initializeSocket();
        }

        // Configurar listener para deep links
        linkingSubscription = Linking.addEventListener('url', handleDeepLink);

        // Manejar el deep link inicial si la app fue abierta desde un link
        Linking.getInitialURL().then(url => {
          if (url) {
            console.log('App abierta desde deep link:', url);
            handleDeepLink({ url });
          }
        }).catch(err => console.error('Error obteniendo URL inicial:', err));

        // Escuchar cambios en el estado de la app
        appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

      } catch (error) {
        console.error("Error en inicialización:", error);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      console.log("🛑 Limpiando recursos de notificaciones y socket");
      
      // Limpiar socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      
      // Limpiar suscripciones de notificaciones
      if (notificationSubscription) {
        notificationSubscription.remove();
      }
      
      if (responseSubscription) {
        responseSubscription.remove();
      }
      
      // Limpiar listeners
      if (linkingSubscription) {
        linkingSubscription.remove();
      }
      
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
      
      // Limpiar sonido
      if (notificationSound) {
        notificationSound.unloadAsync();
      }
    };
  }, [authState.isLoggedIn, authState.token, authState.user]); // Dependencias relevantes

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: [
          'mybarberapp://', // Para iOS y Android
          'https://mybarberapp.com', // Para web
          'https://*.mybarberapp.com' // Para subdominios
        ],
        config: {
          screens: {
            VerifyEmail: 'verify-email', // Mapeo de ruta para deep links
          },
        },
      }}
      onStateChange={(state) => {
        // Puedes agregar lógica adicional aquí si es necesario
        console.log('Navegación cambiada:', state);
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