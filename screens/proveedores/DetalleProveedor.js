import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const DetalleProveedor = ({ visible, onClose, proveedor }) => {
  if (!proveedor) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>Información del Proveedor</Text>
            
            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
            >
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Tipo de Proveedor</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.tipo || 'Persona'}</Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Tipo de Documento</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {proveedor.tipoDocumento === 'CC' ? 'Cédula de ciudadanía' : 
                   proveedor.tipoDocumento === 'CE' ? 'Cédula de extranjería' : 
                   proveedor.tipoDocumento === 'NIT' ? 'NIT' : 'No especificado'}
                </Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Identificación</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.identificacion || 'No registrada'}</Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Nombre</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.nombre || 'No registrado'}</Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Teléfono</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.telefono || 'No registrado'}</Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Email</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.email || 'No registrado'}</Text>
              </View>

              {proveedor.tipo === 'Empresa' && (
                <View style={[styles.item, isMobile && styles.itemMobile]}>
                  <Text style={[styles.label, isMobile && styles.labelMobile]}>Persona de Contacto</Text>
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.personaContacto || 'No registrada'}</Text>
                </View>
              )}

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Fecha de Creación</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.fechaCreacion || 'No registrada'}</Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Fecha de Actualización</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>{proveedor.fechaActualizacion || 'No registrada'}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.cerrar, isMobile && styles.cerrarMobile]} 
              onPress={onClose}
            >
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
    padding: isMobile ? 20 : 0,
  },
  modal: {
    width: isMobile ? '100%' : '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isMobile ? 24 : 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: isMobile ? height * 0.8 : '80%',
  },
  modalMobile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  scrollContentMobile: {
    paddingBottom: 20,
  },
  titulo: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: 'bold',
    marginBottom: isMobile ? 16 : 20,
    textAlign: 'center',
    color: '#424242',
  },
  tituloMobile: {
    fontSize: 22,
  },
  item: {
    marginBottom: isMobile ? 16 : 14,
  },
  itemMobile: {
    marginBottom: 18,
  },
  label: {
    fontSize: isMobile ? 15 : 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: isMobile ? 6 : 4,
  },
  labelMobile: {
    fontSize: 16,
  },
  value: {
    fontSize: isMobile ? 16 : 16,
    color: '#222',
    fontWeight: isMobile ? '500' : '400',
    paddingLeft: isMobile ? 8 : 0,
  },
  valueMobile: {
    fontSize: 17,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cerrar: {
    marginTop: isMobile ? 24 : 20,
    alignSelf: 'center',
    paddingHorizontal: isMobile ? 40 : 30,
    paddingVertical: isMobile ? 12 : 10,
    backgroundColor: '#424242',
    borderRadius: 15,
    width: isMobile ? '60%' : undefined,
    alignItems: 'center',
  },
  cerrarMobile: {
    marginTop: 20,
  },
  textoCerrar: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: isMobile ? 16 : 14,
  },
});

export default DetalleProveedor;