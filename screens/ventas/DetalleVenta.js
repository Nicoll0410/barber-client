import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const DetalleVenta = ({ visible, onClose, venta }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Detalle de la Venta</Text>
            
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              {/* Encabezado del servicio */}
              <View style={styles.item}>
                <Text style={styles.label}>Servicio</Text>
                <Text style={[styles.value, { fontWeight: '600' }]}>Masaje con crema de coco</Text>
                <Text style={[styles.value, { fontSize: 14, color: '#777' }]}>masajedfgdfgdfg</Text>
              </View>

              {/* Detalles de fecha y hora */}
              <View style={styles.item}>
                <Text style={styles.label}>Fecha y Hora</Text>
                <View style={styles.detailRow}>
                  <MaterialIcons name="date-range" size={16} color="#555" style={styles.icono} />
                  <Text style={styles.value}>10 de septiembre de 2024</Text>
                </View>
                <View style={styles.detailRow}>
                  <FontAwesome name="clock-o" size={16} color="#555" style={styles.icono} />
                  <Text style={styles.value}>08:00 a.m. - 08:30 a.m. (30 minutos de duración)</Text>
                </View>
              </View>

              {/* Precio */}
              <View style={styles.item}>
                <Text style={styles.label}>Precio</Text>
                <View style={styles.precioContainer}>
                  <Text style={styles.precio}>$ 14.000.000</Text>
                </View>
              </View>

              {/* Información del profesional y paciente */}
              <View style={styles.item}>
                <Text style={styles.label}>Participantes</Text>
                <View style={styles.participantesContainer}>
                  <View style={styles.participante}>
                    <View style={[styles.avatar, styles.avatarPaciente]}>
                      <Text style={styles.avatarText}>A</Text>
                    </View>
                    <Text style={styles.participanteNombre}>Paciente</Text>
                  </View>
                  
                  <View style={styles.participante}>
                    <Text style={styles.participanteNombre}>Martha Cosmetólogo</Text>
                    <View style={[styles.avatar, styles.avatarProfesional]}>
                      <Text style={styles.avatarText}>M</Text>
                    </View>
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
  },
  modal: {
    width: width * 0.4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: '80%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10,
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
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icono: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  precioContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  participantesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  participante: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participanteNombre: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPaciente: {
    backgroundColor: '#2196F3',
  },
  avatarProfesional: {
    backgroundColor: '#FF9800',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
});

export default DetalleVenta;