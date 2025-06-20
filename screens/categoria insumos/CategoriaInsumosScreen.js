import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCategoria from './CrearCategoriaInsumos';
import EditarCategoria from './EditarCategoriaInsumos';
import DetalleCategoria from './DetalleCategoriaInsumos';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

// Mobile Category Card
const CategoriaCard = ({ item, onVer, onEditar, onEliminar }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Text style={styles.cardDescripcion}>{item.descripcion}</Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <MaterialIcons name="date-range" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>{item.fechaCreacion}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="inventory" size={16} color="#757575" style={styles.detailIcon}/>
        <Text style={styles.detailText}>Insumos asociados: {item.insumosAsociados}</Text>
      </View>
    </View>
    
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onVer(item.id)}>
        <FontAwesome name="eye" size={18} color="#424242" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEditar(item.id)}>
        <Feather name="edit" size={18} color="#424242" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => onEliminar(item.id)}>
        <Feather name="trash-2" size={18} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  </View>
);

const CategoriaInsumosScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriasPorPagina] = useState(4);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        nombre: 'Tijeras', 
        descripcion: 'Tijeras profesionales para corte', 
        fechaCreacion: '15 de enero de 2024', 
        insumosAsociados: 5 
      },
      { 
        id: 2, 
        nombre: 'Máquinas', 
        descripcion: 'Máquinas de corte y detalle', 
        fechaCreacion: '20 de enero de 2024', 
        insumosAsociados: 3 
      },
      { 
        id: 3, 
        nombre: 'Navajas', 
        descripcion: 'Navajas para afeitado clásico', 
        fechaCreacion: '5 de febrero de 2024', 
        insumosAsociados: 8 
      },
      { 
        id: 4, 
        nombre: 'Productos', 
        descripcion: 'Geles, pomadas y fijadores', 
        fechaCreacion: '10 de marzo de 2024', 
        insumosAsociados: 12 
      },
    ];
    setCategorias(datosEjemplo);
    setCategoriasFiltradas(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setCategoriasFiltradas(categorias);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = categorias.filter(c =>
        c.nombre.toLowerCase().includes(termino) || 
        c.descripcion.toLowerCase().includes(termino)
      );
      setCategoriasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, categorias]);

  const indiceInicial = (paginaActual - 1) * categoriasPorPagina;
  const categoriasMostrar = isMobile ? categoriasFiltradas : categoriasFiltradas.slice(indiceInicial, indiceInicial + categoriasPorPagina);
  const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const crearCategoria = () => setModalVisible(true);
  const handleSearchChange = (texto) => setBusqueda(texto);

  const handleCreateCategoria = (newCategoria) => {
    const newId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
    const nuevaCategoria = { 
      id: newId, 
      ...newCategoria,
      fechaCreacion: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      insumosAsociados: 0
    };
    const nuevasCategorias = [...categorias, nuevaCategoria];
    setCategorias(nuevasCategorias);
    setCategoriasFiltradas(nuevasCategorias);
    setModalVisible(false);
  };

  const verDetallesCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    setCategoriaSeleccionada(categoria);
    setModalDetalleVisible(true);
  };

  const editarCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    setCategoriaSeleccionada(categoria);
    setModalEditarVisible(true);
  };

  const handleUpdateCategoria = (updatedCategoria) => {
    const nuevasCategorias = categorias.map(c => 
      c.id === updatedCategoria.id ? updatedCategoria : c
    );
    setCategorias(nuevasCategorias);
    setCategoriasFiltradas(nuevasCategorias);
    setModalEditarVisible(false);
  };

  const eliminarCategoria = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta categoría?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            const nuevasCategorias = categorias.filter(c => c.id !== id);
            setCategorias(nuevasCategorias);
            setCategoriasFiltradas(nuevasCategorias);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Categorías de Insumos</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{categoriasFiltradas.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={crearCategoria}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar categoría (ej: tijeras, máquinas)"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {!isMobile ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.nameColumn]}><Text style={styles.headerText}>Nombre</Text></View>
            <View style={[styles.headerCell, styles.descColumn]}><Text style={styles.headerText}>Descripción</Text></View>
            <View style={[styles.headerCell, styles.dateColumn]}><Text style={styles.headerText}>Fecha Creación</Text></View>
            <View style={[styles.headerCell, styles.itemsColumn]}><Text style={styles.headerText}>Insumos</Text></View>
            <View style={[styles.headerCell, styles.actionsColumn]}><Text style={styles.headerText}>Acciones</Text></View>
          </View>

          <FlatList
            data={categoriasMostrar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.nameColumn]}>
                  <Text style={styles.nameText}>{item.nombre}</Text>
                </View>
                <View style={[styles.cell, styles.descColumn]}>
                  <Text style={styles.descText}>{item.descripcion}</Text>
                </View>
                <View style={[styles.cell, styles.dateColumn]}>
                  <Text style={styles.dateText}>{item.fechaCreacion}</Text>
                </View>
                <View style={[styles.cell, styles.itemsColumn]}>
                  <View style={styles.itemsBadge}>
                    <Text style={styles.itemsText}>{item.insumosAsociados}</Text>
                  </View>
                </View>
                <View style={[styles.cell, styles.actionsColumn]}>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => verDetallesCategoria(item.id)} style={styles.actionIcon}>
                      <FontAwesome name="eye" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => editarCategoria(item.id)} style={styles.actionIcon}>
                      <Feather name="edit" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarCategoria(item.id)} style={styles.actionIcon}>
                      <Feather name="trash-2" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {categoriasMostrar.map(item => (
              <CategoriaCard 
                key={item.id.toString()}
                item={item}
                onVer={verDetallesCategoria}
                onEditar={editarCategoria}
                onEliminar={eliminarCategoria}
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

      <CrearCategoria
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCategoria}
      />

      <EditarCategoria
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        categoria={categoriaSeleccionada}
        onUpdate={handleUpdateCategoria}
      />

      <DetalleCategoria
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        categoria={categoriaSeleccionada}
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
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
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
  nameColumn: {
    flex: 2,
    alignItems: 'flex-start',
  },
  descColumn: {
    flex: 3,
    alignItems: 'flex-start',
  },
  dateColumn: {
    flex: 2,
    alignItems: 'center',
  },
  itemsColumn: {
    flex: 1,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  nameText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424242',
  },
  descText: {
    fontSize: 14,
    color: '#616161',
  },
  dateText: {
    fontSize: 14,
    color: '#424242',
  },
  itemsBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 30,
    alignItems: 'center',
  },
  itemsText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#424242',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginHorizontal: 6,
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
    flex: 1,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cardDescripcion: {
    fontSize: 14,
    color: '#757575',
  },
  cardDetails: {
    marginBottom: 8,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default CategoriaInsumosScreen;