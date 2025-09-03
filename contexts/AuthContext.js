import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import io from "socket.io-client";

const BASE_URL =
  Platform.OS === "android" ? "https://barber-server-6kuo.onrender.com" : "https://barber-server-6kuo.onrender.com";

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
    lastNotification: null,
  });

  const [notificationSound, setNotificationSound] = useState(null);
  const socketRef = useRef(null);
  const notificationHandlerRef = useRef(null);

  const loadNotificationSound = async () => {
    try {
      console.log("Cargando sonido de notificación...");
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/notification.mp3")
      );
      setNotificationSound(sound);
    } catch (error) {
      console.error("Error cargando sonido:", error);
    }
  };

  const setupNotifications = useCallback(async () => {
    console.log("Configurando notificaciones...");
    try {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      const notificationListener =
        Notifications.addNotificationReceivedListener(handleNotificationReceived);
      const responseListener =
        Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    } catch (error) {
      console.error("Error configurando notificaciones:", error);
      return null;
    }
  }, []);

  const handleNotificationReceived = (notification) => {
    console.log("Notificación recibida:", notification);
    playNotificationSound();
  };

  const handleNotificationResponse = (response) => {
    console.log("Usuario interactuó con notificación:", response);
  };

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

  const loadUserData = useCallback(async (userId, userRole, token) => {
    try {
      if (userRole === "Cliente") {
        const { data } = await axios.get(
          `${BASE_URL}/clientes/usuario/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return { clientData: data };
      } else if (userRole === "Barbero") {
        const { data } = await axios.get(
          `${BASE_URL}/barberos/usuario/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      console.log("Obteniendo notificaciones...");

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No hay token en AsyncStorage, abortando fetch");
        setAuthState((prev) => ({
          ...prev,
          notifications: [],
          unreadCount: 0,
        }));
        return [];
      }

      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("Respuesta de notificaciones:", response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Error al obtener notificaciones");
      }

      const notificationsData = response.data.data?.notifications || [];
      const unreadCount = response.data.data?.unreadCount || 0;

      setAuthState((prev) => ({
        ...prev,
        notifications: notificationsData,
        unreadCount: unreadCount,
      }));

      await Notifications.setBadgeCountAsync(unreadCount);

      console.log("Notificaciones obtenidas:", notificationsData.length);
      return notificationsData;
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
      if (error.response?.status === 401) {
        console.log("Token expirado, cerrando sesión");
        await AsyncStorage.removeItem("token");
        setAuthState((prev) => ({
          ...prev,
          token: null,
          user: null,
          notifications: [],
          unreadCount: 0,
        }));
      }
      return [];
    }
  }, []);

const markNotificationAsRead = async (notificacionId) => {
  try {
    setAuthState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificacionId ? { ...n, leido: true } : n
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
    
    // Actualizar en backend
    if (authState.token) {
      await axios.post(`${BASE_URL}/notifications/mark-read`, {
        notificacionId
      }, {
        headers: { Authorization: `Bearer ${authState.token}` }
      });
    }
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
  }
};

  const registerPushToken = useCallback(async (userId, token) => {
    try {
      console.log("Registrando token push...");
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permiso para notificaciones denegado");
        return;
      }

      const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token push obtenido:", pushToken);

      await axios.post(
        `${BASE_URL}/notifications/save-token`,
        {
          token: pushToken,
          dispositivo: Platform.OS,
          sistemaOperativo: Platform.Version,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return pushToken;
    } catch (error) {
      console.error("Error registrando token push:", error);
      return null;
    }
  }, []);

  // En initializeSocket, agregar manejo de notificaciones de citas
const initializeSocket = useCallback(() => {
    if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
    }

    if (authState.isLoggedIn && authState.user) {
        console.log("Inicializando socket...");
        socketRef.current = io(BASE_URL, { 
            transports: ["websocket"],
            auth: {
                token: authState.token
            }
        });

        // Unirse al room del usuario
        socketRef.current.emit('join-user-room', {
            userId: authState.user.userId,
            rol: authState.userRole
        });

        // Handler para notificaciones de sistema
        notificationHandlerRef.current = (data) => {
            console.log("📩 Notificación recibida vía socket:", data);
            // ... código existente ...
        };

        // 👇 NUEVO: Handler específico para notificaciones de citas
        socketRef.current.on("nueva_cita", (data) => {
            console.log("📅 Notificación de cita recibida:", data);
            
            // Verificar si la notificación es para este usuario
            const esParaEsteUsuario = 
                (authState.userRole === 'barbero' && data.tipo.includes('barbero')) ||
                (authState.userRole === 'cliente' && data.tipo.includes('cliente')) ||
                (authState.userRole === 'administrador' && data.tipo.includes('administrador'));
            
            if (esParaEsteUsuario) {
                // Crear notificación local
                const nuevaNotificacion = {
                    id: Date.now(), // ID temporal
                    titulo: data.mensaje,
                    cuerpo: `Cita: ${data.cita.servicio?.nombre || 'Servicio'}`,
                    tipo: 'cita',
                    relacionId: data.cita.id,
                    leido: false,
                    createdAt: new Date()
                };

                setAuthState((prev) => ({
                    ...prev,
                    notifications: [nuevaNotificacion, ...prev.notifications],
                    unreadCount: prev.unreadCount + 1,
                    lastNotification: nuevaNotificacion
                }));

                // Reproducir sonido
                playNotificationSound();
                
                // Actualizar badge
                Notifications.setBadgeCountAsync(authState.unreadCount + 1);
                
                // Mostrar alerta (opcional)
                if (Platform.OS !== 'web') {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: nuevaNotificacion.titulo,
                            body: nuevaNotificacion.cuerpo,
                            data: { 
                                type: 'cita', 
                                citaId: data.cita.id,
                                screen: 'DetalleCita'
                            }
                        },
                        trigger: null
                    });
                }
            }
        });

        socketRef.current.on("newNotification", notificationHandlerRef.current);
    }
}, [authState.isLoggedIn, authState.user, authState.userRole]);

  const initializeAuth = useCallback(async () => {
    try {
      console.log("Inicializando autenticación...");
      const savedToken = await AsyncStorage.getItem("token");

      if (!savedToken) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      const { valid, decoded } = await checkTokenValidity(savedToken);

      if (!valid) {
        await AsyncStorage.removeItem("token");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      const userRole = normalizeRole(decoded?.rol?.nombre);
      const additionalData = await loadUserData(decoded.userId, userRole, savedToken);

      const newState = {
        isLoading: false,
        isLoggedIn: true,
        token: savedToken,
        user: decoded,
        userRole,
        ...additionalData,
        notifications: [],
        unreadCount: 0,
        lastNotification: null,
      };

      setAuthState(newState);

      // Configurar notificaciones push
      const cleanupNotifications = await setupNotifications();

      // Registrar token push
      if (decoded.userId) {
        await registerPushToken(decoded.userId, savedToken);
      }

      // Obtener notificaciones iniciales
      await fetchNotifications();

      // Inicializar socket después de que el estado se haya actualizado
      setTimeout(() => {
        initializeSocket();
      }, 100);

      return cleanupNotifications;
    } catch (err) {
      console.error("Error inicializando auth:", err);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [checkTokenValidity, loadUserData, fetchNotifications, registerPushToken, setupNotifications, initializeSocket]);

  useEffect(() => {
    let isMounted = true;
    let cleanupFunction = null;

    const initialize = async () => {
      try {
        await loadNotificationSound();

        if (isMounted) {
          cleanupFunction = await initializeAuth();
        }
      } catch (error) {
        console.error("Error en inicialización:", error);
        if (isMounted) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      
      // Limpiar socket
      if (socketRef.current) {
        if (notificationHandlerRef.current) {
          socketRef.current.off("newNotification", notificationHandlerRef.current);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      
      // Limpiar sonido
      if (notificationSound) {
        notificationSound.unloadAsync();
      }
      
      // Limpiar listeners de notificaciones
      if (cleanupFunction && typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };
  }, []);

  // Dentro del AuthProvider, agregar este useEffect específico para sockets
useEffect(() => {
  const setupSocketListeners = () => {
    if (socketRef.current && authState.user && authState.isLoggedIn) {
      console.log("🔌 Configurando listeners de socket...");

      // Listener para notificaciones de nuevas citas
      socketRef.current.on("nueva_cita", (data) => {
        console.log("📅 Notificación de cita recibida via socket:", data);
        
        // Crear notificación local
        const nuevaNotificacion = {
          id: `cita_${Date.now()}`,
          titulo: data.mensaje,
          cuerpo: `Servicio: ${data.cita?.servicio?.nombre || 'Cita agendada'}`,
          tipo: 'cita',
          relacionId: data.cita?.id,
          leido: false,
          createdAt: new Date(),
          data: data
        };

        // Actualizar estado
        setAuthState(prev => ({
          ...prev,
          notifications: [nuevaNotificacion, ...prev.notifications],
          unreadCount: prev.unreadCount + 1,
          lastNotification: nuevaNotificacion
        }));

        // Reproducir sonido
        playNotificationSound();
        
        // Actualizar badge
        Notifications.setBadgeCountAsync(authState.unreadCount + 1);
        
        // Mostrar notificación local
        if (Platform.OS !== 'web') {
          Notifications.scheduleNotificationAsync({
            content: {
              title: nuevaNotificacion.titulo,
              body: nuevaNotificacion.cuerpo,
              sound: 'default',
              data: {
                type: 'cita',
                citaId: data.cita?.id,
                screen: 'DetalleCita',
                notificacionId: nuevaNotificacion.id
              }
            },
            trigger: null
          });
        }
      });

      // Listener para notificaciones generales
      socketRef.current.on("newNotification", (data) => {
        console.log("📩 Notificación general recibida:", data);
        
        // Verificar si es para el usuario actual
        if (authState.user && data.usuarioID === authState.user.userId) {
          setAuthState(prev => {
            const exists = prev.notifications.some(n => n.id === data.notificacion.id);
            if (exists) return prev;

            return {
              ...prev,
              notifications: [data.notificacion, ...prev.notifications],
              unreadCount: prev.unreadCount + 1,
              lastNotification: data.notificacion
            };
          });

          playNotificationSound();
          Notifications.setBadgeCountAsync(authState.unreadCount + 1);
        }
      });
    }
  };

  // Configurar listeners cuando el usuario esté logueado
  if (authState.isLoggedIn && socketRef.current) {
    setupSocketListeners();
  }

  return () => {
    // Limpiar listeners de socket
    if (socketRef.current) {
      socketRef.current.off("nueva_cita");
      socketRef.current.off("newNotification");
    }
  };
}, [authState.isLoggedIn, authState.user, authState.unreadCount]); // Dependencias correctas

  // Efecto separado para manejar cambios en el estado de autenticación
  useEffect(() => {
    initializeSocket();
  }, [authState.isLoggedIn, authState.user, initializeSocket]);

  const login = async (token, additionalData = {}) => {
    try {
      const { decoded } = await checkTokenValidity(token);
      if (!decoded) throw new Error("Token inválido");

      await AsyncStorage.setItem("token", token);
      const userRole = normalizeRole(decoded?.rol?.nombre);
      const userData = await loadUserData(decoded.userId, userRole, token);

      const newState = {
        isLoading: false,
        isLoggedIn: true,
        token,
        user: decoded,
        userRole,
        ...userData,
        ...additionalData,
        notifications: [],
        unreadCount: 0,
        lastNotification: null,
      };

      setAuthState(newState);

      if (decoded.userId) {
        await registerPushToken(decoded.userId, token);
      }

      await fetchNotifications();

      // Inicializar socket después del login
      setTimeout(() => {
        initializeSocket();
      }, 100);

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Limpiar socket primero
      if (socketRef.current) {
        if (notificationHandlerRef.current) {
          socketRef.current.off("newNotification", notificationHandlerRef.current);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }

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
        unreadCount: 0,
        lastNotification: null,
      });
      await Notifications.setBadgeCountAsync(0);
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
          unreadCount: 0,
          lastNotification: null,
        };

        setAuthState(newState);

        if (decoded.userId) {
          await registerPushToken(decoded.userId, response.data.token);
        }

        await fetchNotifications();

        // Inicializar socket después de verificar cuenta
        setTimeout(() => {
          initializeSocket();
        }, 100);

        return {
          success: true,
          message: "Cuenta verificada exitosamente",
          rol: userRole,
        };
      }

      return {
        success: false,
        message: "No se recibió token",
      };
    } catch (error) {
      console.error("Error en verifyAccount:", error);
      return {
        success: false,
        message:
          error.response?.data?.mensaje || "Error al verificar la cuenta",
      };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/resend-verification`, {
        email,
      });
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
    playNotificationSound,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};