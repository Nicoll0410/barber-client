import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearServicio from './CrearServicio';
import DetalleServicio from './DetalleServicio';
import EditarServicio from './EditarServicio';

const ServiciosScreen = () => {
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [serviciosPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Manicure y Pedicure', 
        descripcion: 'uñas lindas', 
        duracion: '1 horas y 30 minutos', 
        precio: '$ 50.000' 
      },
      { 
        id: 2, 
        nombre: 'wilson servicios', 
        descripcion: 'ldajdlasjd', 
        duracion: '1 horas', 
        precio: '$ 10.000' 
      },
      { 
        id: 3, 
        nombre: 'askidjasdikad', 
        descripcion: 'alkdjsalkdjakld', 
        duracion: '1 horas y 30 minutos', 
        precio: '$ 50.000' 
      },
      { 
        id: 4, 
        nombre: 'Masaje con crema de ...', 
        descripcion: 'masajedfgdfgdfg', 
        duracion: '30 minutos', 
        precio: '$ 14.000.000' 
      },
      { 
        id: 5, 
        nombre: 'sadiksadjk', 
        descripcion: 'dsasjkdhsajkdh', 
        duracion: '1 horas', 
        precio: '$ 50.000' 
      },
    ];
    setServicios(datosEjemplo);
    setServiciosFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setServiciosFiltrados(servicios);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = servicios.filter(s =>
        s.nombre.toLowerCase().includes(termino) || 
        s.descripcion.toLowerCase().includes(termino)
      );
      setServiciosFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, servicios]);

  const indiceInicial = (paginaActual - 1) * serviciosPorPagina;
  const serviciosMostrar = serviciosFiltrados.slice(indiceInicial, indiceInicial + serviciosPorPagina);
  const totalPaginas = Math.ceil(serviciosFiltrados.length / serviciosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearServicio = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateService = (newService) => {
    const newId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
    const nuevoServicio = { 
      id: newId, 
      ...newService
    };
    const nuevosServicios = [...servicios, nuevoServicio];
    setServicios(nuevosServicios);
    setServiciosFiltrados(nuevosServicios);
    setModalVisible(false);
  };

  const verServicio = (id) => {
    const servicio = servicios.find(s => s.id === id);
    setServicioSeleccionado(servicio);
    setModalDetalleVisible(true);
  };

  const editarServicio = (id) => {
    const servicio = servicios.find(s => s.id === id);
    setServicioSeleccionado(servicio);
    setModalEditarVisible(true);
  };

  const handleUpdateService = (updatedService) => {
    const nuevosServicios = servicios.map(s => 
      s.id === updatedService.id ? updatedService : s
    );
    setServicios(nuevosServicios);
    setServiciosFiltrados(nuevosServicios);
    setModalEditarVisible(false);
  };

  const eliminarServicio = (id) => {
    const nuevosServicios = servicios.filter(s => s.id !== id);
    setServicios(nuevosServicios);
    setServiciosFiltrados(nuevosServicios);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Servicios ({serviciosFiltrados.length})</Text>
        <TouchableOpacity style={styles.botonCrear} onPress={crearServicio}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.textoBoton}>Crear Servicio</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar servicios por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}><Text style={styles.encabezado}>Descripción</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaDuracion]}><Text style={styles.encabezado}>Duración</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaPrecio]}><Text style={styles.encabezado}>Precio</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={serviciosMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <Text style={styles.textoNombre}>{item.nombre}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion} numberOfLines={1}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDuracion]}>
                <Text style={styles.textoDuracion}>{item.duracion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaPrecio]}>
                <Text style={styles.textoPrecio}>{item.precio}</Text>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verServicio(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarServicio(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="#FFC107" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarServicio(item.id)} style={styles.botonAccion}>
                    <Feather name="trash-2" size={20} color="#F44336" />
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

      <CrearServicio
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateService}
      />

      <DetalleServicio
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        servicio={servicioSeleccionado}
      />

      <EditarServicio
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        servicio={servicioSeleccionado}
        onUpdate={handleUpdateService}
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
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
  textoBoton: {
    marginLeft: 8,
    color: '#2e7d32',
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
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  celdaEncabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  columnaDuracion: {
    flex: 2,
    alignItems: 'center',
  },
  columnaPrecio: {
    flex: 2,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoDescripcion: {
    color: '#666',
  },
  textoDuracion: {
    textAlign: 'center',
    width: '100%',
  },
  textoPrecio: {
    textAlign: 'center',
    width: '100%',
    fontWeight: '500',
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
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

export default ServiciosScreen;