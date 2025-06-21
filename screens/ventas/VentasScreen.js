import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import DetalleVenta from './DetalleVenta';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const VentasScreen = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [ventasPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1,
        fecha: '11 de septiembre de 2024',
        hora: '08:00 AM',
        cliente: 'Juan Pérez',
        precio: '$ 45.000',
        servicio: 'Corte de cabello',
        descripcion: 'Corte clásico con tijera y máquina',
        duracion: '30 minutos',
        direccion: 'Calle 65',
        profesional: 'Carlos Barbero'
      },
      { 
        id: 2,
        fecha: '10 de septiembre de 2024',
        hora: '08:30 AM',
        cliente: 'Luis Gómez',
        precio: '$ 60.000',
        servicio: 'Afeitado clásico',
        descripcion: 'Afeitado con navaja y productos premium',
        duracion: '45 minutos',
        direccion: 'Calle 72',
        profesional: 'Pedro Barbero'
      },
      { 
        id: 3,
        fecha: '09 de septiembre de 2024',
        hora: '10:00 AM',
        cliente: 'Andrés Rodríguez',
        precio: '$ 75.000',
        servicio: 'Corte y barba',
        descripcion: 'Corte completo con arreglo de barba',
        duracion: '60 minutos',
        direccion: 'Carrera 15',
        profesional: 'Mario Barbero'
      },
    ];
    setVentas(datosEjemplo);
    setVentasFiltradas(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setVentasFiltradas(ventas);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(termino) || 
        v.servicio.toLowerCase().includes(termino) ||
        v.fecha.toLowerCase().includes(termino)
      );
      setVentasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, ventas]);

  const indiceInicial = (paginaActual - 1) * ventasPorPagina;
  const ventasMostrar = isMobile ? ventasFiltradas : ventasFiltradas.slice(indiceInicial, indiceInicial + ventasPorPagina);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSearchChange = (texto) => {
    setBusqueda(texto);
  };

  const verVenta = (venta) => {
    setVentaSeleccionada(venta);
    setModalDetalleVisible(true);
  };

  // Renderizado para móvil (tarjetas)
  const renderMobileItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.cliente}</Text>
          <Text style={styles.cardSubtitle}>{item.fecha} - {item.hora}</Text>
        </View>
        <View style={styles.precioContainer}>
          <Text style={styles.textoPrecio}>{item.precio}</Text>
        </View>
      </View>
      
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Servicio:</Text>
        <Text style={styles.cardValue}>{item.servicio}</Text>
      </View>
      
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Profesional:</Text>
        <Text style={styles.cardValue}>{item.profesional}</Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => verVenta(item)} style={styles.actionButton}>
          <FontAwesome name="eye" size={20} color="#424242" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizado para desktop (tabla)
  const renderDesktopItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={[styles.celda, styles.columnaFecha]}>
        <Text style={styles.textoNombre}>{item.fecha}</Text>
      </View>
      <View style={[styles.celda, styles.columnaHora]}>
        <Text style={styles.textoNombre}>{item.hora}</Text>
      </View>
      <View style={[styles.celda, styles.columnaCliente]}>
        <Text style={styles.textoNombre}>{item.cliente}</Text>
      </View>
      <View style={[styles.celda, styles.columnaServicio]}>
        <Text style={styles.textoServicio}>{item.servicio}</Text>
      </View>
      <View style={[styles.celda, styles.columnaPrecio]}>
        <View style={styles.precioContainer}>
          <Text style={styles.textoPrecio}>{item.precio}</Text>
        </View>
      </View>
      <View style={[styles.celda, styles.columnaAcciones]}>
        <View style={styles.contenedorAcciones}>
          <TouchableOpacity 
            onPress={() => verVenta(item)} 
            style={styles.botonAccion}
          >
            <FontAwesome name="eye" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Ventas</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{ventasFiltradas.length}</Text>
          </View>
        </View>
      </View>

      <Buscador
        placeholder="Buscar ventas por cliente, servicio o fecha"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {ventasMostrar.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No se encontraron ventas</Text>
        </View>
      ) : isMobile ? (
        <FlatList
          data={ventasMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMobileItem}
          contentContainerStyle={styles.listContainer}
          style={styles.mobileList}
        />
      ) : (
        <View style={styles.tabla}>
          <View style={styles.filaEncabezado}>
            <View style={[styles.celdaEncabezado, styles.columnaFecha]}>
              <Text style={styles.encabezado}>Fecha</Text>
            </View>
            <View style={[styles.celdaEncabezado, styles.columnaHora]}>
              <Text style={styles.encabezado}>Hora</Text>
            </View>
            <View style={[styles.celdaEncabezado, styles.columnaCliente]}>
              <Text style={styles.encabezado}>Cliente</Text>
            </View>
            <View style={[styles.celdaEncabezado, styles.columnaServicio]}>
              <Text style={styles.encabezado}>Servicio</Text>
            </View>
            <View style={[styles.celdaEncabezado, styles.columnaPrecio]}>
              <Text style={styles.encabezado}>Precio</Text>
            </View>
            <View style={[styles.celdaEncabezado, styles.columnaAcciones]}>
              <Text style={styles.encabezado}>Acciones</Text>
            </View>
          </View>
          <FlatList
            data={ventasMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDesktopItem}
            scrollEnabled={false}
          />
        </View>
      )}

      {!isMobile && (
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
        />
      )}

      <DetalleVenta
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        venta={ventaSeleccionada}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mobileList: {
    flex: 1,
    marginBottom: 16,
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
  listContainer: {
    paddingBottom: 16,
  },
  // Estilos para móvil (tarjetas)
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
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
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#424242',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 16,
  },
  precioContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoPrecio: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Estilos para desktop (tabla)
  tabla: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
    flex: 1,
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
  columnaFecha: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  columnaHora: {
    flex: 1,
    alignItems: 'center',
  },
  columnaCliente: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  columnaServicio: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaPrecio: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoServicio: {
    color: '#000',
    fontWeight: '500',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  botonAccion: {
    marginHorizontal: 6,
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

export default VentasScreen;