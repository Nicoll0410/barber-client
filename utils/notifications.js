import axios from "axios";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

// Asegúrate de que esta URL coincida con tu configuración de backend
const API_URL = "http://localhost:8080/api/notifications";

// Configuración inicial de notificaciones
export const configurePushNotifications = async () => {
    try {
        await Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        const { status } = await Notifications.getPermissionsAsync();
        
        if (status !== 'granted') {
            await Notifications.requestPermissionsAsync();
        }
    } catch (error) {
        console.error("Error configurando notificaciones:", error);
    }
};

// Registrar token push
export const registerPushToken = async (userId, tokenAuth) => {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            
            if (newStatus !== 'granted') {
                throw new Error('Permiso para notificaciones denegado');
            }
        }

        const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo push token:", expoToken);

        await axios.post(
            `${API_URL}/save-token`,
            { userId, token: expoToken },
            { 
                headers: { 
                    Authorization: `Bearer ${tokenAuth}`, 
                    'Content-Type': 'application/json' 
                } 
            }
        );

        return expoToken;
    } catch (error) {
        console.error("Error registrando token push:", error);
        throw error;
    }
};

// Obtener notificaciones
export const fetchNotifications = async (token) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }
        });
        
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo notificaciones:", error);
        throw error;
    }
};

// Obtener conteo de no leídas
export const getUnreadCount = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/count`, {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }
        });
        
        return response.data.count;
    } catch (error) {
        console.error("Error obteniendo conteo de no leídas:", error);
        throw error;
    }
};

// Marcar todas como leídas
export const markAllAsRead = async (token) => {
    try {
        await axios.post(
            `${API_URL}/mark-read`,
            {},
            { 
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                } 
            }
        );
    } catch (error) {
        console.error("Error marcando notificaciones como leídas:", error);
        throw error;
    }
};  
// Reproducir sonido de notificación
export const playNotificationSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/sound/notification.mp3")
        );
        
        await sound.playAsync();
        setTimeout(() => sound.unloadAsync(), 3000);
    } catch (error) {
        console.error("Error reproduciendo sonido:", error);
    }
};

// Configurar listeners de notificaciones
export const setupNotificationListeners = (onNotificationReceived) => {
    const subscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
    return () => subscription.remove();
};