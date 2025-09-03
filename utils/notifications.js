import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export const configurePushNotifications = async () => {
    if (!Device.isDevice) {
        console.warn('Debes usar un dispositivo físico para notificaciones push');
        return;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permisos de notificación no concedidos');
            return;
        }

        // Configurar canal para Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Notificaciones de Citas',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
                showBadge: true,
                enableLights: true,
                enableVibrate: true,
            });
        }

        console.log('Notificaciones push configuradas correctamente');
    } catch (error) {
        console.error('Error configurando notificaciones push:', error);
    }
};

export const scheduleLocalNotification = async (title, body, data = {}) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                data,
                priority: Notifications.AndroidNotificationPriority.HIGH
            },
            trigger: null
        });
    } catch (error) {
        console.error('Error programando notificación local:', error);
    }
};