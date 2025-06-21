import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleProveedor = ({ visible, onClose, proveedor }) => {
  if (!proveedor) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Información del Proveedor</Text>
            
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              <View style={styles.item}>
                <Text style={styles.label}>Tipo de Proveedor</Text>
                <Text style={styles.value}>{proveedor.tipo || 'Persona'}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Tipo de Documento</Text>
                <Text style={styles.value}>
                  {proveedor.tipoDocumento === 'CC' ? 'Cédula de ciudadanía' : 
                   proveedor.tipoDocumento === 'CE' ? 'Cédula de extranjería' : 
                   proveedor.tipoDocumento === 'NIT' ? 'NIT' : 'No especificado'}
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Identificación</Text>
                <Text style={styles.value}>{proveedor.identificacion || 'No registrada'}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{proveedor.nombre || 'No registrado'}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{proveedor.telefono || 'No registrado'}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{proveedor.email || 'No registrado'}</Text>
              </View>

              {proveedor.tipo === 'Empresa' && (
                <View style={styles.item}>
                  <Text style={styles.label}>Persona de Contacto</Text>
                  <Text style={styles.value}>{proveedor.personaContacto || 'No registrada'}</Text>
                </View>
              )}

              <View style={styles.item}>
                <Text style={styles.label}>Fecha de Creación</Text>
                <Text style={styles.value}>{proveedor.fechaCreacion || 'No registrada'}</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Fecha de Actualización</Text>
                <Text style={styles.value}>{proveedor.fechaActualizacion || 'No registrada'}</Text>
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

export default DetalleProveedor;