import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
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
                    styles.verificacionBadge,
                    barbero.emailVerificado ? styles.verificado : styles.noVerificado
                  ]}>
                    <Text style={styles.verificacionTexto}>
                      {barbero.emailVerificado ? 'Verificado' : 'No verificado'}{' '}
                      {barbero.emailVerificado ? (
                        <AntDesign name="check" size={16} color="#fff" />
                      ) : (
                        <AntDesign name="close" size={16} color="#fff" />
                      )}
                    </Text>
                  </View>
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
  verificacionBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 5,
  },
  verificacionTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  verificado: {
    backgroundColor: '#4caf50',
  },
  noVerificado: {
    backgroundColor: '#f44336',
  },
  cerrar: {
    padding: 14,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textoCerrar: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
});

export default DetalleBarbero;