import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCliente from '../clientes/CrearCliente';
import DetalleCliente from './DetalleCliente';
import EditarCliente from './EditarCliente';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Avatar Component
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

// Verification Status Component
const EstadoVerificacion = ({ verificado }) => (
  <View style={[
    styles.estadoContainer,
    verificado ? styles.verificado : styles.noVerificado
  ]}>
    {verificado ? (
      <>
        <MaterialIcons name="verified" size={16} color="#2e7d32" />
        <Text style={styles.estadoTexto}>Verificado</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="warning" size={16} color="#d32f2f" />
        <Text style={styles.estadoTexto}>No verificado</Text>
      </>
    )}
  </View>
);

// Mobile Client Card
const ClienteCard = ({ item, onVer, onEditar, onEliminar, onReenviar }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Avatar nombre={item.nombre} />
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Text style={styles.cardTelefono}>{item.telefono}</Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <MaterialIcons name="email" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>{item.email}</Text>
      </View>
      <View style={styles.detailRow}>
        <EstadoVerificacion verificado={item.emailVerificado} />
      </View>
    </View>
    
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onVer(item.id)}>
        <FontAwesome name="eye" size={18} color="#424242" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEditar(item.id)}>
        <Feather name="edit" size={18} color="#424242" />
      </TouchableOpacity>
      
      {!item.emailVerificado && (
        <TouchableOpacity style={styles.actionButton} onPress={() => onReenviar(item.id)}>
          <MaterialIcons name="email" size={18} color="#424242" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEliminar(item.id)}>
        <Feather name="trash-2" size={18} color="#d32f2f" />
      </TouchableOpacity>
    </View>
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
  const clientesMostrar = isMobile ? clientesFiltrados : clientesFiltrados.slice(indiceInicial, indiceInicial + clientesPorPagina);
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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Clientes</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{clientesFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={crearCliente}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar clientes por nombre o teléfono"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {!isMobile ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.nameColumn]}><Text style={styles.headerText}>Nombre</Text></View>
            <View style={[styles.headerCell, styles.phoneColumn]}><Text style={styles.headerText}>Teléfono</Text></View>
            <View style={[styles.headerCell, styles.statusColumn]}><Text style={styles.headerText}>Verificación</Text></View>
            <View style={[styles.headerCell, styles.actionsColumn]}><Text style={styles.headerText}>Acciones</Text></View>
          </View>

          <FlatList
            data={clientesMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.nameColumn]}>
                  <View style={styles.nameContainer}>
                    <Avatar nombre={item.nombre} />
                    <Text style={styles.nameText}>{item.nombre}</Text>
                  </View>
                </View>
                <View style={[styles.cell, styles.phoneColumn]}>
                  <Text style={styles.phoneText}>{item.telefono}</Text>
                </View>
                <View style={[styles.cell, styles.statusColumn]}>
                  <EstadoVerificacion verificado={item.emailVerificado} />
                </View>
                <View style={[styles.cell, styles.actionsColumn]}>
                  <View style={styles.actionsContainer}>
                    {!item.emailVerificado && (
                      <TouchableOpacity onPress={() => reenviarEmail(item.id)} style={styles.actionIcon}>
                        <MaterialIcons name="email" size={20} color="black" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => verCliente(item.id)} style={styles.actionIcon}>
                      <FontAwesome name="eye" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => editarCliente(item.id)} style={styles.actionIcon}>
                      <Feather name="edit" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarCliente(item.id)} style={styles.actionIcon}>
                      <Feather name="trash-2" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {clientesMostrar.map(item => (
              <ClienteCard 
                key={item.id.toString()}
                item={item}
                onVer={verCliente}
                onEditar={editarCliente}
                onEliminar={eliminarCliente}
                onReenviar={reenviarEmail}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {!isMobile && (
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
        />
      )}

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
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242',
    marginRight: 12,
  },
  counter: {
    backgroundColor: '#EEEEEE',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#424242',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },

  // Desktop Table Styles
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    paddingVertical: 12,
  },
  headerCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  nameColumn: {
    flex: 3,
    alignItems: 'flex-start',
  },
  phoneColumn: {
    flex: 2,
    alignItems: 'center',
  },
  statusColumn: {
    flex: 2,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
  },
  phoneText: {
    fontSize: 14,
    color: '#424242',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginHorizontal: 6,
  },

  // Mobile Card Styles
  scrollContainer: {
    flex: 1,
  },
  cardsContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  cardTelefono: {
    fontSize: 14,
    color: '#757575',
  },
  cardDetails: {
    marginLeft: 52,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#616161',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },

  // Verification Status
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verificado: {
    backgroundColor: '#E8F5E9',
  },
  noVerificado: {
    backgroundColor: '#FFEBEE',
  },
  estadoTexto: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  verificadoText: {
    color: '#2e7d32',
  },
  noVerificadoText: {
    color: '#d32f2f',
  },

  // Avatar
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClientesScreen;