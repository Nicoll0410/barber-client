import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCliente from '../clientes/CrearCliente';
import DetalleCliente from './DetalleCliente';
import EditarCliente from './EditarCliente';
import Footer from '../../components/Footer';

// Componente para el avatar del cliente
const Avatar = ({ nombre }) => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
  const color = colors[nombre.length % colors.length];

  return (
    <View style={[styles.avatarContainer, { backgroundColor: color }]}>
      <Text style={styles.avatarText}>
        {nombre.split(' ').map(part => part[0]).join('').toUpperCase()}
      </Text>
    </View>
  );
};

// Componente para el estado de verificación
const EstadoVerificacion = ({ verificado }) => (
  <View style={[
    styles.estadoContainer,
    verificado ? styles.verificado : styles.noVerificado
  ]}>
    {verificado ? (
      <>
        <MaterialIcons name="verified" size={20} color="#2e7d32" />
        <Text style={[styles.estadoTexto, styles.textoVerificado]}>Verificado</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="warning" size={20} color="#d32f2f" />
        <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>No verificado</Text>
      </>
    )}
  </View>
);

const ClientesScreen = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [clientesPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Maria Jose Urregu', 
        telefono: '3233404990', 
        email: 'maria@example.com', 
        emailVerificado: false 
      },
      { 
        id: 2, 
        nombre: 'Cliente Ejemplo 1', 
        telefono: '3101234567', 
        email: 'cliente1@example.com', 
        emailVerificado: true 
      },
      { 
        id: 3, 
        nombre: 'Cliente Ejemplo 2', 
        telefono: '3202345678', 
        email: 'cliente2@example.com', 
        emailVerificado: false 
      },
      { 
        id: 4, 
        nombre: 'Cliente Ejemplo 3', 
        telefono: '3003456789', 
        email: 'cliente3@example.com', 
        emailVerificado: true 
      },
    ];
    setClientes(datosEjemplo);
    setClientesFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setClientesFiltrados(clientes);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(termino) || 
        c.telefono.includes(busqueda)
      );
      setClientesFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, clientes]);

  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const clientesMostrar = clientesFiltrados.slice(indiceInicial, indiceInicial + clientesPorPagina);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearCliente = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateClient = (newClient) => {
    const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
    const nuevoCliente = { 
      id: newId, 
      ...newClient, 
      emailVerificado: false 
    };
    const nuevosClientes = [...clientes, nuevoCliente];
    setClientes(nuevosClientes);
    setClientesFiltrados(nuevosClientes);
    setModalVisible(false);
  };

  const reenviarEmail = (id) => console.log(`Reenviar email a cliente con ID: ${id}`);

  const verCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    setClienteSeleccionado(cliente);
    setModalDetalleVisible(true);
  };

  const editarCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    setClienteSeleccionado(cliente);
    setModalEditarVisible(true);
  };

  const handleUpdateClient = (updatedClient) => {
    const nuevosClientes = clientes.map(c => 
      c.id === updatedClient.id ? updatedClient : c
    );
    setClientes(nuevosClientes);
    setClientesFiltrados(nuevosClientes);
    setModalEditarVisible(false);
  };

  const eliminarCliente = (id) => {
    const nuevosClientes = clientes.filter(c => c.id !== id);
    setClientes(nuevosClientes);
    setClientesFiltrados(nuevosClientes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Clientes</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{clientesFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearCliente}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Cliente</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar clientes por nombre o teléfono"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaTelefono]}><Text style={styles.encabezado}>Teléfono</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaVerificado]}><Text style={styles.encabezado}>Verificación</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={clientesMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <View style={styles.contenedorNombre}>
                  <Avatar nombre={item.nombre} />
                  <Text style={styles.textoNombre}>{item.nombre}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaTelefono]}>
                <Text style={styles.textoTelefono}>{item.telefono}</Text>
              </View>
              <View style={[styles.celda, styles.columnaVerificado]}>
                <EstadoVerificacion verificado={item.emailVerificado} />
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  {!item.emailVerificado && (
                    <TouchableOpacity onPress={() => reenviarEmail(item.id)} style={styles.botonAccion}>
                      <MaterialIcons name="email" size={20} color="black" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => verCliente(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarCliente(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarCliente(item.id)} style={styles.botonAccion}>
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

      <CrearCliente
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateClient}
      />

      <DetalleCliente
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        cliente={clienteSeleccionado}
      />

      <EditarCliente
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        cliente={clienteSeleccionado}
        onUpdate={handleUpdateClient}
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
  columnaTelefono: {
    flex: 2,
    alignItems: 'center',
  },
  columnaVerificado: {
    flex: 2,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 2,
    alignItems: 'flex-end',
  },
  contenedorNombre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoNombre: {
    marginLeft: 10,
    fontWeight: 'bold', // Añadido negrita para el nombre
  },
  textoTelefono: {
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold', // Añadido negrita para el teléfono
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
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: 'center',
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
  },
  textoVerificado: {
    color: '#2e7d32',
  },
  textoNoVerificado: {
    color: '#d32f2f',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ClientesScreen;