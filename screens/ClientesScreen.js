import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Paginacion from '../components/Paginacion';
import Buscador from '../components/Buscador';
import CrearCliente from '../components/CrearCliente';

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
const EstadoVerificacion = ({ verificado }) => {
  return (
    <View style={[
      styles.estadoContainer,
      verificado ? styles.verificado : styles.noVerificado
    ]}>
      {verificado ? (
        <>
          <AntDesign name="check" size={16} color="#2e7d32" />
          <Text style={[styles.estadoTexto, styles.textoVerificado]}>Verificado</Text>
        </>
      ) : (
        <>
          <AntDesign name="close" size={16} color="#d32f2f" />
          <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>No verificado</Text>
        </>
      )}
    </View>
  );
};

const ClientesScreen = ({ navigation }) => {
  // Estados
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [clientesPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Datos de ejemplo
  useEffect(() => {
    const datosEjemplo = [
      { id: 1, nombre: 'Maria Jose Urregu', telefono: '3233404990', emailVerificado: false },
      { id: 2, nombre: 'Cliente Ejemplo 1', telefono: '3101234567', emailVerificado: true },
      { id: 3, nombre: 'Cliente Ejemplo 2', telefono: '3202345678', emailVerificado: false },
      { id: 4, nombre: 'Cliente Ejemplo 3', telefono: '3003456789', emailVerificado: true },
      { id: 5, nombre: 'Cliente Ejemplo 4', telefono: '3154567890', emailVerificado: false },
      { id: 6, nombre: 'Cliente Ejemplo 5', telefono: '3185678901', emailVerificado: true },
      { id: 7, nombre: 'Cliente Ejemplo 6', telefono: '3126789012', emailVerificado: false },
    ];
    
    setClientes(datosEjemplo);
    setClientesFiltrados(datosEjemplo);
  }, []);

  // Filtrar clientes en tiempo real
  useEffect(() => {
    if (busqueda.trim() === '') {
      setClientesFiltrados(clientes);
      setPaginaActual(1);
    } else {
      const terminoBusqueda = busqueda.toLowerCase();
      const filtrados = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(terminoBusqueda) ||
        cliente.telefono.includes(busqueda)
      );
      setClientesFiltrados(filtrados);
      setPaginaActual(1);
    }
  }, [busqueda, clientes]);

  // Obtener clientes para la página actual
  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const clientesMostrar = clientesFiltrados.slice(indiceInicial, indiceInicial + clientesPorPagina);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSearchChange = (texto) => {
    setBusqueda(texto);
  };

  const crearCliente = () => {
    setModalVisible(true);
  };

  const handleCreateClient = (newClient) => {
    console.log('Nuevo cliente:', newClient);
    // Generar un ID único para el nuevo cliente
    const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
    
    // Crear el nuevo objeto cliente
    const nuevoCliente = {
      id: newId,
      nombre: newClient.nombre,
      telefono: newClient.telefono,
      emailVerificado: false // Por defecto no verificado
    };
    
    // Actualizar el estado
    setClientes([...clientes, nuevoCliente]);
    setClientesFiltrados([...clientes, nuevoCliente]);
    setModalVisible(false);
  };

  const reenviarEmail = (id) => {
    console.log(`Reenviar email a cliente con ID: ${id}`);
  };

  const verCliente = (id) => {
    console.log(`Ver cliente con ID: ${id}`);
  };

  const editarCliente = (id) => {
    console.log(`Editar cliente con ID: ${id}`);
  };

  const eliminarCliente = (id) => {
    console.log(`Eliminar cliente con ID: ${id}`);
    // Filtrar para eliminar el cliente
    const nuevosClientes = clientes.filter(cliente => cliente.id !== id);
    setClientes(nuevosClientes);
    setClientesFiltrados(nuevosClientes);
  };

  return (
    <View style={styles.container}>
      {/* Header con título y botón */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Clientes ({clientesFiltrados.length})</Text>
        <TouchableOpacity 
          style={styles.botonCrear}
          onPress={crearCliente}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.textoBoton}>Crear Cliente</Text>
        </TouchableOpacity>
      </View>
      
      {/* Barra de búsqueda */}
      <Buscador 
        placeholder="Buscar clientes por nombre o teléfono"
        value={busqueda}
        onChangeText={handleSearchChange}
      />
      
      {/* Tabla de clientes */}
      <View style={styles.tabla}>
        {/* Encabezados */}
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaTelefono]}><Text style={styles.encabezado}>Teléfono</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaVerificado]}><Text style={styles.encabezado}>Verificación</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>
        
        {/* Filas de datos */}
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
                    <TouchableOpacity 
                      onPress={() => reenviarEmail(item.id)}
                      style={styles.botonAccion}
                    >
                      <MaterialIcons name="email" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={() => verCliente(item.id)}
                    style={styles.botonAccion}
                  >
                    <FontAwesome name="eye" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => editarCliente(item.id)}
                    style={styles.botonAccion}
                  >
                    <Feather name="edit" size={20} color="#FFC107" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => eliminarCliente(item.id)}
                    style={styles.botonAccion}
                  >
                    <Feather name="trash-2" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      
      {/* Paginación */}
      <Paginacion 
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        cambiarPagina={cambiarPagina}
      />

      {/* Modal para crear nuevo cliente */}
      <CrearCliente
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateClient}
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
  // Estilos específicos para columnas
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
  },
  textoTelefono: {
    textAlign: 'center',
    width: '100%',
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
    marginHorizontal: 6, // Espacio entre botones
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