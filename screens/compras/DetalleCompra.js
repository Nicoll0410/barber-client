import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  FlatList,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const DetalleCompra = ({ visible, onClose, compra }) => {
  if (!compra) return null;

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor || 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.detalleItem}>
      <View style={styles.detalleRow}>
        <MaterialIcons name="bookmark" size={20} color="#4CAF50" />
        <Text style={styles.detalleLabel}>Insumo</Text>
        <Text style={styles.detalleValue}>{item.nombre}</Text>
      </View>
      
      <View style={styles.detalleRow}>
        <MaterialIcons name="format-list-numbered" size={20} color="#2196F3" />
        <Text style={styles.detalleLabel}>Cantidad</Text>
        <Text style={styles.detalleValue}>{item.cantidad}</Text>
      </View>
      
      <View style={styles.detalleRow}>
        <MaterialIcons name="attach-money" size={20} color="#FF9800" />
        <Text style={styles.detalleLabel}>Precio Unitario</Text>
        <Text style={styles.detalleValue}>{formatearMoneda(item.precioUnitario)}</Text>
      </View>
      
      <View style={styles.separador} />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={50}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.titulo}>Detalles de la compra</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MaterialIcons name="date-range" size={20} color="#666" />
                <Text style={styles.infoLabel}>Fecha de Compra</Text>
                <Text style={styles.infoValue}>{formatearFecha(compra.fecha)}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="monetization-on" size={20} color="#666" />
                <Text style={styles.infoLabel}>Costo Total</Text>
                <Text style={styles.infoValue}>{formatearMoneda(compra.costoTotal)}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="payment" size={20} color="#666" />
                <Text style={styles.infoLabel}>Método de Pago</Text>
                <Text style={styles.infoValue}>
                  {compra.metodoPago === 'efectivo' ? 'Efectivo' : 
                   compra.metodoPago === 'transferencia' ? 'Transferencia' : 
                   compra.metodoPago === 'tarjeta credito' ? 'Tarjeta Crédito' : 
                   compra.metodoPago}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="store" size={20} color="#666" />
                <Text style={styles.infoLabel}>Proveedor</Text>
                <Text style={styles.infoValue}>{compra.proveedor}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons 
                  name={compra.estado === 'confirmado' ? 'check-circle' : 'cancel'} 
                  size={20} 
                  color={compra.estado === 'confirmado' ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.infoLabel}>Estado</Text>
                <Text style={[
                  styles.infoValue,
                  compra.estado === 'confirmado' ? styles.estadoConfirmado : styles.estadoAnulado
                ]}>
                  {compra.estado === 'confirmado' ? 'Confirmada' : 'Anulada'}
                </Text>
              </View>
            </View>
            
            <View style={styles.separadorGrande} />
            
            <Text style={styles.subtitulo}>Detalles de los productos</Text>
            
            <FlatList
              data={compra.productos || []}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
            
            <TouchableOpacity 
              style={styles.botonCerrar}
              onPress={onClose}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10,
  },
  scrollContent: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
    marginRight: 5,
    width: 120,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    flex: 1,
  },
  estadoConfirmado: {
    color: '#4CAF50',
  },
  estadoAnulado: {
    color: '#F44336',
  },
  separador: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  separadorGrande: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
  },
  detalleItem: {
    marginBottom: 10,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detalleLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginRight: 5,
    width: 120,
  },
  detalleValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    flex: 1,
  },
  botonCerrar: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonCerrar: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default DetalleCompra;