import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

// Configurar notificaciones push
export const configurePushNotifications = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
};

// Sonido de notificación
export const playNotificationSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sound/notification.mp3')
        );
        
        await sound.playAsync();
        
        setTimeout(() => {
            sound.unloadAsync();
        }, 3000);
    } catch (error) {
        console.error('Error al reproducir sonido:', error);
    }
};

// Obtener token para notificaciones push
export const registerForPushNotifications = async (userId) => {
    try {
        // Verificar permisos existentes
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Solicitar permisos si no están concedidos
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // Salir si no se conceden los permisos
        if (finalStatus !== 'granted') {
            console.warn('Permiso para notificaciones push no concedido');
            return null;
        }

        // Obtener token push
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Token push:', token);

        // Guardar token en el backend si hay un usuario autenticado
        if (userId) {
            try {
                await api.post('/notifications/save-token', {
                    userId,
                    token
                });
            } catch (error) {
                console.error('Error al guardar token push:', error);
                throw error;
            }
        }

        return token;
    } catch (error) {
        console.error('Error en el registro de notificaciones push:', error);
        return null;
    }
};