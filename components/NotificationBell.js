import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
  const { unreadCount, fetchNotifications, socket } = useAuth();
  const [badgeVisible, setBadgeVisible] = useState(unreadCount > 0);

  useEffect(() => {
    setBadgeVisible(unreadCount > 0);
  }, [unreadCount]);

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    if (socket) {
      const handleNuevaNotificacion = () => {
        // Forzar actualización del contador
        fetchNotifications();
      };

      socket.on('nueva_notificacion', handleNuevaNotificacion);

      return () => {
        socket.off('nueva_notificacion', handleNuevaNotificacion);
      };
    }
  }, [socket, fetchNotifications]);

  const handlePress = async () => {
    try {
      await fetchNotifications();
      navigation.navigate('Notificaciones');
    } catch (error) {
      console.error('Error navegando a notificaciones:', error);
      navigation.navigate('Notificaciones');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
    >
      <Ionicons name="notifications-outline" size={26} color="black" />
      {badgeVisible && unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginRight: 15, 
    position: 'relative',
    padding: 5
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },
  badgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold',
    paddingHorizontal: 4
  }
});

export default NotificationBell;