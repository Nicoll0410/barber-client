import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Mobile Movement Card
const MovimientoCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardNombre}>{item.insumo}</Text>
        <Text style={styles.cardDescripcion}>{item.descripcion}</Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <MaterialIcons name="format-list-numbered" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>Unidades: {item.unidades}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="date-range" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>{item.fecha}</Text>
      </View>
    </View>
  </View>
);

const MovimientosScreen = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [movimientosPorPagina] = useState(isMobile ? 4 : 5);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1,
        insumo: 'Tijeras profesionales', 
        descripcion: 'Tijeras de acero inoxidable para cortes precisos', 
        unidades: 5, 
        fecha: '21 de mayo de 2025' 
      },
      { 
        id: 2,
        insumo: 'Máquina de cortar', 
        descripcion: 'Máquina Wahl premium para degradados', 
        unidades: 3, 
        fecha: '13 de diciembre de 2024' 
      },
      { 
        id: 3,
        insumo: 'Gel fijador', 
        descripcion: 'Gel fuerte hold para peinados modernos', 
        unidades: 12, 
        fecha: '17 de septiembre de 2024' 
      },
      { 
        id: 4,
        insumo: 'Navajas desechables', 
        descripcion: 'Paquete de 100 navajas para afeitado', 
        unidades: 8, 
        fecha: '13 de septiembre de 2024' 
      },
      { 
        id: 5,
        insumo: 'Crema de afeitar', 
        descripcion: 'Crema premium para afeitado suave', 
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

  const indiceInicial = (paginaActual - 1) * movimientosPorPagina;
  const movimientosMostrar = isMobile 
    ? movimientosFiltrados 
    : movimientosFiltrados.slice(indiceInicial, indiceInicial + movimientosPorPagina);
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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Registro de movimientos</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{movimientosFiltrados.length}</Text>
          </View>
        </View>
      </View>

      <Buscador
        placeholder="Buscar registro de movimientos"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {!isMobile ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.insumoColumn]}><Text style={styles.headerText}>Insumo</Text></View>
            <View style={[styles.headerCell, styles.descripcionColumn]}><Text style={styles.headerText}>Descripción</Text></View>
            <View style={[styles.headerCell, styles.unidadesColumn]}><Text style={styles.headerText}>Unidades</Text></View>
            <View style={[styles.headerCell, styles.fechaColumn]}><Text style={styles.headerText}>Fecha</Text></View>
          </View>

          <FlatList
            data={movimientosMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.insumoColumn]}>
                  <Text style={styles.textoNombre}>{item.insumo}</Text>
                </View>
                <View style={[styles.cell, styles.descripcionColumn]}>
                  <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
                </View>
                <View style={[styles.cell, styles.unidadesColumn]}>
                  <View style={styles.unidadesContainer}>
                    <Text style={styles.textoUnidades}>{item.unidades}</Text>
                  </View>
                </View>
                <View style={[styles.cell, styles.fechaColumn]}>
                  <View style={styles.fechaContainer}>
                    <Text style={styles.textoFecha}>{item.fecha}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {movimientosMostrar.map(item => (
              <MovimientoCard 
                key={item.id.toString()}
                item={item}
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
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isMobile ? 16 : 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? 16 : 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: isMobile ? 22 : 24,
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
  insumoColumn: {
    flex: 2,
    alignItems: 'flex-start',
  },
  descripcionColumn: {
    flex: 3,
    alignItems: 'flex-start',
  },
  unidadesColumn: {
    flex: 1,
    alignItems: 'center',
  },
  fechaColumn: {
    flex: 2,
    alignItems: 'center',
  },
  textoNombre: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
  },
  textoDescripcion: {
    fontSize: 14,
    color: '#424242',
  },
  unidadesContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 50,
  },
  textoUnidades: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
  },
  fechaContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 150,
  },
  textoFecha: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
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
    marginBottom: 12,
  },
  cardHeaderText: {
    marginBottom: 8,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cardDescripcion: {
    fontSize: 14,
    color: '#616161',
  },
  cardDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#616161',
  },
});

export default MovimientosScreen;