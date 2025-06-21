import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearBarbero from './CrearBarbero';
import DetalleBarbero from './DetalleBarbero';
import EditarBarbero from './EditarBarbero';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Componente para el avatar del barbero
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
  <View style={styles.estadoContainer}>
    {verificado ? (
      <Text style={styles.textoVerificado}>Verificado</Text>
    ) : (
      <Text style={styles.textoNoVerificado}>No verificado</Text>
    )}
  </View>
);

// Componente para el rol del barbero
const RolBadge = ({ rol }) => (
  <Text style={styles.rolText}>{rol}</Text>
);

const BarberosScreen = () => {
  const [barberos, setBarberos] = useState([]);
  const [barberosFiltrados, setBarberosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [barberosPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Juan Pérez', 
        cedula: '123456789', 
        telefono: '3223404990',
        email: 'juan@example.com',
        rol: 'Barbero Senior', 
        verificado: false 
      },
      { 
        id: 2, 
        nombre: 'Carlos Gómez', 
        cedula: '987654321', 
        telefono: '3101234567',
        email: 'carlos@example.com',
        rol: 'Barbero Junior', 
        verificado: true 
      },
      { 
        id: 3, 
        nombre: 'Luis Martínez', 
        cedula: '456789123', 
        telefono: '3202345678',
        email: 'luis@example.com',
        rol: 'Aprendiz', 
        verificado: false 
      },
    ];
    setBarberos(datosEjemplo);
    setBarberosFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setBarberosFiltrados(barberos);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = barberos.filter(b =>
        b.nombre.toLowerCase().includes(termino) || 
        b.cedula.includes(busqueda)
      );
      setBarberosFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, barberos]);

  // Solo usamos paginación en desktop
  const barberosMostrar = isMobile 
    ? barberosFiltrados 
    : barberosFiltrados.slice(
        (paginaActual - 1) * barberosPorPagina, 
        (paginaActual - 1) * barberosPorPagina + barberosPorPagina
      );

  const totalPaginas = Math.ceil(barberosFiltrados.length / barberosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearBarbero = () => setModalVisible(true);

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateBarbero = (newBarbero) => {
    const newId = barberos.length > 0 ? Math.max(...barberos.map(b => b.id)) + 1 : 1;
    const nuevoBarbero = { 
      id: newId, 
      ...newBarbero, 
      verificado: false 
    };
    const nuevosBarberos = [...barberos, nuevoBarbero];
    setBarberos(nuevosBarberos);
    setBarberosFiltrados(nuevosBarberos);
    setModalVisible(false);
  };

  const reenviarEmail = (id) => console.log(`Reenviar email a barbero con ID: ${id}`);

  const verBarbero = (id) => {
    const barbero = barberos.find(b => b.id === id);
    setBarberoSeleccionado(barbero);
    setModalDetalleVisible(true);
  };

  const editarBarbero = (id) => {
    const barbero = barberos.find(b => b.id === id);
    setBarberoSeleccionado(barbero);
    setModalEditarVisible(true);
  };

  const handleUpdateBarbero = (updatedBarbero) => {
    const nuevosBarberos = barberos.map(b => 
      b.id === updatedBarbero.id ? updatedBarbero : b
    );
    setBarberos(nuevosBarberos);
    setBarberosFiltrados(nuevosBarberos);
    setModalEditarVisible(false);
  };

  const eliminarBarbero = (id) => {
    const nuevosBarberos = barberos.filter(b => b.id !== id);
    setBarberos(nuevosBarberos);
    setBarberosFiltrados(nuevosBarberos);
  };

  const renderMobileItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Avatar nombre={item.nombre} />
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardSubtitle}>{item.telefono}</Text>
          <Text style={styles.cardSubtitle}>{item.email}</Text>
        </View>
      </View>
      
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Rol: <RolBadge rol={item.rol} /></Text>
        <EstadoVerificacion verificado={item.verificado} />
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => verBarbero(item.id)} style={styles.actionButton}>
          <FontAwesome name="eye" size={20} color="#424242" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editarBarbero(item.id)} style={styles.actionButton}>
          <Feather name="edit" size={20} color="#424242" />
        </TouchableOpacity>
        {!item.verificado && (
          <TouchableOpacity onPress={() => reenviarEmail(item.id)} style={styles.actionButton}>
            <MaterialIcons name="email" size={20} color="#424242" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => eliminarBarbero(item.id)} style={styles.actionButton}>
          <Feather name="trash-2" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDesktopItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={[styles.celda, styles.columnaNombre]}>
        <View style={styles.contenedorNombre}>
          <Avatar nombre={item.nombre} />
          <Text style={styles.textoNombre}>{item.nombre}</Text>
        </View>
      </View>
      <View style={[styles.celda, styles.columnaCedula]}>
        <Text style={styles.textoCedula}>{item.cedula}</Text>
      </View>
      <View style={[styles.celda, styles.columnaRol]}>
        <RolBadge rol={item.rol} />
      </View>
      <View style={[styles.celda, styles.columnaVerificado]}>
        <EstadoVerificacion verificado={item.verificado} />
      </View>
      <View style={[styles.celda, styles.columnaAcciones]}>
        <View style={styles.contenedorAcciones}>
          <TouchableOpacity onPress={() => verBarbero(item.id)} style={styles.botonAccion}>
            <FontAwesome name="eye" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editarBarbero(item.id)} style={styles.botonAccion}>
            <Feather name="edit" size={20} color="black" />
          </TouchableOpacity>
          {!item.verificado && (
            <TouchableOpacity onPress={() => reenviarEmail(item.id)} style={styles.botonAccion}>
              <MaterialIcons name="email" size={20} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => eliminarBarbero(item.id)} style={styles.botonAccion}>
            <Feather name="trash-2" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render diferente para móvil y desktop
  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <View style={styles.mobileContent}>
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
            placeholder="Buscar barberos por nombre o cédula"
            value={busqueda}
            onChangeText={handleSearchChange}
          />

          {barberosMostrar.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No se encontraron barberos</Text>
            </View>
          ) : (
            <FlatList
              data={barberosMostrar}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMobileItem}
              contentContainerStyle={styles.mobileListContainer}
              style={styles.mobileFlatList}
            />
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
  }

  // Render para desktop
  return (
    <View style={styles.desktopContainer}>
      <View style={styles.desktopContent}>
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
          placeholder="Buscar barberos por nombre o cédula"
          value={busqueda}
          onChangeText={handleSearchChange}
        />

        {barberosMostrar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se encontraron barberos</Text>
          </View>
        ) : (
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
        )}

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
        />
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
  // Estilos base
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
  // Estilos para móvil
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
  // Estilos para desktop
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
  // Estilos compartidos
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default BarberosScreen;