import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const DetalleInsumo = ({ visible, onClose, insumo }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalles del Insumo</Text>
          
          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{insumo?.nombre || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Descripción</Text>
              <Text style={styles.value}>{insumo?.descripcion || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Cantidad</Text>
              <Text style={styles.value}>{insumo?.cantidad || '0'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Categoría</Text>
              <Text style={styles.value}>{insumo?.categoria || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Unidad De Medida</Text>
              <Text style={styles.value}>{insumo?.unidadMedida || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha De Creación</Text>
              <Text style={styles.value}>{formatDate(insumo?.fechaCreacion)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha De Actualización</Text>
              <Text style={styles.value}>{formatDate(insumo?.fechaActualizacion)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  detailContainer: {
    paddingHorizontal: 8
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  label: {
    fontWeight: '500',
    color: '#666',
    fontSize: 14,
    flex: 1
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4
  },
  closeButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15
  }
});

export default DetalleInsumo;