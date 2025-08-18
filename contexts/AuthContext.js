// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

const BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:8080"
  : "http://localhost:8080";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    token: null,
    user: null,
    userRole: null,
    clientData: null,
    barberData: null,
    notifications: [],
    unreadCount: 0,
  });

  const [notificationSound, setNotificationSound] = useState(null);

  // Cargar sonido de notificación
  const loadNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sound/notification.mp3')
      );
      setNotificationSound(sound);
    } catch (error) {
      console.error('Error cargando sonido:', error);
    }
  };

  useEffect(() => {
    loadNotificationSound();
    return () => {
      if (notificationSound) {
        notificationSound.unloadAsync();
      }
    };
  }, []);

  const playNotificationSound = async () => {
    try {
      if (notificationSound) {
        await notificationSound.replayAsync();
      }
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
    }
  };

  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;
    return rawRole === "Paciente" ? "Cliente" : rawRole;
  };

  const checkTokenValidity = useCallback(async (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        return { valid: true, decoded };
      }
      return { valid: false };
    } catch (err) {
      console.warn("Token inválido:", err);
      return { valid: false };
    }
  }, []);

  const loadUserData = useCallback(async (userId, userRole) => {
    try {
      if (userRole === "Cliente") {
        const { data } = await axios.get(`${BASE_URL}/clientes/usuario/${userId}`);
        return { clientData: data };
      } else if (userRole === "Barbero") {
        const { data } = await axios.get(`${BASE_URL}/barberos/usuario/${userId}`);
        return { barberData: data };
      }
      return {};
    } catch (error) {
      console.error("Error cargando datos adicionales:", error);
      return {};
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!authState.token || !authState.user?.userId) {
        console.log('No hay token o userId, abortando fetch');
        return [];
      }

      console.log('Obteniendo notificaciones...');
      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });

      let notificationsData = [];
      let unreadCount = 0;

      // Manejar diferentes estructuras de respuesta
      if (response.data.data) {
        notificationsData = response.data.data.notifications || [];
        unreadCount = response.data.data.unreadCount || 0;
      } else {
        notificationsData = response.data.notifications || [];
        unreadCount = response.data.unreadCount || 0;
      }

      console.log('Notificaciones obtenidas:', notificationsData.length);
      console.log('No leídas:', unreadCount);

      // Actualizar badge en el dispositivo
      await Notifications.setBadgeCountAsync(unreadCount);

      // Actualizar estado
      setAuthState(prev => ({
        ...prev,
        notifications: notificationsData,
        unreadCount
      }));

      return notificationsData;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      return [];
    }
  }, [authState.token, authState.user?.userId]);

  const markNotificationsAsRead = useCallback(async () => {
    try {
      if (!authState.token) return;
      
      console.log('Marcando notificaciones como leídas...');
      await axios.put(
        `${BASE_URL}/notifications/mark-as-read`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      );
      
      // Actualizar el estado local
      setAuthState(prev => ({
        ...prev,
        unreadCount: 0,
        notifications: prev.notifications.map(n => ({ ...n, leido: true }))
      }));
      
      // Resetear el badge
      await Notifications.setBadgeCountAsync(0);
      
      console.log('Notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marcando notificaciones como leídas:', error);
    }
  }, [authState.token]);

  const registerPushToken = useCallback(async (userId) => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permiso para notificaciones denegado');
        return;
      }
      
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token push obtenido:', token);
      
      await axios.post(
        `${BASE_URL}/notifications/save-token`, 
        { userId, token }, 
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      );

      // Configurar el listener para notificaciones recibidas
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificación recibida:', notification);
        // Incrementar el contador de notificaciones no leídas
        setAuthState(prev => ({
          ...prev,
          unreadCount: prev.unreadCount + 1
        }));
        // Actualizar el badge
        Notifications.setBadgeCountAsync(prev => (prev || 0) + 1);
        // Reproducir sonido
        playNotificationSound();
      });

      return token;
    } catch (error) {
      console.error('Error registrando token push:', error);
      return null;
    }
  }, [authState.token]);

  const initializeAuth = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (!savedToken) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { valid, decoded } = await checkTokenValidity(savedToken);
      if (!valid) {
        await AsyncStorage.removeItem("token");
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const userRole = normalizeRole(decoded?.rol?.nombre);
      const additionalData = await loadUserData(decoded.userId, userRole);

      const newState = {
        isLoading: false,
        isLoggedIn: true,
        token: savedToken,
        user: decoded,
        userRole,
        ...additionalData,
        notifications: [],
        unreadCount: 0
      };

      setAuthState(newState);

      // Configurar notificaciones push
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Registrar token push
      if (decoded.userId) {
        await registerPushToken(decoded.userId);
      }

      // Obtener notificaciones iniciales
      await fetchNotifications();
    } catch (err) {
      console.error("Error inicializando auth:", err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [checkTokenValidity, loadUserData, fetchNotifications, registerPushToken]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (token, additionalData = {}) => {
    try {
      const { decoded } = await checkTokenValidity(token);
      if (!decoded) throw new Error("Token inválido");

      await AsyncStorage.setItem("token", token);
      const userRole = normalizeRole(decoded?.rol?.nombre);
      const userData = await loadUserData(decoded.userId, userRole);

      const newState = {
        isLoading: false,
        isLoggedIn: true,
        token,
        user: decoded,
        userRole,
        ...userData,
        ...additionalData,
        notifications: [],
        unreadCount: 0
      };

      setAuthState(newState);

      // Registrar token push
      if (decoded.userId) {
        await registerPushToken(decoded.userId);
      }

      // Obtener notificaciones
      await fetchNotifications();

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setAuthState({
        isLoading: false,
        isLoggedIn: false,
        token: null,
        user: null,
        userRole: null,
        clientData: null,
        barberData: null,
        notifications: [],
        unreadCount: 0
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const verifyAccount = async (email, code) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-account`, {
        email,
        codigo: code,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);

        const decoded = jwtDecode(response.data.token);
        const userRole = normalizeRole(decoded?.rol?.nombre);

        const newState = {
          isLoading: false,
          isLoggedIn: true,
          token: response.data.token,
          user: decoded,
          userRole,
          clientData: response.data.cliente || null,
          barberData: response.data.barbero || null,
          notifications: [],
          unreadCount: 0
        };

        setAuthState(newState);

        // Registrar token push
        if (decoded.userId) {
          await registerPushToken(decoded.userId);
        }

        // Obtener notificaciones
        await fetchNotifications();

        return {
          success: true,
          message: "Cuenta verificada exitosamente",
          rol: userRole,
        };
      }
      return { success: false, message: "No se recibió token" };
    } catch (error) {
      console.error("Error en verifyAccount:", error);
      return {
        success: false,
        message: error.response?.data?.mensaje || "Error al verificar la cuenta",
      };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
      return response.data;
    } catch (error) {
      console.error("Error en resendVerificationCode:", error);
      throw new Error(error.response?.data?.mensaje || "Error al reenviar el código");
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    verifyAccount,
    resendVerificationCode,
    fetchNotifications,
    markNotificationsAsRead,
    playNotificationSound
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};