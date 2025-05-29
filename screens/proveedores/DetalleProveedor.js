import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleProveedor = ({ visible, onClose, proveedor }) => {
  if (!proveedor) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Proveedor</Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Tipo De Proveedor</Text>
              <Text style={styles.detailValue}>{proveedor.tipo || 'Persona'}</Text>
              
              <Text style={styles.detailLabel}>Tipo De Documento</Text>
              <Text style={styles.detailValue}>
                {proveedor.tipoDocumento === 'CC' ? 'Cédula de ciudadanía' : 
                 proveedor.tipoDocumento === 'CE' ? 'Cédula de extranjería' : 'NIT'}
              </Text>
              
              <Text style={styles.detailLabel}>Identificación</Text>
              <Text style={styles.detailValue}>{proveedor.identificacion || 'N/A'}</Text>
              
              <Text style={styles.detailLabel}>Nombre</Text>
              <Text style={styles.detailValue}>{proveedor.nombre || 'N/A'}</Text>
              
              <Text style={styles.detailLabel}>Teléfono</Text>
              <Text style={styles.detailValue}>{proveedor.telefono || 'N/A'}</Text>
              
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{proveedor.email || 'N/A'}</Text>
              
              {proveedor.tipo === 'Empresa' && (
                <>
                  <Text style={styles.detailLabel}>Persona De Contacto</Text>
                  <Text style={styles.detailValue}>{proveedor.personaContacto || 'N/A'}</Text>
                </>
              )}
              
              <Text style={styles.detailLabel}>Fecha De Creación</Text>
              <Text style={styles.detailValue}>{proveedor.fechaCreacion || 'N/A'}</Text>
              
              <Text style={styles.detailLabel}>Fecha De Última Actualización</Text>
              <Text style={styles.detailValue}>{proveedor.fechaActualizacion || 'N/A'}</Text>
            </View>
            
            <View style={styles.separator} />
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '40%',
    minWidth: 300, // Mantenemos un mínimo para buena legibilidad
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  closeButton: {
    backgroundColor: '#424242',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    width: '50%', // Hacemos el botón más angosto
    alignSelf: 'center', // Centramos el botón
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default DetalleProveedor;