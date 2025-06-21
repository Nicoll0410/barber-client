import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

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

  // Solo usamos paginación en desktop
  const insumosMostrar = isMobile 
    ? insumosFiltrados 
    : insumosFiltrados.slice(
        (paginaActual - 1) * insumosPorPagina, 
        (paginaActual - 1) * insumosPorPagina + insumosPorPagina
      );

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

  // Renderizado para móvil (tarjetas)
  const renderMobileItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardSubtitle}>{item.categoria}</Text>
        </View>
        <View style={styles.unidadContainer}>
          <Text style={styles.textoUnidad}>{item.unidad}</Text>
        </View>
      </View>
      
      <Text style={styles.cardDescription}>{item.descripcion}</Text>
      
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Cantidad:</Text>
        <View style={styles.cantidadContainer}>
          <Text style={styles.textoCantidad}>{item.cantidad}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TextInput
          style={styles.inputCantidad}
          keyboardType="numeric"
          placeholder="Cantidad"
          value={cantidadReducir[item.id] ? cantidadReducir[item.id].toString() : ''}
          onChangeText={(text) => handleCantidadChange(item.id, text)}
        />
        <TouchableOpacity 
          onPress={() => reducirInsumo(item.id)} 
          style={[styles.botonReducir, item.cantidad <= 0 && styles.botonDisabled]}
          disabled={item.cantidad <= 0}
        >
          <MaterialIcons name="remove" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizado para desktop (tabla)
  const renderDesktopItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={[styles.celda, styles.columnaNombre]}>
        <Text style={styles.textoNombre}>{item.nombre}</Text>
      </View>
      <View style={[styles.celda, styles.columnaDescripcion]}>
        <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
      </View>
      <View style={[styles.celda, styles.columnaCategoria]}>
        <Text style={styles.textoCategoria}>{item.categoria}</Text>
      </View>
      <View style={[styles.celda, styles.columnaUnidad]}>
        <View style={styles.unidadContainer}>
          <Text style={styles.textoUnidad}>{item.unidad}</Text>
        </View>
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
  );

  // Render diferente para móvil y desktop
  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <View style={styles.mobileContent}>
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

          {insumosMostrar.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No se encontraron insumos</Text>
            </View>
          ) : (
            <FlatList
              data={insumosMostrar}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMobileItem}
              contentContainerStyle={styles.mobileListContainer}
              style={styles.mobileFlatList}
            />
          )}
        </View>
        
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

        {insumosMostrar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se encontraron insumos</Text>
          </View>
        ) : (
          <View style={styles.tabla}>
            <View style={styles.filaEncabezado}>
              <View style={[styles.celdaEncabezado, styles.columnaNombre]}><Text style={styles.encabezado}>Nombre</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaDescripcion]}><Text style={styles.encabezado}>Descripción</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaCategoria]}><Text style={styles.encabezado}>Categoría</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaUnidad]}><Text style={styles.encabezado}>Unidad</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaCantidad]}><Text style={styles.encabezado}>Cantidad</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Reducir</Text></View>
            </View>
            <FlatList
              data={insumosMostrar}
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
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  inputCantidad: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 14,
  },
  botonReducir: {
    backgroundColor: '#424242',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonDisabled: {
    backgroundColor: '#cccccc',
  },
  unidadContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoUnidad: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
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
    backgroundColor: 'white',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 8,
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
  columnaUnidad: {
    flex: 1,
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
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ControlInsumos;