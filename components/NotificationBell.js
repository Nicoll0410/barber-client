import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';

const NotificationBell = ({ navigation }) => {
    const { 
        unreadCount,
        playNotificationSound,
        fetchNotifications
    } = useContext(AuthContext);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar notificaciones al montar
        fetchNotifications();
        
        // Configurar intervalo de actualización
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // Actualizar cada 30 segundos

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handlePress = async () => {
        try {
            setLoading(true);
            await playNotificationSound();
            navigation.navigate('Notificaciones');
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir las notificaciones');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity 
            onPress={handlePress} 
            style={styles.container}
            disabled={loading}
        >
            <Icon 
                name="bell" 
                type="font-awesome" 
                size={24} 
                color="#fff" 
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
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default NotificationBell;