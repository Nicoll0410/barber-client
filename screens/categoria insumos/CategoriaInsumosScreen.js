import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCategoria from './CrearCategoriaInsumos';
import EditarCategoria from './EditarCategoriaInsumos';
import DetalleCategoria from './DetalleCategoriaInsumos';

const CategoriaInsumosScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriasPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Cremas', 
        descripcion: 'Cremas', 
        fechaCreacion: '3 de septiembre de 2024', 
        insumosAsociados: 8 
      },
      { 
        id: 2, 
        nombre: 'Esmaltes', 
        descripcion: 'Esmaltes semipermanentes', 
        fechaCreacion: '4 de septiembre de 2024', 
        insumosAsociados: 0 
      },
      { 
        id: 3, 
        nombre: 'Aceite', 
        descripcion: 'Aceite corporal', 
        fechaCreacion: '3 de septiembre de 2024', 
        insumosAsociados: 2 
      },
      { 
        id: 4, 
        nombre: 'Shampoo', 
        descripcion: 'Shampoos para lavado del cabello', 
        fechaCreacion: '27 de agosto de 2024', 
        insumosAsociados: 4 
      },
      { 
        id: 5, 
        nombre: 'Barniz', 
        descripcion: 'Barniz', 
        fechaCreacion: '12 de septiembre de 2024', 
        insumosAsociados: 0 
      },
    ];
    setCategorias(datosEjemplo);
    setCategoriasFiltradas(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setCategoriasFiltradas(categorias);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = categorias.filter(c =>
        c.nombre.toLowerCase().includes(termino) || 
        c.descripcion.toLowerCase().includes(termino)
      );
      setCategoriasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, categorias]);

  const indiceInicial = (paginaActual - 1) * categoriasPorPagina;
  const categoriasMostrar = categoriasFiltradas.slice(indiceInicial, indiceInicial + categoriasPorPagina);
  const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearCategoria = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateCategoria = (newCategoria) => {
    const newId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
    const nuevaCategoria = { 
      id: newId, 
      ...newCategoria,
      fechaCreacion: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      insumosAsociados: 0
    };
    const nuevasCategorias = [...categorias, nuevaCategoria];
    setCategorias(nuevasCategorias);
    setCategoriasFiltradas(nuevasCategorias);
    setModalVisible(false);
  };

  const verDetallesCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    setCategoriaSeleccionada(categoria);
    setModalDetalleVisible(true);
  };

  const editarCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    setCategoriaSeleccionada(categoria);
    setModalEditarVisible(true);
  };

  const handleUpdateCategoria = (updatedCategoria) => {
    const nuevasCategorias = categorias.map(c => 
      c.id === updatedCategoria.id ? updatedCategoria : c
    );
    setCategorias(nuevasCategorias);
    setCategoriasFiltradas(nuevasCategorias);
    setModalEditarVisible(false);
  };

  const eliminarCategoria = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta categoría?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            const nuevasCategorias = categorias.filter(c => c.id !== id);
            setCategorias(nuevasCategorias);
            setCategoriasFiltradas(nuevasCategorias);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Categoría de insumos</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{categoriasFiltradas.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearCategoria}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Categoría</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar categoría de insumos"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}><Text style={styles.encabezado}>Descripción</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaFecha]}><Text style={styles.encabezado}>Fecha de creación</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaInsumos]}><Text style={styles.encabezado}>Insumos asociados</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={categoriasMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <Text style={styles.textoNombre}>{item.nombre}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaFecha]}>
                <Text style={styles.textoFecha}>{item.fechaCreacion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaInsumos]}>
                <View style={styles.insumosContainer}>
                  <Text style={styles.textoInsumos}>{item.insumosAsociados}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verDetallesCategoria(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarCategoria(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarCategoria(item.id)} style={styles.botonAccion}>
                    <Feather name="trash-2" size={20} color="black" />
                  </TouchableOpacity>
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

      <CrearCategoria
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCategoria}
      />

      <EditarCategoria
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        categoria={categoriaSeleccionada}
        onUpdate={handleUpdateCategoria}
      />

      <DetalleCategoria
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        categoria={categoriaSeleccionada}
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
  columnaNombre: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaDescripcion: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaFecha: {
    flex: 2,
    alignItems: 'center',
  },
  columnaInsumos: {
    flex: 1,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: 'bold',
  },
  textoDescripcion: {
    color: '#555',
  },
  textoFecha: {
    textAlign: 'center',
    color: '#666',
  },
  insumosContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoInsumos: {
    fontWeight: 'bold',
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

export default CategoriaInsumosScreen;