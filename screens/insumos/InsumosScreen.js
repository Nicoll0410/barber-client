import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearInsumo from './CrearInsumo';
import DetalleInsumo from './DetalleInsumo';
import EditarInsumo from './EditarInsumo';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const InsumosScreen = ({ navigation }) => {
  const [insumos, setInsumos] = useState([]);
  const [insumosFiltrados, setInsumosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [insumosPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  useEffect(() => {
    // Datos de ejemplo
    const datosEjemplo = [
      {
        id: 1,
        nombre: 'Máquina de afeitar',
        descripcion: 'Máquina de afeitar resolución 10',
        categoria: 'Máquinas',
        unidad: 'NA',
        cantidad: 0
      },
      {
        id: 2,
        nombre: 'Shampoo',
        descripcion: 'Shampoo de coco',
        categoria: 'Cuidado cabello',
        unidad: 'ML',
        cantidad: 90
      },
      {
        id: 3,
        nombre: 'Minoxidil',
        descripcion: 'Hace crecer el cabello de manera rápida',
        categoria: 'Crecimiento',
        unidad: 'TT',
        cantidad: 400
      },
      {
        id: 4,
        nombre: 'Cera marca1',
        descripcion: 'Cera para el cabello duración extrema',
        categoria: 'Belleza',
        unidad: 'TT',
        cantidad: 25
      },
      {
        id: 5,
        nombre: 'Alcohol J&B',
        descripcion: 'Alcohol',
        categoria: 'Cuidado',
        unidad: 'ML',
        cantidad: 2
      },
    ];
    setInsumos(datosEjemplo);
    setInsumosFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setInsumosFiltrados(insumos);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = insumos.filter(i =>
        i.nombre.toLowerCase().includes(termino) ||
        i.descripcion.toLowerCase().includes(termino)
      );
      setInsumosFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, insumos]);

  const controlInsumos = () => {
    if (insumos.length === 0) {
      Alert.alert('Advertencia', 'No hay insumos para controlar');
      return;
    }
   
    navigation.navigate('ControlInsumos', {
      insumos: insumos,
      onGoBack: () => {
        console.log('Regresó de ControlInsumos');
      }
    });
  };

  const indiceInicial = (paginaActual - 1) * insumosPorPagina;
  const insumosMostrar = isMobile ? insumosFiltrados : insumosFiltrados.slice(indiceInicial, indiceInicial + insumosPorPagina);
  const totalPaginas = Math.ceil(insumosFiltrados.length / insumosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearInsumo = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateInsumo = (newInsumo) => {
    const newId = insumos.length > 0 ? Math.max(...insumos.map(i => i.id)) + 1 : 1;
    const nuevoInsumo = { id: newId, ...newInsumo };
    const nuevosInsumos = [...insumos, nuevoInsumo];
    setInsumos(nuevosInsumos);
    setInsumosFiltrados(nuevosInsumos);
    setModalVisible(false);
  };

  const verInsumo = (id) => {
    const insumo = insumos.find(i => i.id === id);
    setInsumoSeleccionado(insumo);
    setModalDetalleVisible(true);
  };

  const editarInsumo = (id) => {
    const insumo = insumos.find(i => i.id === id);
    setInsumoSeleccionado(insumo);
    setModalEditarVisible(true);
  };

  const handleUpdateInsumo = (updatedInsumo) => {
    const nuevosInsumos = insumos.map(i =>
      i.id === updatedInsumo.id ? updatedInsumo : i
    );
    setInsumos(nuevosInsumos);
    setInsumosFiltrados(nuevosInsumos);
    setModalEditarVisible(false);
  };

  const eliminarInsumo = (id) => {
    const nuevosInsumos = insumos.filter(i => i.id !== id);
    setInsumos(nuevosInsumos);
    setInsumosFiltrados(nuevosInsumos);
  };

  // Renderizado para móvil (tarjetas)
  const renderMobileItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardSubtitle}>{item.categoria}</Text>
        </View>
        <View style={styles.unidadContainer}>
          <Text style={styles.textoUnidad}>{item.unidad}</Text>
        </View>
      </View>
     
      <Text style={styles.cardDescription}>{item.descripcion}</Text>
     
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Cantidad:</Text>
        <View style={styles.cantidadContainer}>
          <Text style={styles.textoCantidad}>{item.cantidad}</Text>
        </View>
      </View>
     
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => verInsumo(item.id)} style={styles.actionButton}>
          <FontAwesome name="eye" size={20} color="#424242" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editarInsumo(item.id)} style={styles.actionButton}>
          <Feather name="edit" size={20} color="#424242" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarInsumo(item.id)} style={styles.actionButton}>
          <Feather name="trash-2" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizado para desktop (tabla)
  const renderDesktopItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={[styles.celda, styles.columnaNombre]}>
        <Text style={styles.textoNombre}>{item.nombre}</Text>
      </View>
      <View style={[styles.celda, styles.columnaDescripcion]}>
        <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
      </View>
      <View style={[styles.celda, styles.columnaCategoria]}>
        <Text style={styles.textoCategoria}>{item.categoria}</Text>
      </View>
      <View style={[styles.celda, styles.columnaUnidad]}>
        <View style={styles.unidadContainer}>
          <Text style={styles.textoUnidad}>{item.unidad}</Text>
        </View>
      </View>
      <View style={[styles.celda, styles.columnaCantidad]}>
        <View style={styles.cantidadContainer}>
          <Text style={styles.textoCantidad}>{item.cantidad}</Text>
        </View>
      </View>
      <View style={[styles.celda, styles.columnaAcciones]}>
        <View style={styles.contenedorAcciones}>
          <TouchableOpacity onPress={() => verInsumo(item.id)} style={styles.botonAccion}>
            <FontAwesome name="eye" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editarInsumo(item.id)} style={styles.botonAccion}>
            <Feather name="edit" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarInsumo(item.id)} style={styles.botonAccion}>
            <Feather name="trash-2" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Insumos</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{insumosFiltrados.length}</Text>
          </View>
        </View>
        <View style={styles.botonesHeader}>
          <TouchableOpacity
            style={[styles.botonHeader, styles.botonControl]}
            onPress={controlInsumos}
            activeOpacity={0.7}
            disabled={insumos.length === 0}
          >
            <MaterialIcons name="inventory" size={20} color="white" />
            <Text style={styles.textoBoton}>Control</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonHeader}
            onPress={crearInsumo}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.textoBoton}>Crear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Buscador
        placeholder="Buscar insumos por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {insumosMostrar.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No se encontraron insumos</Text>
        </View>
      ) : isMobile ? (
        <FlatList
          data={insumosMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMobileItem}
          contentContainerStyle={styles.listContainer}
          style={styles.mobileList}
        />
      ) : (
        <View style={styles.tabla}>
          <View style={styles.filaEncabezado}>
            <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
            <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}><Text style={styles.encabezado}>Descripción</Text></View>
            <View style={[styles.celdaEncabezado, styles.columnaCategoria]}><Text style={styles.encabezado}>Categoría</Text></View>
            <View style={[styles.celdaEncabezado, styles.columnaUnidad]}><Text style={styles.encabezado}>Unidad</Text></View>
            <View style={[styles.celdaEncabezado, styles.columnaCantidad]}><Text style={styles.encabezado}>Cantidad</Text></View>
            <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
          </View>
          <FlatList
            data={insumosMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDesktopItem}
            scrollEnabled={false}
          />
        </View>
      )}

      {!isMobile && (
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
        />
      )}

      <CrearInsumo
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateInsumo}
      />

      <DetalleInsumo
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        insumo={insumoSeleccionado}
      />

      <EditarInsumo
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        insumo={insumoSeleccionado}
        onUpdate={handleUpdateInsumo}
      />
     
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mobileList: {
    flex: 1,
    marginBottom: 16,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contadorContainer: {
    backgroundColor: '#D9D9D9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  botonesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#424242',
  },
  botonControl: {
    backgroundColor: '#424242',
  },
  textoBoton: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  // Estilos para móvil (tarjetas)
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#424242',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 16,
  },
  unidadContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoUnidad: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cantidadContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCantidad: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 12,
  },
  // Estilos para desktop (tabla)
  tabla: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
    flex: 1,
  },
  filaEncabezado: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    backgroundColor: 'white',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  columnaNombre: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaDescripcion: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaCategoria: {
    flex: 2,
    alignItems: 'center',
  },
  columnaUnidad: {
    flex: 1,
    alignItems: 'center',
  },
  columnaCantidad: {
    flex: 1,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'center',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoDescripcion: {
    color: '#666',
  },
  textoCategoria: {
    color: '#555',
    fontWeight: '500',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default InsumosScreen;