import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearProveedor from './CrearProveedor';
import DetalleProveedor from './DetalleProveedor';
import EditarProveedor from './EditarProveedor';
import Footer from '../../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Componente para el avatar del proveedor
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

// Componente para el tipo de proveedor
const TipoProveedor = ({ tipo }) => (
  <View style={styles.tipoContainer}>
    {tipo === 'Persona' ? (
      <>
        <MaterialIcons name="person" size={16} color="#424242" />
        <Text style={styles.tipoTexto}>Persona</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="business" size={16} color="#424242" />
        <Text style={styles.tipoTexto}>Empresa</Text>
      </>
    )}
  </View>
);

// Componente para el tipo de identificación
const TipoIdentificacion = ({ tipo }) => (
  <View style={styles.tipoIdContainer}>
    {tipo === 'CC' ? (
      <>
        <MaterialIcons name="badge" size={16} color="#424242" />
        <Text style={styles.tipoIdTexto}>Cédula</Text>
      </>
    ) : tipo === 'CE' ? (
      <>
        <MaterialIcons name="card-membership" size={16} color="#424242" />
        <Text style={styles.tipoIdTexto}>Cédula Ext.</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="receipt" size={16} color="#424242" />
        <Text style={styles.tipoIdTexto}>NIT</Text>
      </>
    )}
  </View>
);

// Mobile Provider Card
const ProveedorCard = ({ item, onVer, onEditar, onEliminar }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Avatar nombre={item.nombre} />
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Text style={styles.cardTipo}>
          {item.tipo === 'Persona' ? 'Persona natural' : 'Empresa'}
        </Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <MaterialIcons name="fingerprint" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>{item.tipoIdentificacion}: {item.identificacion}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="email" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>{item.email}</Text>
      </View>
    </View>
    
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onVer(item.id)}>
        <FontAwesome name="eye" size={18} color="#424242" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEditar(item.id)}>
        <Feather name="edit" size={18} color="#424242" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEliminar(item.id)}>
        <Feather name="trash-2" size={18} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  </View>
);

const ProveedoresScreen = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [proveedoresPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const fetchProveedores = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/proveedores/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const datos = response.data.proveedores || [];
      setProveedores(datos);
      setProveedoresFiltrados(datos);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };
  
  useEffect(() => {
    fetchProveedores();
  }, []);

  // Esto es OPCIONAL. Util para desarrollo
  useFocusEffect(
    useCallback(() => {
      fetchProveedores();
    }, [])
  );

  useEffect(() => {
    if (busqueda.trim() === '') {
      setProveedoresFiltrados(proveedores);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(termino) || 
        p.identificacion.includes(busqueda) ||
        p.email.toLowerCase().includes(termino)
      );
      setProveedoresFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, proveedores]);

  const indiceInicial = (paginaActual - 1) * proveedoresPorPagina;
  const proveedoresMostrar = isMobile ? proveedoresFiltrados : proveedoresFiltrados.slice(indiceInicial, indiceInicial + proveedoresPorPagina);
  const totalPaginas = Math.ceil(proveedoresFiltrados.length / proveedoresPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearProveedor = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateProveedor = (newProveedor) => {
    const newId = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
    const nuevoProveedor = { 
      id: newId, 
      ...newProveedor
    };
    const nuevosProveedores = [...proveedores, nuevoProveedor];
    setProveedores(nuevosProveedores);
    setProveedoresFiltrados(nuevosProveedores);
    setModalVisible(false);
  };

  const verProveedor = (id) => {
    const proveedor = proveedores.find(p => p.id === id);
    setProveedorSeleccionado(proveedor);
    setModalDetalleVisible(true);
  };

  const editarProveedor = (id) => {
    const proveedor = proveedores.find(p => p.id === id);
    setProveedorSeleccionado(proveedor);
    setModalEditarVisible(true);
  };

  const handleUpdateProveedor = (updatedProveedor) => {
    const nuevosProveedores = proveedores.map(p => 
      p.id === updatedProveedor.id ? updatedProveedor : p
    );
    setProveedores(nuevosProveedores);
    setProveedoresFiltrados(nuevosProveedores);
    setModalEditarVisible(false);
  };

  const eliminarProveedor = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:8080/proveedores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const nuevosProveedores = proveedores.filter(p => p.id !== id);
      setProveedores(nuevosProveedores)
      setProveedoresFiltrados(nuevosProveedores)
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Proveedores</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{proveedoresFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={crearProveedor}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear Proveedor</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar proveedores por nombre, identificación o email"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {!isMobile ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.typeColumn]}><Text style={styles.headerText}>Tipo Proveedor</Text></View>
            <View style={[styles.headerCell, styles.idTypeColumn]}><Text style={styles.headerText}>Tipo ID</Text></View>
            <View style={[styles.headerCell, styles.idColumn]}><Text style={styles.headerText}>Identificación</Text></View>
            <View style={[styles.headerCell, styles.nameColumn]}><Text style={styles.headerText}>Nombre</Text></View>
            <View style={[styles.headerCell, styles.emailColumn]}><Text style={styles.headerText}>Email</Text></View>
            <View style={[styles.headerCell, styles.actionsColumn]}><Text style={styles.headerText}>Acciones</Text></View>
          </View>

          <FlatList
            data={proveedoresMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.typeColumn]}>
                  <TipoProveedor tipo={item.tipo} />
                </View>
                <View style={[styles.cell, styles.idTypeColumn]}>
                  <TipoIdentificacion tipo={item.tipoIdentificacion} />
                </View>
                <View style={[styles.cell, styles.idColumn]}>
                  <Text style={styles.idText}>{item.identificacion}</Text>
                </View>
                <View style={[styles.cell, styles.nameColumn]}>
                  <View style={styles.nameContainer}>
                    <Avatar nombre={item.nombre} />
                    <Text style={styles.nameText}>{item.nombre}</Text>
                  </View>
                </View>
                <View style={[styles.cell, styles.emailColumn]}>
                  <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <View style={[styles.cell, styles.actionsColumn]}>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => verProveedor(item.id)} style={styles.actionIcon}>
                      <FontAwesome name="eye" size={20} color="#424242" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => editarProveedor(item.id)} style={styles.actionIcon}>
                      <Feather name="edit" size={20} color="#424242" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarProveedor(item.id)} style={styles.actionIcon}>
                      <Feather name="trash-2" size={20} color="#d32f2f" />
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
            {proveedoresMostrar.map(item => (
              <ProveedorCard 
                key={item.id.toString()}
                item={item}
                onVer={verProveedor}
                onEditar={editarProveedor}
                onEliminar={eliminarProveedor}
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

      <CrearProveedor
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateProveedor}
      />

      <DetalleProveedor
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        proveedor={proveedorSeleccionado}
      />

      <EditarProveedor
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        proveedor={proveedorSeleccionado}
        onUpdate={handleUpdateProveedor}
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
  typeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  idTypeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  idColumn: {
    flex: 2,
    alignItems: 'center',
  },
  nameColumn: {
    flex: 3,
    alignItems: 'flex-start',
  },
  emailColumn: {
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
  idText: {
    fontSize: 14,
    color: '#424242',
  },
  emailText: {
    fontSize: 14,
    color: '#424242',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginHorizontal: 6,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoTexto: {
    marginLeft: 6,
    fontSize: 14,
    color: '#424242',
  },
  tipoIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoIdTexto: {
    marginLeft: 6,
    fontSize: 14,
    color: '#424242',
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
  cardTipo: {
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

export default ProveedoresScreen;