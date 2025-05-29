import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearInsumo from './CrearInsumo';
import DetalleInsumo from './DetalleInsumo';
import EditarInsumo from './EditarInsumo';

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
        nombre: 'crema chocolate', 
        descripcion: 'crema actualizada', 
        categoria: 'Shampoo', 
        unidad: 'ML',
        cantidad: 0
      },
      { 
        id: 2, 
        nombre: 'Crema de chocolates', 
        descripcion: 'chocolate', 
        categoria: 'Cremas', 
        unidad: 'ML',
        cantidad: 90
      },
      { 
        id: 3, 
        nombre: 'Hidratante de cabello', 
        descripcion: 'asjélsajd!', 
        categoria: 'Hidratatantes', 
        unidad: 'TT',
        cantidad: 400
      },
      { 
        id: 4, 
        nombre: 'Wilson insumo', 
        descripcion: 'wilson', 
        categoria: 'Shampoo', 
        unidad: 'TT',
        cantidad: 25
      },
      { 
        id: 5, 
        nombre: 'Crema de manos', 
        descripcion: 'Crema de manos para revitalizar', 
        categoria: 'Cremas', 
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
  const insumosMostrar = insumosFiltrados.slice(indiceInicial, indiceInicial + insumosPorPagina);
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
            <MaterialIcons name="inventory" size={20} color="#fff" />
            <Text style={[styles.textoBoton, styles.textoBotonControl]}>Control de insumos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.botonHeader} 
            onPress={crearInsumo}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.textoBoton}>Crear Insumo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Buscador
        placeholder="Buscar insumos por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}>
            <Text style={styles.encabezado}>Nombre</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}>
            <Text style={styles.encabezado}>Descripción</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaCategoria]}>
            <Text style={styles.encabezado}>Categoría</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaUnidad]}>
            <Text style={styles.encabezado}>Unidad</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaCantidad]}>
            <Text style={styles.encabezado}>Cantidad</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}>
            <Text style={styles.encabezado}>Acciones</Text>
          </View>
        </View>

        <FlatList
          data={insumosMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <Text style={styles.textoNombre} numberOfLines={1}>{item.nombre}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion} numberOfLines={1}>{item.descripcion}</Text>
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
                    <FontAwesome name="eye" size={18} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarInsumo(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={18} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarInsumo(item.id)} style={styles.botonAccion}>
                    <Feather name="trash-2" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
        />
      </View>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        cambiarPagina={cambiarPagina}
      />

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
    marginRight: 8,
  },
  contadorContainer: {
    backgroundColor: '#D9D9D9',
    width: 30,
    height: 30,
    borderRadius: 15,
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
    borderRadius: 20,
    marginLeft: 10,
  },
  botonControl: {
    backgroundColor: '#424242',
  },
  textoBoton: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '500',
  },
  textoBotonControl: {
    color: '#fff',
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
    borderBottomColor: '#ddd',
  },
  celdaEncabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  separador: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 4,
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
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
});

export default InsumosScreen;