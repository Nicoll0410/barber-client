import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import DetalleCompra from './DetalleCompra';
import CrearCompra from './CrearCompra';
import Footer from '../../components/Footer';

const ComprasScreen = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [comprasPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        fecha: '2023-03-14', 
        metodo: 'Transferencia', 
        proveedor: 'Distribuidora SunTibdo', 
        total: 1250000, 
        estado: 'confirmado' 
      },
      { 
        id: 2, 
        fecha: '2023-03-09', 
        metodo: 'Efectivo', 
        proveedor: 'Belissa Total SAS', 
        total: 780000, 
        estado: 'confirmado' 
      },
      { 
        id: 3, 
        fecha: '2023-03-04', 
        metodo: 'Tarjeta crédito', 
        proveedor: 'Importaciones Estética', 
        total: 920000, 
        estado: 'anulado' 
      },
      { 
        id: 4, 
        fecha: '2023-04-27', 
        metodo: 'Transferencia', 
        proveedor: 'Distribuidora SunTibdo', 
        total: 1560000, 
        estado: 'confirmado' 
      }
    ];
    setCompras(datosEjemplo);
    setComprasFiltradas(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setComprasFiltradas(compras);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = compras.filter(c =>
        c.proveedor.toLowerCase().includes(termino) || 
        c.metodo.toLowerCase().includes(termino) ||
        c.fecha.includes(busqueda)
      );
      setComprasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, compras]);

  const indiceInicial = (paginaActual - 1) * comprasPorPagina;
  const comprasMostrar = comprasFiltradas.slice(indiceInicial, indiceInicial + comprasPorPagina);
  const totalPaginas = Math.ceil(comprasFiltradas.length / comprasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatearMoneda = (valor) => {
    return `$ ${valor.toLocaleString('es-CO')}`;
  };

  const verCompra = (compra) => {
    setCompraSeleccionada(compra);
    setModalDetalleVisible(true);
  };

  const crearCompra = () => {
    setModalCrearVisible(true);
  };

  const handleCreateCompra = (newCompra) => {
    const newId = compras.length > 0 ? Math.max(...compras.map(c => c.id)) + 1 : 1;
    const nuevaCompra = { 
      id: newId, 
      ...newCompra,
      estado: 'confirmado' // Default status
    };
    const nuevasCompras = [...compras, nuevaCompra];
    setCompras(nuevasCompras);
    setComprasFiltradas(nuevasCompras);
    setModalCrearVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Compras</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{comprasFiltradas.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearCompra}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Nueva Compra</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar compras por proveedor, método o fecha"
        value={busqueda}
        onChangeText={(texto) => setBusqueda(texto)}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaFecha]}><Text style={styles.encabezado}>Fecha</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaMetodo]}><Text style={styles.encabezado}>Método de pago</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaProveedor]}><Text style={styles.encabezado}>Proveedor</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaTotal]}><Text style={styles.encabezado}>Total</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaEstado]}><Text style={styles.encabezado}>Estado</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={comprasMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaFecha]}>
                <Text style={[styles.textoDato, styles.textoNegrita]}>{formatearFecha(item.fecha)}</Text>
              </View>
              <View style={[styles.celda, styles.columnaMetodo]}>
                <Text style={[styles.textoDato, styles.textoNegrita]}>{item.metodo}</Text>
              </View>
              <View style={[styles.celda, styles.columnaProveedor]}>
                <Text style={[styles.textoDato, styles.textoNegrita]}>{item.proveedor}</Text>
              </View>
              <View style={[styles.celda, styles.columnaTotal]}>
                <View style={styles.totalContainer}>
                  <Text style={[styles.textoDato, styles.textoNegrita]}>{formatearMoneda(item.total)}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaEstado]}>
                <View style={[
                  styles.estadoContainer,
                  item.estado === 'confirmado' ? styles.estadoConfirmado : styles.estadoAnulado
                ]}>
                  {item.estado === 'confirmado' ? (
                    <>
                      <AntDesign name="check" size={16} color="#2e7d32" />
                      <Text style={[styles.estadoTexto, styles.textoVerificado]}>Confirmado</Text>
                    </>
                  ) : (
                    <>
                      <AntDesign name="close" size={16} color="#d32f2f" />
                      <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>Anulado</Text>
                    </>
                  )}
                </View>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verCompra(item)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  {item.estado === 'confirmado' && (
                    <TouchableOpacity style={styles.botonAccion}>
                      <Feather name="trash-2" size={20} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        cambiarPagina={cambiarPagina}
      />

      <DetalleCompra
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        compra={compraSeleccionada}
      />

      <CrearCompra
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCreate={handleCreateCompra}
      />
      <Footer />
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
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contadorContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  botonCrear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  textoBoton: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
  },
  tabla: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  filaEncabezado: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  celdaEncabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  columnaFecha: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaMetodo: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaProveedor: {
    flex: 2,
    alignItems: 'center',
  },
  columnaTotal: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaEstado: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  textoDato: {
    textAlign: 'center',
    width: '100%',
  },
  textoNegrita: {
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: 'center',
  },
  estadoConfirmado: {
    backgroundColor: '#e8f5e9',
  },
  estadoAnulado: {
    backgroundColor: '#ffebee',
  },
  estadoTexto: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textoVerificado: {
    color: '#2e7d32',
  },
  textoNoVerificado: {
    color: '#d32f2f',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
});

export default ComprasScreen;