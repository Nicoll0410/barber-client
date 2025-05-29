import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';

const ControlInsumos = ({ route, navigation }) => {
  const { insumos: insumosIniciales = [] } = route.params || {};
  
  const [insumos, setInsumos] = useState(insumosIniciales);
  const [insumosFiltrados, setInsumosFiltrados] = useState(insumosIniciales);
  const [paginaActual, setPaginaActual] = useState(1);
  const [insumosPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState('');
  const [cantidadReducir, setCantidadReducir] = useState({});

  useEffect(() => {
    if (insumosIniciales.length === 0) {
      Alert.alert('Información', 'No se recibieron insumos, mostrando datos de ejemplo');
      const datosEjemplo = [
        { 
          id: 1, 
          nombre: 'crema chocolate', 
          descripcion: 'crema actualizada', 
          cantidad: 0,
          categoria: 'Repostería',
          unidad: 'gramos'
        },
        { 
          id: 2, 
          nombre: 'crema de chocolate', 
          descripcion: 'chocolate', 
          cantidad: 90,
          categoria: 'Repostería',
          unidad: 'gramos'
        },
        { 
          id: 3, 
          nombre: 'Hidratante de coco', 
          descripcion: 'asijklasjdl', 
          cantidad: 400,
          categoria: 'Cuidado personal',
          unidad: 'mililitros'
        },
        { 
          id: 4, 
          nombre: 'wilson insumo', 
          descripcion: 'wilson', 
          cantidad: 25,
          categoria: 'Otros',
          unidad: 'unidades'
        },
      ];
      setInsumos(datosEjemplo);
      setInsumosFiltrados(datosEjemplo);
    }
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setInsumosFiltrados(insumos);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = insumos.filter(i =>
        i.nombre.toLowerCase().includes(termino) || 
        i.descripcion.toLowerCase().includes(termino)
      );
      setInsumosFiltrados(filtrados);
    }
    setPaginaActual(1);
  }, [busqueda, insumos]);

  const indiceInicial = (paginaActual - 1) * insumosPorPagina;
  const insumosMostrar = insumosFiltrados.slice(indiceInicial, indiceInicial + insumosPorPagina);
  const totalPaginas = Math.ceil(insumosFiltrados.length / insumosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCantidadChange = (id, value) => {
    setCantidadReducir(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }));
  };

  const reducirInsumo = (id) => {
    const cantidad = cantidadReducir[id] || 0;
    if (cantidad <= 0) {
      Alert.alert('Error', 'La cantidad debe ser mayor a cero');
      return;
    }

    const nuevosInsumos = insumos.map(i => {
      if (i.id === id) {
        if (i.cantidad < cantidad) {
          Alert.alert('Error', 'No hay suficiente cantidad para reducir');
          return i;
        }
        return { 
          ...i, 
          cantidad: i.cantidad - cantidad 
        };
      }
      return i;
    });
    
    setInsumos(nuevosInsumos);
    setInsumosFiltrados(nuevosInsumos);
    setCantidadReducir(prev => ({
      ...prev,
      [id]: 0
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Control de insumos</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{insumosFiltrados.length}</Text>
          </View>
        </View>
      </View>

      <Buscador
        placeholder="Buscar insumos por nombre o descripción"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      <View style={styles.tabla}>
        <View style={styles.filaEncabezado}>
          <View style={[styles.celdaEncabezado, styles.columnaNombre]}>
            <Text style={styles.encabezado}>Nombre</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}>
            <Text style={styles.encabezado}>Descripción</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaCategoria]}>
            <Text style={styles.encabezado}>Categoría</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaCantidad]}>
            <Text style={styles.encabezado}>Cantidad</Text>
          </View>
          <View style={[styles.celdaEncabezado, styles.columnaAcciones]}>
            <Text style={styles.encabezado}>Reducir</Text>
          </View>
        </View>

        <FlatList
          data={insumosMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View style={[styles.celda, styles.columnaNombre]}>
                <Text style={styles.textoNombre} numberOfLines={1}>{item.nombre}</Text>
              </View>
              <View style={[styles.celda, styles.columnaDescripcion]}>
                <Text style={styles.textoDescripcion} numberOfLines={1}>{item.descripcion}</Text>
              </View>
              <View style={[styles.celda, styles.columnaCategoria]}>
                <Text style={styles.textoCategoria}>{item.categoria}</Text>
              </View>
              <View style={[styles.celda, styles.columnaCantidad]}>
                <View style={styles.cantidadContainer}>
                  <Text style={styles.textoCantidad}>{item.cantidad}</Text>
                </View>
              </View>
              <View style={[styles.celda, styles.columnaAcciones]}>
                <View style={styles.contenedorAcciones}>
                  <TextInput
                    style={styles.inputCantidad}
                    keyboardType="numeric"
                    placeholder="Cant."
                    value={cantidadReducir[item.id] ? cantidadReducir[item.id].toString() : ''}
                    onChangeText={(text) => handleCantidadChange(item.id, text)}
                  />
                  <TouchableOpacity 
                    onPress={() => reducirInsumo(item.id)} 
                    style={[styles.botonReducir, item.cantidad <= 0 && styles.botonDisabled]}
                    disabled={item.cantidad <= 0}
                  >
                    <MaterialIcons name="remove" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
        />
      </View>

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
    marginRight: 8,
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
    fontSize: 14,
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
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  separador: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  columnaNombre: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaDescripcion: {
    flex: 3,
    alignItems: 'flex-start',
  },
  columnaCategoria: {
    flex: 2,
    alignItems: 'center',
  },
  columnaCantidad: {
    flex: 1,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'center',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoDescripcion: {
    color: '#666',
  },
  textoCategoria: {
    color: '#555',
    fontWeight: '500',
  },
  cantidadContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCantidad: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 12,
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCantidad: {
    width: 60,
    height: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 8,
    marginRight: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  botonReducir: {
    backgroundColor: '#424242',
    borderRadius: 15,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default ControlInsumos;