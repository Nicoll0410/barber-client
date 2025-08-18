import axios from "axios";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

const API_URL = "http://localhost:8080"; // Asegúrate de usar la IP correcta

export const getUnreadCount = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.count;
  } catch (error) {
    console.error("Error en getUnreadCount:", error);
    throw error;
  }
};

export const getNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.notifications; // Ajustado a la nueva estructura
  } catch (error) {
    console.error("Error en getNotifications:", error);
    throw error;
  }
};

export const markAllAsRead = async (token) => {
  try {
    await axios.put(
      `${API_URL}/notifications/mark-as-read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error en markAllAsRead:", error);
    throw error;
  }
};

export const playNotificationSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sound/notification.mp3")
    );
    await sound.playAsync();
    setTimeout(() => sound.unloadAsync(), 3000);
  } catch (error) {
    console.error("Error al reproducir sonido:", error);
  }
};

// Configuración inicial de notificaciones push
export const configurePushNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

export const registerForPushNotifications = async (userId, tokenAuth) => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permiso para notificaciones push no concedido");
      return null;
    }

    const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", expoToken);

    if (userId && tokenAuth) {
      await axios.post(
        `${API_URL}/notifications/save-token`,
        { userId, token: expoToken },
        { headers: { Authorization: `Bearer ${tokenAuth}` } }
      );
    }

    // Listener para notificaciones recibidas en primer plano
    Notifications.addNotificationReceivedListener(notification => {
      // Actualizar el badge cuando llega una nueva notificación
      Notifications.getBadgeCountAsync().then(count => {
        Notifications.setBadgeCountAsync((count || 0) + 1);
      });
    });

    return expoToken;
  } catch (error) {
    console.error("Error en registerForPushNotifications:", error);
    return null;
  }
};