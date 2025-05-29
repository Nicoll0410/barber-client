import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleRol = ({ visible, onClose, rol }) => {
  if (!rol) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <BlurView intensity={20} tint="light" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={18} color="#333" />
              <Text style={styles.value}>{rol.nombre}</Text>
            </View>

            {/* Descripción */}
            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.valueBold}>{rol.descripcion}</Text>

            {/* Usuarios Asociados */}
            <Text style={styles.label}>Usuarios Asociados</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{rol.usuariosAsociados || 0}</Text>
            </View>

            {/* Permisos */}
            <Text style={styles.label}>Permisos</Text>
            <View style={styles.permisosContainer}>
              {rol.permisos?.map((permiso, index) => (
                <View key={index} style={styles.permisoItem}>
                  <MaterialIcons name="lock-outline" size={16} color="#fff" />
                  <Text style={styles.permisoText}>{permiso}</Text>
                </View>
              ))}
            </View>

            {/* Botón Cerrar */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

export default DetalleRol;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '40%',
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginLeft: 6,
  },
  valueBold: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  permisosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  permisoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    margin: 4,
  },
  permisoText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: '500',
  },
});