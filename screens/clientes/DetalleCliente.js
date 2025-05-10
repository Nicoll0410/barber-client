// components/DetalleCliente.js
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleCliente = ({ visible, onClose, cliente }) => {
  if (!cliente) return null;

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
              <View style={[
                styles.verificacionBadge,
                cliente.emailVerificado ? styles.verificado : styles.noVerificado
              ]}>
                <Text style={styles.verificacionTexto}>
                  {cliente.emailVerificado ? 'Verificado' : 'No verificado'}{' '}
                  {cliente.emailVerificado ? (
                    <AntDesign name="check" size={14} color="#fff" />
                  ) : (
                    <AntDesign name="close" size={14} color="#fff" />
                  )}
                </Text>
              </View>
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
    width: '30%', // Más angosto
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
  verificacionBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  verificacionTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  verificado: {
    backgroundColor: '#4caf50',
  },
  noVerificado: {
    backgroundColor: '#f44336',
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
});

export default DetalleCliente;
