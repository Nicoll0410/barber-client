import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const DetalleServicio = ({ visible, onClose, servicio }) => {
  if (!visible || !servicio) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>{servicio.nombre}</Text>
            
            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
              showsVerticalScrollIndicator={false}
            >
              {/* Sección de Descripción */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Descripción</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {servicio.descripcion || 'No hay descripción disponible'}
                </Text>
              </View>

              {/* Detalles de Duración y Precio */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Duración</Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {servicio.duracion || 'No especificada'}
                </Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Precio</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {servicio.precio || 'No especificado'}
                  </Text>
                </View>
              </View>

              {/* Sección de Insumos */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Insumos utilizados</Text>
                
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
                        <View style={styles.quantityContainer}>
                          <Text style={styles.insumoQuantity}>
                            {insumo.cantidad || '0'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noInsumosText}>No se registraron insumos</Text>
                )}
              </View>
            </ScrollView>

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
    width: isMobile ? '100%' : '40%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isMobile ? 24 : 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: isMobile ? height * 0.8 : '80%',
  },
  modalMobile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  scrollContentMobile: {
    paddingBottom: 20,
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
    lineHeight: 20,
  },
  valueMobile: {
    fontSize: 17,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  priceText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: isMobile ? 16 : 15,
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
  insumosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  insumoHeaderText: {
    fontSize: isMobile ? 13 : 12,
    fontWeight: '600',
    color: 'black',
    flex: 1,
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
    fontSize: isMobile ? 14 : 13,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  quantityContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 3,
  },
  insumoQuantity: {
    fontSize: isMobile ? 14 : 13,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
  },
  noInsumosText: {
    fontSize: isMobile ? 14 : 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
});

export default DetalleServicio;