import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearProveedor from './CrearProveedor';
import DetalleProveedor from './DetalleProveedor';
import EditarProveedor from './EditarProveedor';
import Footer from '../../components/Footer';

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
        <MaterialIcons name="person" size={16} color="black" />
        <Text style={[styles.tipoTexto, styles.textoNegrita]}>Persona</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="business" size={16} color="black" />
        <Text style={[styles.tipoTexto, styles.textoNegrita]}>Empresa</Text>
      </>
    )}
  </View>
);

// Componente para el tipo de identificación
const TipoIdentificacion = ({ tipo }) => (
  <View style={styles.tipoIdContainer}>
    {tipo === 'CC' ? (
      <>
        <MaterialIcons name="badge" size={16} color="black" />
        <Text style={[styles.tipoIdTexto, styles.textoNegrita]}>Cédula</Text>
      </>
    ) : tipo === 'CE' ? (
      <>
        <MaterialIcons name="card-membership" size={16} color="black" />
        <Text style={[styles.tipoIdTexto, styles.textoNegrita]}>Cédula Ext.</Text>
      </>
    ) : (
      <>
        <MaterialIcons name="receipt" size={16} color="black" />
        <Text style={[styles.tipoIdTexto, styles.textoNegrita]}>NIT</Text>
      </>
    )}
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

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        tipo: 'Persona', 
        tipoIdentificacion: 'CC', 
        identificacion: '123456789', 
        nombre: 'Juan Pérez', 
        email: 'juan@example.com' 
      },
      { 
        id: 2, 
        tipo: 'Empresa', 
        tipoIdentificacion: 'NIT', 
        identificacion: '900123456-1', 
        nombre: 'Tech Solutions SAS', 
        email: 'contacto@techsolutions.com' 
      },
      { 
        id: 3, 
        tipo: 'Persona', 
        tipoIdentificacion: 'CE', 
        identificacion: 'EX123456', 
        nombre: 'María Gómez', 
        email: 'maria@example.com' 
      },
      { 
        id: 4, 
        tipo: 'Empresa', 
        tipoIdentificacion: 'NIT', 
        identificacion: '800987654-2', 
        nombre: 'Distribuciones ABC', 
        email: 'info@distribucionesabc.com' 
      },
    ];
    setProveedores(datosEjemplo);
    setProveedoresFiltrados(datosEjemplo);
  }, []);

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
  const proveedoresMostrar = proveedoresFiltrados.slice(indiceInicial, indiceInicial + proveedoresPorPagina);
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

  const eliminarProveedor = (id) => {
    const nuevosProveedores = proveedores.filter(p => p.id !== id);
    setProveedores(nuevosProveedores);
    setProveedoresFiltrados(nuevosProveedores);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Proveedores</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{proveedoresFiltrados.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botonCrear} onPress={crearProveedor}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.textoBoton}>Crear Proveedor</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar proveedores por nombre, identificación o email"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaTipo]}><Text style={styles.encabezado}>Tipo Proveedor</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaTipoId]}><Text style={styles.encabezado}>Tipo ID</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaIdentificacion]}><Text style={styles.encabezado}>Identificación</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaEmail]}><Text style={styles.encabezado}>Email</Text></View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={proveedoresMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaTipo]}>
                <TipoProveedor tipo={item.tipo} />
              </View>
              <View style={[styles.celda, styles.columnaTipoId]}>
                <TipoIdentificacion tipo={item.tipoIdentificacion} />
              </View>
              <View style={[styles.celda, styles.columnaIdentificacion]}>
                <Text style={[styles.textoIdentificacion, styles.textoNegrita]}>{item.identificacion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaNombre]}>
                <View style={styles.contenedorNombre}>
                  <Avatar nombre={item.nombre} />
                  <Text style={[styles.textoNombre, styles.textoNegrita]}>{item.nombre}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaEmail]}>
                <Text style={[styles.textoEmail, styles.textoNegrita]}>{item.email}</Text>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => verProveedor(item.id)} style={styles.botonAccion}>
                    <FontAwesome name="eye" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editarProveedor(item.id)} style={styles.botonAccion}>
                    <Feather name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarProveedor(item.id)} style={styles.botonAccion}>
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
    borderRadius: 20,
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
    paddingHorizontal: 4,
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
    paddingHorizontal: 4,
  },
  columnaTipo: {
    flex: 1,
    alignItems: 'center',
  },
  columnaTipoId: {
    flex: 1,
    alignItems: 'center',
  },
  columnaIdentificacion: {
    flex: 2,
    alignItems: 'center',
  },
  columnaNombre: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaEmail: {
    flex: 2,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  contenedorNombre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoNombre: {
    marginLeft: 10,
  },
  textoIdentificacion: {
    textAlign: 'center',
    width: '100%',
  },
  textoEmail: {
    textAlign: 'center',
    width: '100%',
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
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
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: 'black',
  },
  tipoIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoIdTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: 'black',
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
  textoNegrita: {
    fontWeight: 'bold',
  },
});

export default ProveedoresScreen;