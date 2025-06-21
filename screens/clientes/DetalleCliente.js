import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const DetalleCliente = ({ visible, onClose, cliente }) => {
  if (!cliente) return null;

  // Componente para el estado de verificación
  const EstadoVerificacion = ({ verificado }) => (
    <View style={[
      styles.estadoContainer,
      verificado ? styles.verificado : styles.noVerificado
    ]}>
      {verificado ? (
        <>
          <MaterialIcons name="verified" size={isMobile ? 18 : 20} color="#2e7d32" />
          <Text style={[styles.estadoTexto, styles.textoVerificado]}>Verificado</Text>
        </>
      ) : (
        <>
          <MaterialIcons name="warning" size={isMobile ? 18 : 20} color="#d32f2f" />
          <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>No verificado</Text>
        </>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>Información del Cliente</Text>

            <View style={[styles.item, isMobile && styles.itemMobile]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Nombre</Text>
              <Text style={[styles.value, isMobile && styles.valueMobile]}>{cliente.nombre}</Text>
            </View>

            <View style={[styles.item, isMobile && styles.itemMobile]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Teléfono</Text>
              <Text style={[styles.value, isMobile && styles.valueMobile]}>{cliente.telefono}</Text>
            </View>

            <View style={[styles.item, isMobile && styles.itemMobile]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Fecha de nacimiento</Text>
              <Text style={[styles.value, isMobile && styles.valueMobile]}>
                {cliente.fechaNacimiento || 'No registrada'}
              </Text>
            </View>

            <View style={[styles.item, isMobile && styles.itemMobile]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Email</Text>
              <Text style={[styles.value, isMobile && styles.valueMobile]}>
                {cliente.email || 'No registrado'}
              </Text>
            </View>

            <View style={[styles.item, isMobile && styles.itemMobile]}>
              <Text style={[styles.label, isMobile && styles.labelMobile]}>Verificación</Text>
              <EstadoVerificacion verificado={cliente.emailVerificado} />
            </View>

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
    maxHeight: isMobile ? height * 0.8 : undefined,
  },
  modalMobile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
  // Estilos para el estado de verificación
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isMobile ? 6 : 4,
    paddingHorizontal: isMobile ? 10 : 8,
    borderRadius: 12,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginTop: isMobile ? 6 : 4,
  },
  verificado: {
    backgroundColor: '#e8f5e9',
  },
  noVerificado: {
    backgroundColor: '#ffebee',
  },
  estadoTexto: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: isMobile ? 15 : 14,
  },
  textoVerificado: {
    color: '#2e7d32',
  },
  textoNoVerificado: {
    color: '#d32f2f',
  },
});

export default DetalleCliente;