import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MaterialIcons } from '@expo/vector-icons'; // Cambié Ionicons por MaterialIcons

const NotificacionesScreen = ({ navigation }) => {
  const { notifications, unreadCount, markNotificationsAsRead, fetchNotifications } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchNotifications();
      
      if (unreadCount > 0) {
        await markNotificationsAsRead();
      }
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, markNotificationsAsRead, unreadCount]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, !item.leido && styles.unreadNotification]}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.body}>{item.cuerpo}</Text>
      <Text style={styles.date}>
        {format(new Date(item.createdAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#424242" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <Text style={styles.unreadCount}>{unreadCount} sin leer</Text>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadData} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#424242"]} 
            tintColor="#424242"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333"
  },
  unreadCount: {
    fontSize: 14,
    color: "#dc3545",
    fontWeight: "600"
  },
  notificationItem: { 
    backgroundColor: "white", 
    padding: 16, 
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  unreadNotification: { 
    borderLeftWidth: 4, 
    borderLeftColor: "#007bff" 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#333" 
  },
  body: { 
    fontSize: 14, 
    marginBottom: 8, 
    color: "#555", 
    lineHeight: 20 
  },
  date: { 
    fontSize: 12, 
    color: "#888", 
    textAlign: "right" 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    marginTop: 16,
    color: "#666"
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 100 
  },
  emptyText: { 
    textAlign: "center", 
    fontSize: 16, 
    color: "#888", 
    marginTop: 16 
  },
  errorContainer: { 
    backgroundColor: '#ffe6e6', 
    padding: 16, 
    margin: 16,
    borderRadius: 8,
    alignItems: "center"
  },
  errorText: { 
    color: '#dc3545', 
    textAlign: 'center',
    marginBottom: 12
  },
  retryButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6
  },
  retryText: {
    color: "white",
    fontWeight: "600"
  }
});

export default NotificacionesScreen;