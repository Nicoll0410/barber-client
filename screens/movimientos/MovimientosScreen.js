import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';

const MovimientosScreen = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [movimientosPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Datos de ejemplo basados en la imagen proporcionada
    const datosEjemplo = [
      { 
        id: 1,
        insumo: 'Crema de chocolates', 
        descripcion: 'chocolate', 
        unidades: 5, 
        fecha: '21 de mayo de 2025' 
      },
      { 
        id: 2,
        insumo: 'Crema de chocolates', 
        descripcion: 'chocolate', 
        unidades: 5, 
        fecha: '13 de diciembre de 2024' 
      },
      { 
        id: 3,
        insumo: 'Hidratante de cabello', 
        descripcion: 'asjklsajdl', 
        unidades: 100, 
        fecha: '17 de septiembre de 2024' 
      },
      { 
        id: 4,
        insumo: 'Wilson insumo', 
        descripcion: 'wilson', 
        unidades: 5, 
        fecha: '13 de septiembre de 2024' 
      },
      { 
        id: 5,
        insumo: 'Crema de chocolate', 
        descripcion: 'Crema para chocolaterapias', 
        unidades: 10, 
        fecha: '6 de septiembre de 2024' 
      },
    ];
    setMovimientos(datosEjemplo);
    setMovimientosFiltrados(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setMovimientosFiltrados(movimientos);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = movimientos.filter(m =>
        m.insumo.toLowerCase().includes(termino) || 
        m.descripcion.toLowerCase().includes(termino)
      );
      setMovimientosFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, movimientos]);

  // Calcular movimientos para la página actual
  const indiceInicial = (paginaActual - 1) * movimientosPorPagina;
  const movimientosMostrar = movimientosFiltrados.slice(indiceInicial, indiceInicial + movimientosPorPagina);
  const totalPaginas = Math.ceil(movimientosFiltrados.length / movimientosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSearchChange = (texto) => {
    setBusqueda(texto);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registro de movimientos ({movimientosFiltrados.length})</Text>
      </View>

      <Buscador
        placeholder="Buscar registro de movimientos"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        {/* Encabezados de la tabla */}
        <View style={styles.filaEncabezado}>
          <View style={[styles.celda, styles.columnaInsumo]}>
            <Text style={styles.encabezado}>Insumo</Text>
          </View>
          <View style={[styles.celda, styles.columnaDescripcion]}>
            <Text style={styles.encabezado}>Descripción</Text>
          </View>
          <View style={[styles.celda, styles.columnaUnidades]}>
            <Text style={styles.encabezado}>Unidades</Text>
          </View>
          <View style={[styles.celda, styles.columnaFecha]}>
            <Text style={styles.encabezado}>Fecha</Text>
          </View>
        </View>

        {/* Lista de movimientos */}
        <FlatList
          data={movimientosMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaInsumo]}>
                <Text style={styles.textoNegrita}>{item.insumo}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoNormal}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaUnidades]}>
                <Text style={styles.textoNormal}>{item.unidades}</Text>
              </View>
              <View style={[styles.celda, styles.columnaFecha]}>
                <Text style={styles.textoNormal}>{item.fecha}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Componente de paginación */}
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        cambiarPagina={cambiarPagina}
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
  },
  celda: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  columnaInsumo: {
    flex: 2,
  },
  columnaDescripcion: {
    flex: 2,
  },
  columnaUnidades: {
    flex: 1,
    alignItems: 'center',
  },
  columnaFecha: {
    flex: 2,
  },
  encabezado: {
    fontWeight: 'bold',
  },
  textoNegrita: {
    fontWeight: 'bold',
  },
  textoNormal: {
    fontWeight: 'normal',
  },
});

export default MovimientosScreen;