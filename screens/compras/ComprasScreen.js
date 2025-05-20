import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ComprasScreen = () => {
  const compras = [
    { id: 1, fecha: '2023-03-14', metodo: 'Transferencia', proveedor: 'Distribuidora SunTibdo', total: 1250000, estado: 'confirmado' },
    { id: 2, fecha: '2023-03-09', metodo: 'Efectivo', proveedor: 'Belissa Total SAS', total: 780000, estado: 'confirmado' },
    { id: 3, fecha: '2023-03-04', metodo: 'Tarjeta crédito', proveedor: 'Importaciones Estética', total: 920000, estado: 'anulado' },
    { id: 4, fecha: '2023-04-27', metodo: 'Transferencia', proveedor: 'Distribuidora SunTibdo', total: 1560000, estado: 'confirmado' }
  ];

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatearMoneda = (valor) => {
    return `$ ${valor.toLocaleString('es-CO')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Compras ({compras.length})</Text>
        <TouchableOpacity style={styles.botonCrear}>
          <MaterialIcons name="add" size={20} color="#4CAF50" />
          <Text style={styles.textoBotonCrear}>Nueva Compra</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buscador}>
        <Text style={styles.textoBuscador}>Buscar compras por proveedor, método o fecha</Text>
      </View>

      <ScrollView horizontal={false} style={styles.scrollContainer}>
        <View style={styles.tabla}>
          {/* Encabezados */}
          <View style={styles.filaEncabezado}>
            <View style={styles.columnaFecha}><Text style={styles.textoEncabezado}>Fecha</Text></View>
            <View style={styles.columnaMetodo}><Text style={styles.textoEncabezado}>Método</Text></View>
            <View style={styles.columnaProveedor}><Text style={styles.textoEncabezado}>Proveedor</Text></View>
            <View style={styles.columnaTotal}><Text style={styles.textoEncabezado}>Total</Text></View>
            <View style={styles.columnaEstado}><Text style={styles.textoEncabezado}>Estado</Text></View>
            <View style={styles.columnaAcciones}><Text style={styles.textoEncabezado}>Acciones</Text></View>
          </View>

          {/* Filas */}
          {compras.map((item) => (
            <View key={item.id} style={styles.fila}>
              <View style={styles.columnaFecha}>
                <Text style={styles.textoDato}>{formatearFecha(item.fecha)}</Text>
              </View>
              <View style={styles.columnaMetodo}>
                <Text style={styles.textoDato}>{item.metodo}</Text>
              </View>
              <View style={styles.columnaProveedor}>
                <Text style={styles.textoDato}>{item.proveedor}</Text>
              </View>
              <View style={styles.columnaTotal}>
                <Text style={styles.textoDato}>{formatearMoneda(item.total)}</Text>
              </View>
              <View style={styles.columnaEstado}>
                <View style={[
                  styles.estado,
                  item.estado === 'confirmado' ? styles.estadoConfirmado : styles.estadoAnulado
                ]}>
                  {item.estado === 'confirmado' ? (
                    <>
                      <AntDesign name="check" size={14} color="#2e7d32" />
                      <Text style={styles.textoEstado}>Confirmado</Text>
                    </>
                  ) : (
                    <>
                      <AntDesign name="close" size={14} color="#d32f2f" />
                      <Text style={styles.textoEstado}>Anulado</Text>
                    </>
                  )}
                </View>
              </View>
              <View style={styles.columnaAcciones}>
                <View style={styles.contenedorAcciones}>
                  <View style={styles.iconoOjoContainer}>
                    <TouchableOpacity style={styles.botonAccion}>
                      <FontAwesome name="eye" size={16} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                  {item.estado === 'confirmado' && (
                    <View style={styles.iconoBasuraContainer}>
                      <TouchableOpacity style={styles.botonAccion}>
                        <FontAwesome name="trash" size={16} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  botonCrear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  textoBotonCrear: {
    marginLeft: 8,
    color: '#2e7d32',
    fontWeight: '500',
  },
  buscador: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  textoBuscador: {
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  tabla: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  filaEncabezado: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  textoEncabezado: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  textoDato: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  columnaFecha: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnaMetodo: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnaProveedor: {
    width: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnaTotal: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnaEstado: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnaAcciones: {
    width: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  iconoOjoContainer: {
    width: 40, // Ancho fijo para mantener alineación
    alignItems: 'center',
  },
  iconoBasuraContainer: {
    width: 40, // Ancho fijo para mantener alineación
    alignItems: 'center',
  },
  botonAccion: {
    padding: 6,
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  estadoConfirmado: {
    backgroundColor: '#e8f5e9',
  },
  estadoAnulado: {
    backgroundColor: '#ffebee',
  },
  textoEstado: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ComprasScreen;