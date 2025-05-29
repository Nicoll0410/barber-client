import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleCliente = ({ visible, onClose, cliente }) => {
  if (!cliente) return null;

  // Componente para el estado de verificación (igual que en ClientesScreen)
  const EstadoVerificacion = ({ verificado }) => (
    <View style={[
      styles.estadoContainer,
      verificado ? styles.verificado : styles.noVerificado
    ]}>
      {verificado ? (
        <>
          <MaterialIcons name="verified" size={20} color="#2e7d32" />
          <Text style={[styles.estadoTexto, styles.textoVerificado]}>Verificado</Text>
        </>
      ) : (
        <>
          <MaterialIcons name="warning" size={20} color="#d32f2f" />
          <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>No verificado</Text>
        </>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Información del Cliente</Text>

            <View style={styles.item}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{cliente.nombre}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{cliente.telefono}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <Text style={styles.value}>{cliente.fechaNacimiento || 'No registrada'}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{cliente.email || 'No registrado'}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Verificación</Text>
              <EstadoVerificacion verificado={cliente.emailVerificado} />
            </View>

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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
  textoCerrar: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Estilos para el estado de verificación (igual que en ClientesScreen)
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  verificado: {
    backgroundColor: '#e8f5e9',
  },
  noVerificado: {
    backgroundColor: '#ffebee',
  },
  estadoTexto: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  textoVerificado: {
    color: '#2e7d32',
  },
  textoNoVerificado: {
    color: '#d32f2f',
  },
});

export default DetalleCliente;