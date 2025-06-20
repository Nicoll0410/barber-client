import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCliente from './CrearCliente';
import DetalleCliente from './DetalleCliente';
import EditarCliente from './EditarCliente';
import Footer from '../../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

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

const EstadoVerificacion = ({ verificado }) => (
  <View style={styles.estadoContainer}>
    {verificado ? (
      <>
        <MaterialIcons name="verified" size={16} color="#2e7d32" />
        <Text style={styles.textoVerificado}>Verificado</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="warning" size={16} color="#d32f2f" />
        <Text style={styles.textoNoVerificado}>No verificado</Text>
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/clientes', {
        params: {
          page: paginaActual,
          limit: clientesPorPagina,
          search: busqueda
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const clientesData = response.data.clientes || [];
      const clientesConUsuario = clientesData.map(cliente => ({
        ...cliente,
        email: cliente.Usuario?.email || '',
        estaVerificado: cliente.Usuario?.estaVerificado || false
      }));
      
      setClientes(clientesConUsuario);
      setClientesFiltrados(clientesConUsuario);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClientes();
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [paginaActual]);

  useEffect(() => {
    if (busqueda.trim()) {
      const searchTerm = busqueda.toLowerCase().trim();
      const filtrados = clientes.filter(cliente => {
        return (
          cliente.nombre?.toLowerCase().includes(searchTerm) ||
          cliente.telefono?.includes(searchTerm) ||
          (cliente.email && cliente.email.toLowerCase().includes(searchTerm))
        );
      });
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados([...clientes]);
    }
    setPaginaActual(1);
  }, [busqueda, clientes]);

  useFocusEffect(
    useCallback(() => {
      fetchClientes();
    }, [])
  );

  const clientesMostrar = clientesFiltrados.slice(
    (paginaActual - 1) * clientesPorPagina,
    paginaActual * clientesPorPagina
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearCliente = () => setModalVisible(true);

  const handleSearchChange = (texto) => {
    setBusqueda(texto);
  };

  const handleCreateCliente = async (newCliente) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/clientes', newCliente, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const nuevoCliente = response.data.cliente;
      setClientes(prev => [...prev, nuevoCliente]);
      setClientesFiltrados(prev => [...prev, nuevoCliente]);
      
      const totalClientes = clientesFiltrados.length + 1;
      const nuevaPagina = Math.ceil(totalClientes / clientesPorPagina);
      setPaginaActual(nuevaPagina);
      
      Alert.alert('Éxito', 'Cliente creado correctamente');
      setModalVisible(false);
      return nuevoCliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      Alert.alert('Error', error.response?.data?.mensaje || 'Error al crear cliente');
      throw error;
    }
  };

  const reenviarEmail = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://localhost:8080/clientes/${id}/reenviar-email`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Éxito', 'Email de verificación reenviado');
    } catch (error) {
      console.error('Error al reenviar email:', error);
      Alert.alert('Error', error.response?.data?.mensaje || 'No se pudo reenviar el email');
    }
  };

  const verCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalDetalleVisible(true);
  };

  const editarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditarVisible(true);
  };

  const handleUpdateCliente = async (updatedCliente) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://localhost:8080/clientes/${updatedCliente.id}`, updatedCliente, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setClientes(prev => prev.map(c => 
        c.id === updatedCliente.id ? updatedCliente : c
      ));
      
      setClientesFiltrados(prev => prev.map(c => 
        c.id === updatedCliente.id ? updatedCliente : c
      ));

      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      setModalEditarVisible(false);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      Alert.alert('Error', error.response?.data?.mensaje || 'Error al actualizar cliente');
    }
  };

  const eliminarCliente = async (id) => {
    try {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este cliente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Eliminar',
            onPress: async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                await axios.delete(`http://localhost:8080/clientes/${id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                
                setClientes(prev => prev.filter(c => c.id !== id));
                setClientesFiltrados(prev => prev.filter(c => c.id !== id));
                
                if (clientesMostrar.length === 1 && paginaActual > 1) {
                  setPaginaActual(paginaActual - 1);
                }
                
                Alert.alert('Éxito', 'Cliente eliminado correctamente');
              } catch (error) {
                console.error('Error al eliminar cliente:', error);
                Alert.alert('Error', error.response?.data?.mensaje || 'Error al eliminar cliente');
              }
            },
            style: 'destructive'
          }
        ]
      );
    } catch (error) {
      console.error('Error al mostrar alerta:', error);
    }
  };

  const renderMobileItem = ({ item }) => {
    const nombre = item.nombre || '';
    const telefono = item.telefono || '';
    const email = item.email || '';
    const verificado = item.estaVerificado || false;
    const id = item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Avatar nombre={nombre} />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{nombre}</Text>
            <Text style={styles.cardSubtitle}>{telefono}</Text>
            <Text style={styles.cardSubtitle}>{email}</Text>
          </View>
        </View>
        
        <View style={styles.cardInfoRow}>
          <EstadoVerificacion verificado={verificado} />
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => verCliente(item)} style={styles.actionButton}>
            <FontAwesome name="eye" size={20} color="#424242" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editarCliente(item)} style={styles.actionButton}>
            <Feather name="edit" size={20} color="#424242" />
          </TouchableOpacity>
          {!verificado && (
            <TouchableOpacity onPress={() => reenviarEmail(id)} style={styles.actionButton}>
              <MaterialIcons name="email" size={20} color="#424242" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => eliminarCliente(id)} style={styles.actionButton}>
            <Feather name="trash-2" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDesktopItem = ({ item }) => {
    const nombre = item.nombre || '';
    const telefono = item.telefono || '';
    const email = item.email || '';
    const verificado = item.estaVerificado || false;
    const id = item.id;

    return (
      <View style={styles.fila}>
        <View style={[styles.celda, styles.columnaNombre]}>
          <View style={styles.contenedorNombre}>
            <Avatar nombre={nombre} />
            <Text style={styles.textoNombre}>{nombre}</Text>
          </View>
        </View>
        <View style={[styles.celda, styles.columnaTelefono]}>
          <Text style={styles.textoTelefono}>{telefono}</Text>
        </View>
        <View style={[styles.celda, styles.columnaEmail]}>
          <Text style={styles.textoEmail}>{email}</Text>
        </View>
        <View style={[styles.celda, styles.columnaVerificado]}>
          <EstadoVerificacion verificado={verificado} />
        </View>
        <View style={[styles.celda, styles.columnaAcciones]}>
          <View style={styles.contenedorAcciones}>
            <TouchableOpacity onPress={() => verCliente(item)} style={styles.botonAccion}>
              <FontAwesome name="eye" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editarCliente(item)} style={styles.botonAccion}>
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
            {!verificado && (
              <TouchableOpacity onPress={() => reenviarEmail(id)} style={styles.botonAccion}>
                <MaterialIcons name="email" size={20} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => eliminarCliente(id)} style={styles.botonAccion}>
              <Feather name="trash-2" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && clientes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#424242" />
        <Text style={styles.loadingText}>Cargando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={isMobile ? styles.mobileContainer : styles.desktopContainer}>
      <View style={isMobile ? styles.mobileContent : styles.desktopContent}>
        <View style={styles.header}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Clientes</Text>
            <View style={styles.contadorContainer}>
              <Text style={styles.contadorTexto}>{clientesFiltrados.length}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.botonCrear} onPress={crearCliente}>
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.textoBoton}>Crear</Text>
          </TouchableOpacity>
        </View>

        <Buscador
          placeholder="Buscar clientes por nombre, teléfono o email"
          value={busqueda}
          onChangeText={handleSearchChange}
        />

        {clientesMostrar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se encontraron clientes</Text>
            <TouchableOpacity onPress={fetchClientes} style={styles.refreshButton}>
              <Feather name="refresh-cw" size={20} color="#424242" />
              <Text style={styles.refreshText}>Recargar</Text>
            </TouchableOpacity>
          </View>
        ) : isMobile ? (
          <>
            <FlatList
              data={clientesMostrar}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMobileItem}
              contentContainerStyle={styles.mobileListContainer}
              style={styles.mobileFlatList}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
            {totalPaginas > 1 && (
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={cambiarPagina}
              />
            )}
          </>
        ) : (
          <>
            <View style={styles.tabla}>
              <View style={styles.filaEncabezado}>
                <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaTelefono]}><Text style={styles.encabezado}>Teléfono</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaEmail]}><Text style={styles.encabezado}>Email</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaVerificado]}><Text style={styles.encabezado}>Verificación</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
              </View>
              <FlatList
                data={clientesMostrar}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderDesktopItem}
                scrollEnabled={false}
              />
            </View>

            {totalPaginas > 1 && (
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={cambiarPagina}
              />
            )}
          </>
        )}
      </View>

      <CrearCliente
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCliente}
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
        onUpdate={handleUpdateCliente}
      />
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mobileContent: {
    flex: 1,
    padding: 16,
  },
  desktopContent: {
    flex: 1,
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
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#424242',
  },
  mobileFlatList: {
    flex: 1,
  },
  mobileListContainer: {
    paddingBottom: 20,
  },
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
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    marginLeft: 12,
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
    marginBottom: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 52,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    marginLeft: 16,
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
    borderBottomColor: '#eee',
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
  columnaEmail: {
    flex: 3,
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
    fontWeight: 'bold',
  },
  textoTelefono: {
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  textoEmail: {
    textAlign: 'center',
    width: '100%',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
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
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  textoVerificado: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  textoNoVerificado: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
  },
  refreshText: {
    marginLeft: 5,
    color: '#424242',
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default ClientesScreen;