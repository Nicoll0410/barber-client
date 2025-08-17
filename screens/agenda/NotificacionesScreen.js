import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificacionesScreen = () => {
    const {
        notifications,
        fetchNotifications,
        markNotificationsAsRead,
        unreadCount
    } = useContext(AuthContext);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
        try {
            console.log('Pantalla de notificaciones enfocada, actualizando...');
            await fetchNotifications();
            if (authState.unreadCount > 0) {
                await markNotificationsAsRead();
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    });

    // Cargar notificaciones al montar
    const loadInitialData = async () => {
        try {
            setLoading(true);
            await fetchNotifications();
        } catch (error) {
            console.error("Error inicial al cargar notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    loadInitialData();

    return unsubscribe;
}, [navigation, fetchNotifications, markNotificationsAsRead, authState.unreadCount]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchNotifications();
        } catch (error) {
            Alert.alert(
                "Error",
                error.response?.data?.message || "Error al actualizar notificaciones"
            );
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.body}>{item.cuerpo}</Text>
            <Text style={styles.date}>
                {format(new Date(item.createdAt), 'PPpp', { locale: es })}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay notificaciones</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
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
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    body: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    date: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
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