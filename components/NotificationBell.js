import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
  const { unreadCount, fetchNotifications, socket } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    if (socket) {
      const handleNuevaNotificacion = () => {
        console.log("🔄 Actualizando notificaciones por socket");
        fetchNotifications();
      };

      socket.on('nueva_notificacion', handleNuevaNotificacion);

      return () => {
        socket.off('nueva_notificacion', handleNuevaNotificacion);
      };
    }
  }, [socket, fetchNotifications]);

  const handlePress = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await fetchNotifications();
      navigation.navigate('Notificaciones');
    } catch (error) {
      console.error('Error:', error);
      navigation.navigate('Notificaciones');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
      disabled={isUpdating}
    >
      <Ionicons 
        name="notifications-outline" 
        size={26} 
        color="black" 
      />
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