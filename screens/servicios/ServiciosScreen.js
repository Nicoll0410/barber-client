import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearServicio from './CrearServicio';
import DetalleServicio from './DetalleServicio';
import EditarServicio from './EditarServicio';
import Footer from '../../components/Footer';

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
    // Datos de ejemplo específicos para barbería
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Corte Clásico', 
        descripcion: 'Corte de cabello tradicional con tijeras y máquina, incluye lavado', 
        duracion: '45 min', 
        precio: '$ 25.000' 
      },
      { 
        id: 2, 
        nombre: 'Afeitado Premium', 
        descripcion: 'Afeitado con navaja tradicional y tratamiento post-afeitado', 
        duracion: '30 min', 
        precio: '$ 30.000' 
      },
      { 
        id: 3, 
        nombre: 'Corte + Barba', 
        descripcion: 'Combo completo: corte de cabello más arreglo de barba profesional', 
        duracion: '60 min', 
        precio: '$ 45.000' 
      },
      { 
        id: 4, 
        nombre: 'Tinte para Barba', 
        descripcion: 'Aplicación de tinte profesional para barba con productos de calidad', 
        duracion: '40 min', 
        precio: '$ 35.000' 
      },
      { 
        id: 5, 
        nombre: 'Tratamiento Capilar', 
        descripcion: 'Hidratación profunda con queratina para cabello seco o dañado', 
        duracion: '35 min', 
        precio: '$ 40.000' 
      },
      { 
        id: 6, 
        nombre: 'Diseño de Barba', 
        descripcion: 'Diseño personalizado de barba según la forma de tu rostro', 
        duracion: '25 min', 
        precio: '$ 20.000' 
      },
      { 
        id: 7, 
        nombre: 'Corte Infantil', 
        descripcion: 'Corte especial para niños con terminaciones suaves', 
        duracion: '30 min', 
        precio: '$ 18.000' 
      },
      { 
        id: 8, 
        nombre: 'Mascarilla Reafirmante', 
        descripcion: 'Tratamiento facial con mascarilla reafirmante para piel', 
        duracion: '20 min', 
        precio: '$ 15.000' 
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
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este servicio?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            const nuevosServicios = servicios.filter(s => s.id !== id);
            setServicios(nuevosServicios);
            setServiciosFiltrados(nuevosServicios);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Servicios</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{serviciosFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearServicio}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Servicio</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar servicios (corte, barba, tratamiento...)"
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
                <Text style={styles.textoNombre}><Text style={{fontWeight: 'bold'}}>{item.nombre}</Text></Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion} numberOfLines={1}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDuracion]}>
                <View style={styles.duracionContainer}>
                  <Text style={styles.textoDuracion}>{item.duracion}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaPrecio]}>
                <View style={styles.precioContainer}>
                  <Text style={styles.textoPrecio}><Text style={{fontWeight: 'bold'}}>{item.precio}</Text></Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verServicio(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarServicio(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarServicio(item.id)} style={styles.botonAccion}>
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
  columnaNombre: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaDescripcion: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaDuracion: {
    flex: 1.5,
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
    color: 'black',
  },
  duracionContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  textoDuracion: {
    textAlign: 'center',
    fontSize: 14,
  },
  precioContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoPrecio: {
    color: '#4CAF50',
    fontWeight: '500',
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