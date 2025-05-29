import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleBarbero = ({ visible, onClose, barbero }) => {
  if (!barbero) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalContent}>
                <Text style={styles.titulo}>Información del Barbero</Text>

                <View style={styles.item}>
                  <Text style={styles.label}>Nombre</Text>
                  <Text style={styles.value}>{barbero.nombre}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Cédula</Text>
                  <Text style={styles.value}>{barbero.cedula || 'No registrada'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Rol</Text>
                  <Text style={styles.value}>{barbero.rol || 'No asignado'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Teléfono</Text>
                  <Text style={styles.value}>{barbero.telefono || 'No registrado'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Dirección</Text>
                  <Text style={styles.value}>{barbero.direccion || 'No registrada'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Fecha de nacimiento</Text>
                  <Text style={styles.value}>{barbero.fechaNacimiento || 'No registrada'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Fecha de contratación</Text>
                  <Text style={styles.value}>{barbero.fechaContratacion || 'No registrada'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{barbero.email || 'No registrado'}</Text>
                </View>

                <View style={styles.item}>
                  <Text style={styles.label}>Verificación</Text>
                  <View style={[
                    styles.estadoContainer,
                    barbero.emailVerificado ? styles.verificado : styles.noVerificado
                  ]}>
                    {barbero.emailVerificado ? (
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
                </View>
              </View>
            </ScrollView>

            <View style={styles.contenedorBoton}>
              <TouchableOpacity style={styles.cerrar} onPress={onClose}>
                <Text style={styles.textoCerrar}>Cerrar</Text>
              </TouchableOpacity>
            </View>
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
    padding: 25,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 450,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 10,
  },
  scrollContent: {
    padding: 20,
  },
  modalContent: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
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
  contenedorBoton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cerrar: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textoCerrar: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
});

export default DetalleBarbero;