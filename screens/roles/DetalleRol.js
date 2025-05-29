import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleRol = ({ visible, onClose, rol }) => {
  if (!rol) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Información del Rol</Text>
            
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              <View style={styles.item}>
                <Text style={styles.label}>Nombre</Text>
                <View style={styles.row}>
                  <Ionicons name="person-circle-outline" size={18} color="#333" />
                  <Text style={styles.value}>{rol.nombre}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Descripción</Text>
                <Text style={[styles.value, styles.valueBold]}>{rol.descripcion}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Usuarios Asociados</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{rol.usuariosAsociados || 0}</Text>
                </View>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Permisos</Text>
                <View style={styles.permisosContainer}>
                  {rol.permisos?.map((permiso, index) => (
                    <View key={index} style={styles.permisoItem}>
                      <MaterialIcons name="lock-outline" size={16} color="#fff" />
                      <Text style={styles.permisoText}>{permiso}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.cerrar} onPress={onClose}>
              <Text style={styles.textoCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: '80%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  valueBold: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  permisosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permisoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  permisoText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  cerrar: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#424242',
    borderRadius: 15,
  },
  textoCerrar: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DetalleRol;