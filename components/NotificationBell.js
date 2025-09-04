import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { AuthContext } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
  const { unreadCount, fetchNotifications } = useAuth();
  const { socket } = useContext(AuthContext);
  const [badgeVersion, setBadgeVersion] = useState(0);

  // Escuchar actualizaciones de badge en tiempo real
  useEffect(() => {
    if (socket) {
      const handleActualizarBadge = (data) => {
        console.log("🔄 NotificationBell - Actualización recibida");
        
        // Verificar si es para este usuario o broadcast general
        const currentUserId = authState.user?.userId || authState.user?.id;
        if (!data.usuarioID || data.usuarioID === currentUserId) {
          console.log("🎯 Actualizando badge inmediatamente");
          setBadgeVersion(prev => prev + 1);
          fetchNotifications(); // Actualizar contador
        }
      };

      socket.on('actualizar_badge', handleActualizarBadge);

      return () => {
        socket.off('actualizar_badge', handleActualizarBadge);
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
      key={badgeVersion} // 🔥 Forzar re-render cuando cambie
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