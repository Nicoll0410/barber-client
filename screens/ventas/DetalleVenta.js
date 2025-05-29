import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DetalleVenta = ({ visible, onClose, venta }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Encabezado del modal */}
          <View style={styles.header}>
            <Text style={styles.tituloServicio}>Masaje con crema de coco</Text>
            <Text style={styles.descripcionServicio}>masajedfgdfgdfg</Text>
          </View>

          {/* Detalles de la venta */}
          <View style={styles.detalleContainer}>
            <View style={styles.itemDetalle}>
              <MaterialIcons name="date-range" size={16} color="#555" style={styles.icono} />
              <Text style={styles.textoDetalle}>10 de septiembre de 2024</Text>
            </View>

            <View style={styles.itemDetalle}>
              <FontAwesome name="clock-o" size={16} color="#555" style={styles.icono} />
              <Text style={styles.textoDetalle}>08:00 a.m. - 08:30 a.m. (30 minutos de duración)</Text>
            </View>

            <View style={styles.precioWrapper}>
              <View style={styles.precioContainer}>
                <Text style={styles.precio}>$ 14.000.000</Text>
              </View>
            </View>
          </View>

          {/* Información del profesional y paciente */}
          <View style={styles.infoContainer}>
            <View style={styles.clienteContainer}>
              <View style={styles.avatarCliente}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <Text style={styles.nombrePaciente}>Paciente</Text>
            </View>
            
            <View style={styles.barberoContainer}>
              <Text style={styles.nombreProfesional}>Martha Cosmetólogo</Text>
              <View style={styles.avatarBarbero}>
                <Text style={styles.avatarText}>M</Text>
              </View>
            </View>
          </View>

          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.botonCerrar} onPress={onClose}>
            <Text style={styles.textoBotonCerrar}>Cerrar</Text>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: width * 0.4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  tituloServicio: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  descripcionServicio: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },
  detalleContainer: {
    marginBottom: 16,
  },
  itemDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  textoDetalle: {
    fontSize: 14,
    flex: 1,
    color: '#444',
  },
  precioWrapper: {
    flexDirection: 'row',
    marginTop: 8,
  },
  precioContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start', // Esto hace que el contenedor se ajuste al contenido
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nombreProfesional: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  nombrePaciente: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  avatarCliente: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBarbero: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botonCerrar: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textoBotonCerrar: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default DetalleVenta;