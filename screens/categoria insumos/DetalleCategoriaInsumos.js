import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DetalleCategoriaInsumos = ({ visible, onClose, categoria }) => {
  if (!categoria) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Detalles de la categoría</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre</Text>
              <Text style={styles.detailValue}>{categoria.nombre}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descripción</Text>
              <Text style={styles.detailValue}>{categoria.descripcion}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Insumos Asociados</Text>
              <Text style={styles.detailValue}>{categoria.insumosAsociados}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de Creación</Text>
              <Text style={styles.detailValue}>{categoria.fechaCreacion}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Última Actualización</Text>
              <Text style={styles.detailValue}>{categoria.fechaActualizacion || categoria.fechaCreacion}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeIcon: {
    padding: 4,
  },
  contentContainer: {
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  closeButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DetalleCategoriaInsumos;