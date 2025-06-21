import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearRol from './CrearRol';
import DetalleRol from './DetalleRol';
import EditarRol from './EditarRol';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Mobile Role Card
const RolCard = ({ item, onVer, onEditar, onEliminar }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Text style={styles.cardDescripcion}>{item.descripcion}</Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Asociados:</Text>
        <View style={styles.asociadosBadge}>
          <Text style={styles.asociadosText}>{item.asociados}</Text>
        </View>
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
  const rolesMostrar = isMobile ? rolesFiltrados : rolesFiltrados.slice(indiceInicial, indiceInicial + rolesPorPagina);
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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Roles</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{rolesFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={crearRol}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar roles por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {!isMobile ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.nameColumn]}><Text style={styles.headerText}>Nombre</Text></View>
            <View style={[styles.headerCell, styles.descColumn]}><Text style={styles.headerText}>Descripción</Text></View>
            <View style={[styles.headerCell, styles.asociadosColumn]}><Text style={styles.headerText}>Asociados</Text></View>
            <View style={[styles.headerCell, styles.actionsColumn]}><Text style={styles.headerText}>Acciones</Text></View>
          </View>

          <FlatList
            data={rolesMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.nameColumn]}>
                  <Text style={styles.nameText}>{item.nombre}</Text>
                </View>
                <View style={[styles.cell, styles.descColumn]}>
                  <Text style={styles.descText}>{item.descripcion}</Text>
                </View>
                <View style={[styles.cell, styles.asociadosColumn]}>
                  <View style={styles.asociadosBadge}>
                    <Text style={styles.asociadosText}>{item.asociados}</Text>
                  </View>
                </View>
                <View style={[styles.cell, styles.actionsColumn]}>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => verRol(item.id)} style={styles.actionIcon}>
                      <FontAwesome name="eye" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => editarRol(item.id)} style={styles.actionIcon}>
                      <Feather name="edit" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarRol(item.id)} style={styles.actionIcon}>
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
            {rolesFiltrados.map(item => (
              <RolCard 
                key={item.id.toString()}
                item={item}
                onVer={verRol}
                onEditar={editarRol}
                onEliminar={eliminarRol}
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
    flex: 2,
    alignItems: 'flex-start',
  },
  descColumn: {
    flex: 3,
    alignItems: 'flex-start',
  },
  asociadosColumn: {
    flex: 1,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  nameText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
  },
  descText: {
    fontSize: 14,
    color: '#616161',
  },
  asociadosBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 30,
    alignItems: 'center',
  },
  asociadosText: {
    fontWeight: 'bold',
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
    flex: 1,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cardDescripcion: {
    fontSize: 14,
    color: '#757575',
  },
  cardDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#616161',
    marginRight: 8,
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
});

export default RolesScreen;