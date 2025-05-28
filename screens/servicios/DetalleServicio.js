import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DetalleServicio = ({ visible, onClose, servicio }) => {
  if (!visible || !servicio) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{servicio.nombre}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              {/* Sección de Descripción */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>
                  {servicio.descripcion || 'No hay descripción disponible'}
                </Text>
              </View>

              {/* Detalles de Duración y Precio */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duración</Text>
                  <Text style={styles.detailValue}>
                    {servicio.duracion || 'No especificada'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Precio</Text>
                  <Text style={[styles.detailValue, styles.priceText]}>
                    {servicio.precio || 'No especificado'}
                  </Text>
                </View>
              </View>

              {/* Sección de Insumos - Verificación mejorada */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Insumos utilizados</Text>
                
                {servicio.insumos && servicio.insumos.length > 0 ? (
                  <>
                    <View style={styles.insumosHeader}>
                      <Text style={styles.insumoHeaderText}>Nombre</Text>
                      <Text style={styles.insumoHeaderText}>Cantidad</Text>
                    </View>
                    
                    {servicio.insumos.map((insumo, index) => (
                      <View key={`insumo-${index}`} style={styles.insumoRow}>
                        <Text style={styles.insumoName}>
                          {insumo.nombre || 'Insumo sin nombre'}
                        </Text>
                        <Text style={styles.insumoQuantity}>
                          {insumo.cantidad || '0'}
                        </Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noInsumosText}>No se registraron insumos</Text>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    width: '40%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  contentContainer: {
    paddingVertical: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  priceText: {
    color: '#10b981',
    fontWeight: '600',
  },
  insumosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  insumoHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
  insumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insumoName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  insumoQuantity: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  noInsumosText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
});

export default DetalleServicio;