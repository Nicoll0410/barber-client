import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import DetalleVenta from './DetalleVenta'; // Importamos el componente del modal

const VentasScreen = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [ventasPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    // Datos de ejemplo ampliados para incluir los detalles del modal
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
      // ... otros datos de ejemplo
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
        <Text style={styles.titulo}>Ventas ({ventasFiltradas.length})</Text>
      </View>

      <Buscador
        placeholder="Buscar ventas"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celda, styles.columnaFecha]}><Text style={styles.encabezado}>Fecha</Text></View>
          <View style={[styles.celda, styles.columnaHora]}><Text style={styles.encabezado}>Hora</Text></View>
          <View style={[styles.celda, styles.columnaPaciente]}><Text style={styles.encabezado}>Paciente</Text></View>
          <View style={[styles.celda, styles.columnaPrecio]}><Text style={styles.encabezado}>Precio</Text></View>
          <View style={[styles.celda, styles.columnaServicio]}><Text style={styles.encabezado}>Servicio</Text></View>
          <View style={[styles.celda, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
        </View>

        <FlatList
          data={ventasMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaFecha]}>
                <Text style={styles.textoNormal}>{item.fecha}</Text>
              </View>
              <View style={[styles.celda, styles.columnaHora]}>
                <Text style={styles.textoNormal}>{item.hora}</Text>
              </View>
              <View style={[styles.celda, styles.columnaPaciente]}>
                <Text style={styles.textoNormal}>{item.paciente}</Text>
              </View>
              <View style={[styles.celda, styles.columnaPrecio]}>
                <Text style={styles.textoNormal}>{item.precio}</Text>
              </View>
              <View style={[styles.celda, styles.columnaServicio]}>
                <Text style={styles.textoNormal}>{item.servicio}</Text>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <TouchableOpacity 
                  onPress={() => verVenta(item)} 
                  style={styles.botonAccion}
                >
                  <FontAwesome name="eye" size={20} color="#2196F3" />
                </TouchableOpacity>
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

      {/* Modal de detalle de venta */}
      <DetalleVenta
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        venta={ventaSeleccionada}
      />
    </View>
  );
};

// Estilos (se mantienen iguales)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
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
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  celda: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  columnaFecha: {
    flex: 2,
  },
  columnaHora: {
    flex: 1,
  },
  columnaPaciente: {
    flex: 1.5,
  },
  columnaPrecio: {
    flex: 1.5,
  },
  columnaServicio: {
    flex: 2,
  },
  columnaAcciones: {
    flex: 0.5,
    alignItems: 'center',
  },
  encabezado: {
    fontWeight: 'bold',
  },
  textoNormal: {
    fontWeight: 'normal',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
});

export default VentasScreen;