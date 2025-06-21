import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Paginacion from '../../components/Paginacion';
import Buscador from '../../components/Buscador';
import CrearCita from './CrearCita';
import DetalleCita from './DetalleCita';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isMobile = width <= 768;

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

// Componente para el estado de la cita
const EstadoCita = ({ estado }) => {
  let estiloContenedor, estiloTexto;
  
  switch(estado.toLowerCase()) {
    case 'pendiente':
      estiloContenedor = { backgroundColor: 'rgba(206, 209, 0, 0.2)' };
      estiloTexto = { color: '#CED100' };
      break;
    case 'expirada':
      estiloContenedor = { backgroundColor: 'rgba(130, 23, 23, 0.2)' };
      estiloTexto = { color: '#821717' };
      break;
    case 'cancelada':
      estiloContenedor = { backgroundColor: 'rgba(255, 0, 0, 0.2)' };
      estiloTexto = { color: 'red' };
      break;
    case 'completada':
      estiloContenedor = { backgroundColor: 'rgba(0, 255, 0, 0.2)' };
      estiloTexto = { color: 'green' };
      break;
    default:
      estiloContenedor = { backgroundColor: 'rgba(206, 209, 0, 0.2)' };
      estiloTexto = { color: '#CED100' };
  }

  return (
    <View style={[styles.estadoContainer, estiloContenedor]}>
      <Text style={[styles.estadoTexto, estiloTexto]}>{estado}</Text>
    </View>
  );
};

// Componente para fecha/hora
const FechaHora = ({ valor }) => (
  <View style={styles.fechaHoraContainer}>
    <Text style={styles.fechaHoraTexto}>{valor}</Text>
  </View>
);

