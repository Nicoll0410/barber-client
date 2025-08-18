import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getNotifications, markAllAsRead } from "../../utils/notifications";

const NotificacionesScreen = ({ navigation }) => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!isLoggedIn || !user?.token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications(user.token);
      setNotifications(data);
      
      // Marcar como leídas solo si hay notificaciones no leídas
      if (data.some(n => !n.leido)) {
        await markAllAsRead(user.token);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("No se pudieron cargar las notificaciones");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.token]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.notificationItem,
      !item.leido && styles.unreadNotification
    ]}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.body}>{item.cuerpo}</Text>
      <Text style={styles.date}>
        {format(new Date(item.createdAt), "PPpp", { locale: es })}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  notificationItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  body: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default NotificacionesScreen;