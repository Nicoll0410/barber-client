import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

const BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:8082" : "http://localhost:8080";

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
        lastNotification: null
    });

    const [notificationSound, setNotificationSound] = useState(null);

    // 1. Configuración inicial de sonido
    const loadNotificationSound = async () => {
        try {
            console.log("Cargando sonido de notificación...");
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sound/notification.mp3')
            );
            setNotificationSound(sound);
        } catch (error) {
            console.error('Error cargando sonido:', error);
        }
    };

    // 2. Configuración de notificaciones push
    const setupNotifications = useCallback(async () => {
        console.log("Configurando notificaciones...");
        try {
            // Configurar handler
            await Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });

            // Obtener permisos
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }

            // Configurar listeners
            const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
            const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

            return () => {
                notificationListener.remove();
                responseListener.remove();
            };
        } catch (error) {
            console.error("Error configurando notificaciones:", error);
        }
    }, []);

    // 3. Manejar notificación recibida
    const handleNotificationReceived = (notification) => {
        console.log("Notificación recibida:", notification);
        playNotificationSound();
        updateUnreadCount();
        fetchNotifications();
    };

    // 4. Manejar respuesta a notificación
    const handleNotificationResponse = (response) => {
        console.log("Usuario interactuó con notificación:", response);
        fetchNotifications();
    };

    // 5. Actualizar contador no leídas
    const updateUnreadCount = async () => {
        try {
            const newCount = authState.unreadCount + 1;
            await Notifications.setBadgeCountAsync(newCount);
            setAuthState(prev => ({ ...prev, unreadCount: newCount }));
        } catch (error) {
            console.error("Error actualizando badge:", error);
        }
    };

    // 6. Reproducir sonido
    const playNotificationSound = async () => {
        try {
            console.log("Reproduciendo sonido de notificación...");
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
                const { data } = await axios.get(
                    `${BASE_URL}/clientes/usuario/${userId}`,
                    { headers: { Authorization: `Bearer ${authState.token}` } }
                );
                return { clientData: data };
            } else if (userRole === "Barbero") {
                const { data } = await axios.get(
                    `${BASE_URL}/barberos/usuario/${userId}`,
                    { headers: { Authorization: `Bearer ${authState.token}` } }
                );
                return { barberData: data };
            }
            return {};
        } catch (error) {
            console.error("Error cargando datos adicionales:", error);
            return {};
        }
    }, [authState.token]);

const fetchNotifications = useCallback(async () => {
    try {
        console.log("Obteniendo notificaciones...");
        
        if (!authState.token || !authState.user?.id) {
            console.log('No hay token o userId, abortando fetch');
            return [];
        }

        const response = await axios.get(
            `${BASE_URL}/api/notifications`,
            { 
                headers: { 
                    Authorization: `Bearer ${authState.token}`,
                    'Content-Type': 'application/json' 
                },
                timeout: 10000 // 👈 Añadir timeout para evitar esperas infinitas
            }
        );

        console.log("Respuesta de notificaciones:", response.data);

        if (!response.data?.success) {
            throw new Error(response.data?.message || "Error al obtener notificaciones");
        }

        const notificationsData = response.data.data?.notifications || [];
        const unreadCount = response.data.data?.unreadCount || 0;

        // 👈 ACTUALIZAR: Solo actualizar badge si hay cambios
        const currentBadgeCount = await Notifications.getBadgeCountAsync();
        if (currentBadgeCount !== unreadCount) {
            await Notifications.setBadgeCountAsync(unreadCount);
        }

        setAuthState(prev => ({
            ...prev,
            notifications: notificationsData,
            unreadCount,
            lastNotification: notificationsData[0] || null
        }));

        return notificationsData;
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        if (error.code === 'ECONNABORTED') {
            console.log('Timeout al obtener notificaciones');
        } else if (error.response?.status === 401) {
            console.log('Token expirado, cerrando sesión');
        }
        return [];
    }
}, [authState.token, authState.user?.id]);


    const markNotificationsAsRead = useCallback(async () => {
        try {
            if (!authState.token) return;

            // Cambiado de PUT a POST para coincidir con la ruta del backend
            const response = await axios.post(
                `${BASE_URL}/api/notifications/mark-read`,
                {},
                { 
                    headers: { 
                        Authorization: `Bearer ${authState.token}`,
                        'Content-Type': 'application/json' 
                    } 
                }
            );

            if (response.data?.success) {
                setAuthState(prev => ({
                    ...prev,
                    unreadCount: 0,
                    notifications: prev.notifications.map(n => ({ ...n, leido: true }))
                }));
                await Notifications.setBadgeCountAsync(0);
            }
        } catch (error) {
            console.error('Error marcando notificaciones como leídas:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
        }
    }, [authState.token]);


    // 9. Registrar token push
    const registerPushToken = useCallback(async (userId) => {
        try {
            console.log("Registrando token push...");
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
                `${BASE_URL}/api/notifications/save-token`,
                { userId, token },
                { 
                    headers: { 
                        Authorization: `Bearer ${authState.token}`,
                        'Content-Type': 'application/json' 
                    } 
                }
            );

            return token;
        } catch (error) {
            console.error('Error registrando token push:', error);
            return null;
        }
    }, [authState.token]);

    // 10. Inicialización de autenticación
    const initializeAuth = useCallback(async () => {
        try {
            console.log("Inicializando autenticación...");
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
                unreadCount: 0,
                lastNotification: null
            };

            setAuthState(newState);

            // Configurar notificaciones push
            const cleanupNotifications = await setupNotifications();

            // Registrar token push
            if (decoded.userId) {
                await registerPushToken(decoded.userId);
            }

            // Obtener notificaciones iniciales
            await fetchNotifications();

            return () => {
                cleanupNotifications?.();
            };
        } catch (err) {
            console.error("Error inicializando auth:", err);
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, [checkTokenValidity, loadUserData, fetchNotifications, registerPushToken, setupNotifications]);

    useEffect(() => {
        loadNotificationSound();
        const cleanupAuth = initializeAuth();

        return () => {
            if (notificationSound) {
                notificationSound.unloadAsync();
            }
            cleanupAuth?.();
        };
    }, []);

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
                unreadCount: 0,
                lastNotification: null
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
                unreadCount: 0,
                lastNotification: null
            });
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const verifyAccount = async (email, code) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/verify-account`,
                { email, codigo: code }
            );

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
                    lastNotification: null
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

            return {
                success: false,
                message: "No se recibió token"
            };
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
            const response = await axios.post(
                `${BASE_URL}/auth/resend-verification`,
                { email }
            );
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