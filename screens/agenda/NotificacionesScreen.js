import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificacionesScreen = () => {
  const {
    authState = {}, // Valor por defecto para evitar undefined
    notifications = [],
    fetchNotifications,
    markNotificationsAsRead
  } = useContext(AuthContext) || {}; // Protección contra contexto no disponible

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          await fetchNotifications();
          
          // Verificar si authState existe antes de acceder a unreadCount
          if (authState?.unreadCount > 0) {
            await markNotificationsAsRead();
          }
        } catch (error) {
          console.error("Error al cargar notificaciones:", error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
      
      return () => {
        // Limpieza si es necesaria
      };
    }, [fetchNotifications, markNotificationsAsRead, authState?.unreadCount]) // Uso opcional chaining
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNotifications();
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.body}>{item.cuerpo}</Text>
      <Text style={styles.date}>
        {format(new Date(item.createdAt), 'PPpp', { locale: es })}
      </Text>
      {!item.leido && <View style={styles.unreadDot} />}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Protección contra id undefined
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
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
    backgroundColor: '#f5f5f5',
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  body: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificacionesScreen;