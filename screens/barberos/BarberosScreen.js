import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearBarbero from './CrearBarbero';
import DetalleBarbero from './DetalleBarbero';
import EditarBarbero from './EditarBarbero';

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

// Componente para el rol del barbero
const RolBadge = ({ rol }) => (
  <View style={styles.rolBadge}>
    <Text style={styles.rolText}>{rol}</Text>
  </View>
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
        rol: 'Barbero Senior', 
        emailVerificado: false 
      },
      { 
        id: 2, 
        nombre: 'Carlos Gómez', 
        cedula: '987654321', 
        rol: 'Barbero Junior', 
        emailVerificado: true 
      },
      { 
        id: 3, 
        nombre: 'Luis Martínez', 
        cedula: '456789123', 
        rol: 'Aprendiz', 
        emailVerificado: false 
      },
      { 
        id: 4, 
        nombre: 'Pedro Rodríguez', 
        cedula: '321654987', 
        rol: 'Barbero Master', 
        emailVerificado: true 
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

  const indiceInicial = (paginaActual - 1) * barberosPorPagina;
  const barberosMostrar = barberosFiltrados.slice(indiceInicial, indiceInicial + barberosPorPagina);
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
      emailVerificado: false 
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Barberos</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{barberosFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearBarbero}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Barbero</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar barberos por nombre o cédula"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

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
          renderItem={({ item }) => (
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
                <EstadoVerificacion verificado={item.emailVerificado} />
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  {!item.emailVerificado && (
                    <TouchableOpacity onPress={() => reenviarEmail(item.id)} style={styles.botonAccion}>
                      <MaterialIcons name="email" size={20} color="black" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => verBarbero(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarBarbero(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarBarbero(item.id)} style={styles.botonAccion}>
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
  },
  textoCedula: {
    textAlign: 'center',
    width: '100%',
  },
  rolBadge: {
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  rolText: {
    textAlign: 'center',
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

export default BarberosScreen;