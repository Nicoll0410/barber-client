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
      <View style={StyleSheet.absoluteFill}>
        <BlurView
          intensity={20}
          tint="default"
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              <Text style={styles.titulo}>Detalles de la compra</Text>
              
              <View style={styles.infoContainer}>
                <View style={styles.item}>
                  <Text style={styles.label}>Fecha de Compra</Text>
                  <Text style={styles.value}>{formatearFecha(compra.fecha)}</Text>
                </View>
                
                <View style={styles.item}>
                  <Text style={styles.label}>Costo Total</Text>
                  <Text style={styles.value}>{formatearMoneda(compra.costoTotal)}</Text>
                </View>
                
                <View style={styles.item}>
                  <Text style={styles.label}>Método de Pago</Text>
                  <Text style={styles.value}>
                    {compra.metodoPago === 'efectivo' ? 'Efectivo' : 
                     compra.metodoPago === 'transferencia' ? 'Transferencia' : 
                     compra.metodoPago === 'tarjeta credito' ? 'Tarjeta Crédito' : 
                     compra.metodoPago}
                  </Text>
                </View>
                
                <View style={styles.item}>
                  <Text style={styles.label}>Proveedor</Text>
                  <Text style={styles.value}>{compra.proveedor}</Text>
                </View>
                
                <View style={styles.item}>
                  <Text style={styles.label}>Estado</Text>
                  <View style={[
                    styles.estadoContainerCompact,
                    compra.estado === 'confirmado' ? styles.verificado : styles.noVerificado
                  ]}>
                    {compra.estado === 'confirmado' ? (
                      <>
                        <MaterialIcons name="check-circle" size={16} color="#2e7d32" />
                        <Text style={[styles.estadoTexto, styles.textoVerificado]}>Confirmada</Text>
                      </>
                    ) : (
                      <>
                        <MaterialIcons name="cancel" size={16} color="#d32f2f" />
                        <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>Anulada</Text>
                      </>
                    )}
                  </View>
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
                style={styles.cerrar}
                onPress={onClose}
              >
                <Text style={styles.textoCerrar}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: '90%',
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
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
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
  estadoContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
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
    fontSize: 14,
  },
  textoVerificado: {
    color: '#2e7d32',
  },
  textoNoVerificado: {
    color: '#d32f2f',
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

export default DetalleCompra;