// Modal de confirmación
const ModalConfirmacion = ({ visible, onClose, onConfirm, tipo }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {tipo === 'confirmar' 
            ? '¿Estás seguro que desea confirmar la cita?' 
            : '¿Seguro que deseas expirar esta cita?'}
        </Text>
        <Text style={styles.modalText}>
          {tipo === 'confirmar' 
            ? 'Para confirmar una cita, asegúrese de que el servicio se haya completado en su totalidad y que el cliente haya realizado el pago correspondiente.' 
            : 'Para expirar una cita debes estar seguro de que la cita no se realizó en su hora establecida. Si la expiras no podrás confirmarla. Después de 3 días, si la cita no se ha confirmado, se expirará automáticamente'}
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[
              styles.modalButton, 
              tipo === 'confirmar' ? styles.confirmButton : styles.expireButton
            ]} 
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonText}>
              {tipo === 'confirmar' ? 'Confirmar Cita' : 'Expirar Cita'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Componente de tarjeta para móvil
const CitaCard = ({ item, onConfirm, onExpire, onViewDetail }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <View style={styles.cardBarberContainer}>
        <Avatar nombre={item.barbero} />
        <Text style={styles.cardBarberName}>{item.barbero}</Text>
      </View>
      <EstadoCita estado={item.estado} />
    </View>
    
    <View style={styles.cardBody}>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Servicio:</Text>
        <Text style={styles.cardValue}>{item.servicio}</Text>
      </View>
      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Fecha:</Text>
        <Text style={styles.cardValue}>{item.fecha}</Text>
      </View>
      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Hora:</Text>
        <Text style={styles.cardValue}>{item.hora}</Text>
      </View>
    </View>
    
    <View style={styles.cardActions}>
      {item.estado === 'Pendiente' && (
        <>
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]} 
            onPress={() => onConfirm(item.id)}
          >
            <AntDesign name="checkcircle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.expireButton]} 
            onPress={() => onExpire(item.id)}
          >
            <AntDesign name="closecircle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Expirar</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity 
        style={[styles.viewButton]} 
        onPress={() => onViewDetail(item.id)}
      >
        <FontAwesome name="eye" size={20} color="black" />
      </TouchableOpacity>
    </View>
  </View>
);

const CitasScreen = () => {
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [citasPorPagina] = useState(isMobile ? 6 : 4);
  const [busqueda, setBusqueda] = useState('');
  const [modalConfirmarVisible, setModalConfirmarVisible] = useState(false);
  const [modalExpirarVisible, setModalExpirarVisible] = useState(false);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useEffect(() => {
    const datosEjemplo = [
      { 
        id: 1, 
        barbero: 'Carlos', 
        estado: 'Pendiente', 
        servicio: 'Masaje con crema', 
        fecha: '29 de mayo de 2025', 
        hora: '08:00 AM',
        cliente: 'María Pérez',
        telefono: '3101234567',
        email: 'maria@example.com',
        notas: 'Cliente prefiere productos naturales'
      },
      { 
        id: 2, 
        barbero: 'Carlos', 
        estado: 'Pendiente', 
        servicio: 'Masaje con crema', 
        fecha: '28 de mayo de 2025', 
        hora: '08:00 AM',
        cliente: 'Juan Gómez',
        telefono: '3202345678',
        email: 'juan@example.com',
        notas: 'Cliente regular, sin alergias conocidas'
      },
      { 
        id: 3, 
        barbero: 'Juan', 
        estado: 'Expirada', 
        servicio: 'Masaje con crema', 
        fecha: '21 de mayo de 2025', 
        hora: '08:30 AM',
        cliente: 'Ana Rodríguez',
        telefono: '3003456789',
        email: 'ana@example.com',
        notas: 'Canceló sin aviso previo'
      },
      { 
        id: 4, 
        barbero: 'Pedro', 
        estado: 'Expirada', 
        servicio: 'Corte de pelo', 
        fecha: '16 de mayo de 2025', 
        hora: '01:00 PM',
        cliente: 'Luis Martínez',
        telefono: '3154567890',
        email: 'luis@example.com',
        notas: 'No se presentó a la cita'
      },
      { 
        id: 5, 
        barbero: 'Luis', 
        estado: 'Expirada', 
        servicio: 'Masaje con crema', 
        fecha: '31 de octubre de 2024', 
        hora: '10:00 AM',
        cliente: 'Carlos Sánchez',
        telefono: '3175678901',
        email: 'carlos@example.com',
        notas: 'Cita reprogramada 3 veces'
      },
    ];
    setCitas(datosEjemplo);
    setCitasFiltradas(datosEjemplo);
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setCitasFiltradas(citas);
    } else {
      const termino = busqueda.toLowerCase();
      const filtradas = citas.filter(c =>
        c.barbero.toLowerCase().includes(termino) || 
        c.servicio.toLowerCase().includes(termino) ||
        c.estado.toLowerCase().includes(termino) ||
        c.cliente.toLowerCase().includes(termino)
      );
      setCitasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [busqueda, citas]);

  const indiceInicial = (paginaActual - 1) * citasPorPagina;
  const citasMostrar = isMobile ? citasFiltradas : citasFiltradas.slice(indiceInicial, indiceInicial + citasPorPagina);
  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSearchChange = (texto) => setBusqueda(texto);

  const confirmarCita = (id) => {
    setCitaSeleccionada(id);
    setModalConfirmarVisible(true);
  };

  const expirarCita = (id) => {
    setCitaSeleccionada(id);
    setModalExpirarVisible(true);
  };

  const handleConfirmar = () => {
    const nuevasCitas = citas.map(c => 
      c.id === citaSeleccionada ? { ...c, estado: 'Completada' } : c
    );
    setCitas(nuevasCitas);
    setCitasFiltradas(nuevasCitas);
    setModalConfirmarVisible(false);
  };

  const handleExpirar = () => {
    const nuevasCitas = citas.map(c => 
      c.id === citaSeleccionada ? { ...c, estado: 'Expirada' } : c
    );
    setCitas(nuevasCitas);
    setCitasFiltradas(nuevasCitas);
    setModalExpirarVisible(false);
  };

  const verDetalleCita = (id) => {
    const cita = citas.find(c => c.id === id);
    
    const citaAdaptada = {
      ...cita,
      servicio: {
        nombre: cita.servicio,
        descripcion: `Descripción del servicio ${cita.servicio}`
      },
      barbero: {
        nombre: cita.barbero,
        avatar: null
      },
      cliente: {
        nombre: cita.cliente,
        avatar: null
      },
      fecha: parseFecha(cita.fecha)
    };
    
    setCitaSeleccionada(citaAdaptada);
    setModalDetalleVisible(true);
  };

  const parseFecha = (fechaStr) => {
    const meses = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 
      'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 
      'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const partes = fechaStr.split(' de ');
    if (partes.length === 3) {
      const dia = parseInt(partes[0]);
      const mes = meses[partes[1].toLowerCase()];
      const año = parseInt(partes[2]);
      return new Date(año, mes, dia);
    }
    return new Date();
  };

  const crearCita = () => {
    setModalCrearVisible(true);
  };

  const handleCreateCita = (nuevaCita) => {
    const newId = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
    const citaCompleta = { 
      id: newId, 
      ...nuevaCita, 
      estado: 'Pendiente' 
    };
    const nuevasCitas = [...citas, citaCompleta];
    setCitas(nuevasCitas);
    setCitasFiltradas(nuevasCitas);
    setModalCrearVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Citas</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{citasFiltradas.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={crearCita}>
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <Buscador
        placeholder="Buscar citas por barbero, servicio o estado"
        value={busqueda}
        onChangeText={handleSearchChange}
      />

      {isMobile ? (
        // Vista móvil - Tarjetas con scroll
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {citasFiltradas.map(item => (
              <CitaCard 
                key={item.id.toString()}
                item={item}
                onConfirm={confirmarCita}
                onExpire={expirarCita}
                onViewDetail={verDetalleCita}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        // Vista desktop - Tabla con paginación
        <>
          <View style={styles.tabla}>
            <View style={styles.filaEncabezado}>
              <View style={[styles.celdaEncabezado, styles.columnaBarbero]}><Text style={styles.encabezado}>Barbero</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaEstado]}><Text style={styles.encabezado}>Estado</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaServicio]}><Text style={styles.encabezado}>Servicio</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaFecha]}><Text style={styles.encabezado}>Fecha</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaHora]}><Text style={styles.encabezado}>Hora</Text></View>
              <View style={[styles.celdaEncabezado, styles.columnaAcciones]}><Text style={styles.encabezado}>Acciones</Text></View>
            </View>

            <FlatList
              data={citasMostrar}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.fila}>
                  <View style={[styles.celda, styles.columnaBarbero]}>
                    <View style={styles.contenedorBarbero}>
                      <Avatar nombre={item.barbero} />
                      <Text style={styles.textoBarbero}>{item.barbero}</Text>
                    </View>
                  </View>
                  <View style={[styles.celda, styles.columnaEstado]}>
                    <EstadoCita estado={item.estado} />
                  </View>
                  <View style={[styles.celda, styles.columnaServicio]}>
                    <Text style={styles.textoServicio}>{item.servicio}</Text>
                  </View>
                  <View style={[styles.celda, styles.columnaFecha]}>
                    <FechaHora valor={item.fecha} />
                  </View>
                  <View style={[styles.celda, styles.columnaHora]}>
                    <FechaHora valor={item.hora} />
                  </View>
                  <View style={[styles.celda, styles.columnaAcciones]}>
                    <View style={styles.contenedorAcciones}>
                      {item.estado === 'Pendiente' && (
                        <>
                          <TouchableOpacity onPress={() => confirmarCita(item.id)} style={styles.botonAccion}>
                            <AntDesign name="checkcircle" size={20} color="black" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => expirarCita(item.id)} style={styles.botonAccion}>
                            <AntDesign name="closecircle" size={20} color="black" />
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity 
                        onPress={() => verDetalleCita(item.id)} 
                        style={styles.viewButtonDesktop}
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
        </>
      )}

      <ModalConfirmacion
        visible={modalConfirmarVisible}
        onClose={() => setModalConfirmarVisible(false)}
        onConfirm={handleConfirmar}
        tipo="confirmar"
      />

      <ModalConfirmacion
        visible={modalExpirarVisible}
        onClose={() => setModalExpirarVisible(false)}
        onConfirm={handleExpirar}
        tipo="expirar"
      />

      <CrearCita
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCreate={handleCreateCita}
      />

      {modalDetalleVisible && citaSeleccionada && (
        <DetalleCita
          visible={modalDetalleVisible}
          onClose={() => setModalDetalleVisible(false)}
          cita={citaSeleccionada}
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isMobile ? 10 : 16,
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
    fontSize: isMobile ? 20 : 24,
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
  
  // Estilos para la vista de tarjetas (móvil)
  scrollContainer: {
    flex: 1,
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardBarberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBarberName: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardBody: {
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: 'bold',
    width: 80,
    color: '#555',
  },
  cardValue: {
    flex: 1,
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  expireButton: {
    backgroundColor: '#F44336',
  },
  viewButton: {
    backgroundColor: '#D9D9D9',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  
  // Estilos para la vista de tabla (desktop)
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
  columnaBarbero: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaEstado: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaServicio: {
    flex: 2,
    alignItems: 'center',
  },
  columnaFecha: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaHora: {
    flex: 1,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  contenedorBarbero: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBarbero: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  textoServicio: {
    textAlign: 'center',
    fontWeight: 'bold',
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
  viewButtonDesktop: {
    backgroundColor: '#D9D9D9',
    padding: 6,
    borderRadius: 20,
    marginLeft: 6,
  },
  
  // Estilos compartidos
  estadoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoTexto: {
    fontWeight: 'bold',
  },
  fechaHoraContainer: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  fechaHoraTexto: {
    color: '#424242',
    fontWeight: 'bold',
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
  
  // Estilos para los modales
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: isMobile ? '90%' : '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#424242',
  },
  expireButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CitasScreen;