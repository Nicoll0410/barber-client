import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleCita = ({ visible, onClose, cita }) => {
  // Función para obtener los estilos según el estado
  const getStatusStyles = (status) => {
    if (!status) return { backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#000' };
    
    switch (status.toLowerCase()) {
      case 'pendiente':
        return { backgroundColor: 'rgba(206, 209, 0, 0.2)', color: '#ced100' };
      case 'expirada':
        return { backgroundColor: 'rgba(130, 23, 23, 0.2)', color: '#821717' };
      case 'cancelada':
        return { backgroundColor: 'rgba(234, 22, 1, 0.2)', color: '#EA1601' };
      case 'completa':
        return { backgroundColor: 'rgba(3, 155, 23, 0.2)', color: '#039B17' };
      default:
        return { backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#000' };
    }
  };

  const statusStyles = getStatusStyles(cita?.estado);

  if (!cita) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de la Cita</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Sección de Servicio */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Servicio</Text>
            <Text style={styles.serviceName}>{cita.servicio?.nombre || 'No especificado'}</Text>
          </View>

          {/* Estado de la cita */}
          <View style={[styles.statusContainer, { backgroundColor: statusStyles.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyles.color }]}>
              {cita.estado || 'Sin estado'}
            </Text>
          </View>

          {/* Sección de Fecha y Hora */}
          <View style={styles.timeDateContainer}>
            <View style={styles.timeDateRow}>
              <Feather name="calendar" size={20} color="#555" />
              <Text style={styles.timeDateText}>{cita.fechaFormateada}</Text>
            </View>
            <View style={styles.timeDateRow}>
              <Feather name="clock" size={20} color="#555" />
              <Text style={styles.timeDateText}>{cita.hora}</Text>
            </View>
            <View style={styles.timeDateRow}>
              <Feather name="watch" size={20} color="#555" />
              <Text style={styles.timeDateText}>
                {cita.servicio?.duracionMaxima || 'Duración no especificada'}
              </Text>
            </View>
          </View>

          {/* Sección de Barbero y Cliente */}
          <View style={styles.peopleContainer}>
            {/* Barbero */}
            <View style={styles.personCard}>
              <Text style={styles.personName}>{cita.barbero?.nombre || 'Barbero no asignado'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Barbero</Text>
              </View>
            </View>

            {/* Cliente */}
            <View style={styles.personCard}>
              <Text style={styles.personName}>{cita.cliente?.nombre || 'Cliente no especificado'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Cliente</Text>
              </View>
            </View>
          </View>

          {cita.estado === 'Cancelada' && cita.razonCancelacion && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Razón de cancelación</Text>
              <Text style={styles.serviceDescription}>{cita.razonCancelacion}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
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
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    borderWidth: 1,
    borderColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  timeDateContainer: {
    marginBottom: 15,
  },
  timeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeDateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  peopleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  personCard: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  personName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 12,
    color: '#555',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#424242',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetalleCita;