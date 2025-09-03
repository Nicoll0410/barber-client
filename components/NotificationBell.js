import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
  const { unreadCount, fetchNotifications, socket } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Escuchar notificaciones en tiempo real y forzar actualización
  useEffect(() => {
    if (socket) {
      const handleNuevaNotificacion = () => {
        console.log("🔄 Notificación recibida - Forzando actualización de badge");
        fetchNotifications();
        setForceUpdate(prev => prev + 1); // Forzar re-render
      };

      socket.on('nueva_notificacion', handleNuevaNotificacion);

      return () => {
        socket.off('nueva_notificacion', handleNuevaNotificacion);
      };
    }
  }, [socket, fetchNotifications]);

  const handlePress = async () => {
    await fetchNotifications();
    navigation.navigate('Notificaciones');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
      key={forceUpdate} // 🔥 Forzar re-render cuando cambie
    >
      <Ionicons name="notifications-outline" size={26} color="black" />
      {unreadCount > 0 && (
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