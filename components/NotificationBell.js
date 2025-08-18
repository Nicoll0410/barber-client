import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { AuthContext } from "../contexts/AuthContext";
import { getUnreadCount, playNotificationSound } from "../utils/notifications";

const NotificationBell = ({ navigation }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!isLoggedIn || !user?.token) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const count = await getUnreadCount(user.token);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, user?.token]);

  const handlePress = async () => {
    try {
      await playNotificationSound();
      navigation.navigate("Notificaciones");
    } catch (error) {
      console.error("Error handling bell press:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Icon name="bell" type="font-awesome" size={24} color="#fff" />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Icon name="bell" type="font-awesome" size={24} color="#fff" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default NotificationBell;