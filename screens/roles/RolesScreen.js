import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearRol from './CrearRol';
import DetalleRol from './DetalleRol';
import EditarRol from './EditarRol';
import Footer from '../../components/Footer';

const RolesScreen = () => {
  const [roles, setRoles] = useState([]);
  const [rolesFiltrados, setRolesFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [rolesPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', asociados: 5 },
      { id: 2, nombre: 'Recepcionista', descripcion: 'Gestiona reservas y clientes', asociados: 3 },
      { id: 3, nombre: 'Barbero', descripcion: 'Realiza servicios', asociados: 7 },
    ];
    setRoles(datosEjemplo);
    setRolesFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setRolesFiltrados(roles);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = roles.filter(r =>
        r.nombre.toLowerCase().includes(termino) ||
        r.descripcion.toLowerCase().includes(termino)
      );
      setRolesFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, roles]);

  const indiceInicial = (paginaActual - 1) * rolesPorPagina;
  const rolesMostrar = rolesFiltrados.slice(indiceInicial, indiceInicial + rolesPorPagina);
  const totalPaginas = Math.ceil(rolesFiltrados.length / rolesPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearRol = () => setModalCrearVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateRol = (nuevoRol) => {
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    const rol = { id: newId, ...nuevoRol };
    const nuevosRoles = [...roles, rol];
    setRoles(nuevosRoles);
    setRolesFiltrados(nuevosRoles);
    setModalCrearVisible(false);
  };

  const verRol = (id) => {
    const rol = roles.find(r => r.id === id);
    setRolSeleccionado(rol);
    setModalDetalleVisible(true);
  };

  const editarRol = (id) => {
    const rol = roles.find(r => r.id === id);
    setRolSeleccionado(rol);
    setModalEditarVisible(true);
  };

  const handleUpdateRol = (rolActualizado) => {
    const nuevosRoles = roles.map(r =>
      r.id === rolActualizado.id ? rolActualizado : r
    );
    setRoles(nuevosRoles);
    setRolesFiltrados(nuevosRoles);
    setModalEditarVisible(false);
  };

  const eliminarRol = (id) => {
    const nuevosRoles = roles.filter(r => r.id !== id);
    setRoles(nuevosRoles);
    setRolesFiltrados(nuevosRoles);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Roles</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{rolesFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearRol}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Rol</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar roles por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}><Text style={styles.encabezado}>Descripción</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAsociados]}><Text style={styles.encabezado}>Asociados</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={rolesMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <Text style={styles.textoNombre}>{item.nombre}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaAsociados]}>
                <View style={styles.asociadosContainer}>
                  <Text style={styles.asociadosTexto}>{item.asociados}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verRol(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarRol(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarRol(item.id)} style={styles.botonAccion}>
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

      <CrearRol
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCreate={handleCreateRol}
      />

      <DetalleRol
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        rol={rolSeleccionado}
      />

      <EditarRol
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        rol={rolSeleccionado}
        onUpdate={handleUpdateRol}
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
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonCrear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#424242',
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
    borderBottomColor: 'black',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  columnaNombre: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaDescripcion: {
    flex: 4,
    alignItems: 'flex-start',
  },
  columnaAsociados: {
    flex: 2,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 2,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoDescripcion: {
    textAlign: 'left',
    fontWeight: 'bold', // Añadido negrita para las descripciones
  },
  asociadosContainer: {
    backgroundColor: '#D9D9D9',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asociadosTexto: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
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

export default RolesScreen;