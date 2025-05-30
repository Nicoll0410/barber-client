import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import DetalleVenta from './DetalleVenta';

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
        paciente: 'a',
        precio: '$ 14.000.000',
        servicio: 'Masaje con crema de coco',
        descripcion: 'masajedfgdfgdfg',
        duracion: '30 minutos',
        direccion: 'Calle 65',
        profesional: 'Martha Cosmetólogo'
      },
      { 
        id: 2,
        fecha: '10 de septiembre de 2024',
        hora: '08:30 AM',
        paciente: 'Patricia And',
        precio: '$ 14.000.000',
        servicio: 'Masaje con...',
        descripcion: 'Descripción del servicio',
        duracion: '45 minutos',
        direccion: 'Calle 72',
        profesional: 'Ana Terapeuta'
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
        v.paciente.toLowerCase().includes(termino) || 
        v.servicio.toLowerCase().includes(termino) ||
        v.fecha.toLowerCase().includes(termino)
      );
      setVentasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, ventas]);

  const indiceInicial = (paginaActual - 1) * ventasPorPagina;
  const ventasMostrar = ventasFiltradas.slice(indiceInicial, indiceInicial + ventasPorPagina);
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
        placeholder="Buscar ventas por paciente, servicio o fecha"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaFecha]}>
            <Text style={styles.encabezado}>Fecha</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaHora]}>
            <Text style={styles.encabezado}>Hora</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaPaciente]}>
            <Text style={styles.encabezado}>Paciente</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaPrecio]}>
            <Text style={styles.encabezado}>Precio</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaServicio]}>
            <Text style={styles.encabezado}>Servicio</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}>
            <Text style={styles.encabezado}>Acciones</Text>
          </View>
        </View>

        <FlatList
          data={ventasMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaFecha]}>
                <Text style={styles.textoNombre}>{item.fecha}</Text>
              </View>
              <View style={[styles.celda, styles.columnaHora]}>
                <Text style={styles.textoNombre}>{item.hora}</Text>
              </View>
              <View style={[styles.celda, styles.columnaPaciente]}>
                <Text style={styles.textoNombre}>{item.paciente}</Text>
              </View>
              <View style={[styles.celda, styles.columnaPrecio]}>
                <View style={styles.precioContainer}>
                  <Text style={styles.textoPrecio}>{item.precio}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaServicio]}>
                <Text style={styles.textoDescripcion} numberOfLines={1}>{item.servicio}</Text>
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
          )}
        />
      </View>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        cambiarPagina={cambiarPagina}
      />

      <DetalleVenta
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        venta={ventaSeleccionada}
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
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontSize: 14,
    fontWeight: 'bold',
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
    borderBottomColor: 'black',
  },
  celdaEncabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
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
  columnaPaciente: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  columnaPrecio: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaServicio: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaAcciones: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoDescripcion: {
    color: '#666',
  },
  precioContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoPrecio: {
    color: '#4CAF50',
    fontWeight: '500',
    textAlign: 'center',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
});

export default VentasScreen;