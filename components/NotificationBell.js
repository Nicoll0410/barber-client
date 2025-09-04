import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
  const { unreadCount, fetchNotifications, socket } = useAuth();

  useEffect(() => {
    if (socket) {
      const handleBadge = async (payload) => {
        console.log("🔄 Actualización de badge recibida:", payload);
        // Pedimos conteo actualizado desde el servidor (seguro)
        if (fetchNotifications) {
          await fetchNotifications();
        }
      };

      socket.on('badge_update', handleBadge);
      socket.on('actualizar_badge', handleBadge); // por compatibilidad si tu backend usa este evento

      return () => {
        socket.off('badge_update', handleBadge);
        socket.off('actualizar_badge', handleBadge);
      };
    }
  }, [socket]);

  const handlePress = async () => {
    if (fetchNotifications) await fetchNotifications();
    navigation.navigate('Notificaciones');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
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