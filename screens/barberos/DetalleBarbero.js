import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleBarbero = ({ visible, onClose, barbero }) => {
  if (!barbero) return null;

  // Componente para el estado de verificación
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
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Información del Barbero</Text>
            
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
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
                <EstadoVerificacion verificado={barbero.emailVerificado} />
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
    maxHeight: '80%', // Limita la altura máxima del modal
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10, // Espacio adicional al final del scroll
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

export default DetalleBarbero;