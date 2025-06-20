import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearBarbero from './CrearBarbero';
import DetalleBarbero from './DetalleBarbero';
import EditarBarbero from './EditarBarbero';
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
      <Text style={styles.textoVerificado}>Verificado</Text>
    ) : (
      <Text style={styles.textoNoVerificado}>No verificado</Text>
    )}
  </View>
);

const RolBadge = ({ rol }) => (
  <Text style={styles.rolText}>{rol || 'Sin rol'}</Text>
);

const BarberosScreen = () => {
  const [barberos, setBarberos] = useState([]);
  const [barberosFiltrados, setBarberosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [barberosPorPagina] = useState(4); // Cambiado a 4 barberos por página
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBarberos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/barberos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const barberosData = response.data.barberos || [];
      setBarberos(barberosData);
      setBarberosFiltrados(barberosData);
    } catch (error) {
      console.error('Error al obtener barberos:', error);
      Alert.alert('Error', 'No se pudieron cargar los barberos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBarberos();
  }, []);

  useEffect(() => {
    fetchBarberos();
  }, []);

  useEffect(() => {
    if (busqueda.trim()) {
      const searchTerm = busqueda.toLowerCase().trim();
      const filtrados = barberos.filter(barbero => {
        return (
          barbero.nombre?.toLowerCase().includes(searchTerm) ||
          (barbero.cedula && barbero.cedula.toString().includes(searchTerm)) ||
          barbero.telefono?.includes(searchTerm) ||
          (barbero.Usuario?.email && barbero.Usuario.email.toLowerCase().includes(searchTerm))
        );
      });
      setBarberosFiltrados(filtrados);
    } else {
      setBarberosFiltrados([...barberos]);
    }
    setPaginaActual(1);
  }, [busqueda, barberos]);

  useFocusEffect(
    useCallback(() => {
      fetchBarberos();
    }, [])
  );

  const barberosMostrar = barberosFiltrados.slice(
    (paginaActual - 1) * barberosPorPagina,
    paginaActual * barberosPorPagina
  );

  const totalPaginas = Math.ceil(barberosFiltrados.length / barberosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearBarbero = () => setModalVisible(true);

  const handleSearchChange = (texto) => {
    setBusqueda(texto);
  };

  const handleCreateBarbero = async (newBarbero) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!newBarbero.email || !newBarbero.rolID || !newBarbero.password) {
        Alert.alert('Error', 'Email, rol y contraseña son obligatorios');
        return;
      }

      const response = await axios.post('http://localhost:8080/barberos', newBarbero, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBarberos(prev => [...prev, response.data.barbero]);
      setBarberosFiltrados(prev => [...prev, response.data.barbero]);
      
      Alert.alert('Éxito', 'Barbero creado correctamente');
      setModalVisible(false);
      return response.data.barbero;
    } catch (error) {
      console.error('Error al crear barbero:', error);
      const errorMessage = error.response?.data?.mensaje || 
                         error.response?.data?.error || 
                         'Error al crear barbero';
      Alert.alert('Error', errorMessage);
      throw error;
    }
  };

  const reenviarEmail = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://localhost:8080/barberos/${id}/reenviar-email`, {}, {
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

  const verBarbero = (barbero) => {
    setBarberoSeleccionado(barbero);
    setModalDetalleVisible(true);
  };

  const editarBarbero = (barbero) => {
    setBarberoSeleccionado(barbero);
    setModalEditarVisible(true);
  };

  const handleUpdateBarbero = async (updatedBarbero) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://localhost:8080/barberos/${updatedBarbero.id}`, updatedBarbero, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBarberos(prev => prev.map(b => 
        b.id === updatedBarbero.id ? updatedBarbero : b
      ));
      
      setBarberosFiltrados(prev => prev.map(b => 
        b.id === updatedBarbero.id ? updatedBarbero : b
      ));

      Alert.alert('Éxito', 'Barbero actualizado correctamente');
      setModalEditarVisible(false);
    } catch (error) {
      console.error('Error al actualizar barbero:', error);
      Alert.alert('Error', error.response?.data?.mensaje || 'Error al actualizar barbero');
    }
  };

  const eliminarBarbero = async (id) => {
    try {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este barbero?',
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
                await axios.delete(`http://localhost:8080/barberos/${id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                
                setBarberos(prev => prev.filter(b => b.id !== id));
                setBarberosFiltrados(prev => prev.filter(b => b.id !== id));
                
                if (barberosMostrar.length === 1 && paginaActual > 1) {
                  setPaginaActual(paginaActual - 1);
                }
                
                Alert.alert('Éxito', 'Barbero eliminado correctamente');
              } catch (error) {
                console.error('Error al eliminar barbero:', error);
                Alert.alert('Error', error.response?.data?.mensaje || 'Error al eliminar barbero');
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
    const email = item.Usuario?.email || item.email || '';
    const rol = item.Usuario?.Rol?.nombre || item.rol || '';
    const verificado = item.Usuario?.estaVerificado || item.verificado || false;
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
          <Text style={styles.cardLabel}>Rol: <RolBadge rol={rol} /></Text>
          <EstadoVerificacion verificado={verificado} />
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => verBarbero(item)} style={styles.actionButton}>
            <FontAwesome name="eye" size={20} color="#424242" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editarBarbero(item)} style={styles.actionButton}>
            <Feather name="edit" size={20} color="#424242" />
          </TouchableOpacity>
          {!verificado && (
            <TouchableOpacity onPress={() => reenviarEmail(id)} style={styles.actionButton}>
              <MaterialIcons name="email" size={20} color="#424242" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => eliminarBarbero(id)} style={styles.actionButton}>
            <Feather name="trash-2" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDesktopItem = ({ item }) => {
    const nombre = item.nombre || '';
    const cedula = item.cedula || 'N/A';
    const rol = item.Usuario?.Rol?.nombre || item.rol || '';
    const verificado = item.Usuario?.estaVerificado || item.verificado || false;
    const id = item.id;

    return (
      <View style={styles.fila}>
        <View style={[styles.celda, styles.columnaNombre]}>
          <View style={styles.contenedorNombre}>
            <Avatar nombre={nombre} />
            <Text style={styles.textoNombre}>{nombre}</Text>
          </View>
        </View>
        <View style={[styles.celda, styles.columnaCedula]}>
          <Text style={styles.textoCedula}>{cedula}</Text>
        </View>
        <View style={[styles.celda, styles.columnaRol]}>
          <RolBadge rol={rol} />
        </View>
        <View style={[styles.celda, styles.columnaVerificado]}>
          <EstadoVerificacion verificado={verificado} />
        </View>
        <View style={[styles.celda, styles.columnaAcciones]}>
          <View style={styles.contenedorAcciones}>
            <TouchableOpacity onPress={() => verBarbero(item)} style={styles.botonAccion}>
              <FontAwesome name="eye" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editarBarbero(item)} style={styles.botonAccion}>
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
            {!verificado && (
              <TouchableOpacity onPress={() => reenviarEmail(id)} style={styles.botonAccion}>
                <MaterialIcons name="email" size={20} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => eliminarBarbero(id)} style={styles.botonAccion}>
              <Feather name="trash-2" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && barberos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#424242" />
        <Text style={styles.loadingText}>Cargando barberos...</Text>
      </View>
    );
  }

  return (
    <View style={isMobile ? styles.mobileContainer : styles.desktopContainer}>
      <View style={isMobile ? styles.mobileContent : styles.desktopContent}>
        <View style={styles.header}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Barberos</Text>
            <View style={styles.contadorContainer}>
              <Text style={styles.contadorTexto}>{barberosFiltrados.length}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.botonCrear} onPress={crearBarbero}>
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.textoBoton}>Crear</Text>
          </TouchableOpacity>
        </View>

        <Buscador
          placeholder="Buscar barberos por nombre, cédula o teléfono"
          value={busqueda}
          onChangeText={handleSearchChange}
        />

        {barberosMostrar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se encontraron barberos</Text>
            <TouchableOpacity onPress={fetchBarberos} style={styles.refreshButton}>
              <Feather name="refresh-cw" size={20} color="#424242" />
              <Text style={styles.refreshText}>Recargar</Text>
            </TouchableOpacity>
          </View>
        ) : isMobile ? (
          <>
            <FlatList
              data={barberosMostrar}
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
                <View style={[styles.celdaEncabezado, styles.columnaCedula]}><Text style={styles.encabezado}>Cédula</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaRol]}><Text style={styles.encabezado}>Rol</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaVerificado]}><Text style={styles.encabezado}>Verificación</Text></View>
                <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
              </View>
              <FlatList
                data={barberosMostrar}
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

      <CrearBarbero
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateBarbero}
      />

      <DetalleBarbero
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        barbero={barberoSeleccionado}
      />

      <EditarBarbero
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        barbero={barberoSeleccionado}
        onUpdate={handleUpdateBarbero}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  columnaCedula: {
    flex: 2,
    alignItems: 'center',
  },
  columnaRol: {
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
    fontWeight: 'bold',
  },
  textoCedula: {
    textAlign: 'center',
    width: '100%',
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
  rolText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
  },
  estadoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  textoVerificado: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  textoNoVerificado: {
    color: '#d32f2f',
    fontWeight: 'bold',
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

export default BarberosScreen;