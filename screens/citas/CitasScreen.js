  /* ───────────────────────────────────────────────────────────
    CitasScreen.js – Listado, creación y acciones
    (versión FINAL sin límite de 5, usa all=true)
    ─────────────────────────────────────────────────────────── */
  import React, {
    useState, useEffect, useContext, useCallback,
  } from 'react';
  import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView,
    Alert, ActivityIndicator, Dimensions, Modal, Pressable,
  } from 'react-native';
  import {
    MaterialIcons, FontAwesome, AntDesign,
  } from '@expo/vector-icons';
  import { BlurView } from 'expo-blur';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useFocusEffect } from '@react-navigation/native';

  import Paginacion  from '../../components/Paginacion';
  import Buscador    from '../../components/Buscador';
  import Footer      from '../../components/Footer';
  import CrearCita   from './CrearCita';
  import DetalleCita from './DetalleCita';
  import { AuthContext } from '../../contexts/AuthContext';

  /* ------------------------ Constantes ------------------------ */
  const API = 'http://localhost:8080';
  const { width } = Dimensions.get('window');
  const isMobile  = width <= 768;

  /* ------------------ Componentes auxiliares ----------------- */
  const Avatar = ({ nombre }) => {
    const colores = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
    const bg = colores[nombre?.length % colores.length] || '#FF5733';
    return (
      <View style={[styles.avatarContainer, { backgroundColor: bg }]}>
        <Text style={styles.avatarText}>
          {nombre?.split(' ').map((p) => p[0]).join('').toUpperCase()}
        </Text>
      </View>
    );
  };

  const EtiquetaEstado = ({ estado = '' }) => {
    const map = {
      pendiente : ['rgba(206,209,0,0.2)', '#CED100'],
      expirada  : ['rgba(130,23,23,0.2)', '#821717'],
      cancelada : ['rgba(255,0,0,0.2)',   'red'],
      completa  : ['rgba(0,255,0,0.2)',   'green'],
      completada: ['rgba(0,255,0,0.2)',   'green'],
    };
    const [bg, color] = map[estado.toLowerCase()] || map.pendiente;
    return (
      <View style={[styles.estadoContainer, { backgroundColor: bg }]}>
        <Text style={[styles.estadoTexto, { color }]}>{estado}</Text>
      </View>
    );
  };

  /* --------------------- CARD (móvil) ------------------------ */
  const CitaCard = ({ item, rol, onConfirm, onExpire, onView }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.cardBarberContainer}>
          <Avatar nombre={item.barbero?.nombre} />
          <Text style={styles.cardBarberName}>{item.barbero?.nombre}</Text>
        </View>
        <EtiquetaEstado estado={item.estado} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Servicio:</Text>
          <Text style={styles.cardValue}>{item.servicio?.nombre}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Fecha:</Text>
          <Text style={styles.cardValue}>{item.fechaFormateada}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Hora:</Text>
          <Text style={styles.cardValue}>{item.hora}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {rol !== 'Cliente' && item.estado === 'Pendiente' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => onConfirm(item.id)}
            >
              <AntDesign name="checkcircle" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.expireButton]}
              onPress={() => onExpire(item.id)}
            >
              <AntDesign name="closecircle" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Expirar</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.viewButton} onPress={() => onView(item)}>
          <FontAwesome name="eye" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ===================== COMPONENTE ========================== */
  const CitasScreen = () => {
    const { userRole } = useContext(AuthContext);

    const [citas,          setCitas]          = useState([]);
    const [filtradas,      setFiltradas]      = useState([]);
    const [pagina,         setPagina]         = useState(1);
    const porPagina                         = isMobile ? 6 : 4;
    const [search,         setSearch]         = useState('');

    /* Modales */
    const [showCrear,      setShowCrear]      = useState(false);
    const [showDetalle,    setShowDetalle]    = useState(false);
    const [showConfirm,    setShowConfirm]    = useState(false);
    const [showExpire,     setShowExpire]     = useState(false);
    const [pendingId,      setPendingId]      = useState(null);
    const [detalle,        setDetalle]        = useState(null);
    const [infoCreacion,   setInfoCreacion]   = useState(null);

    const [loading,        setLoading]        = useState(false);

    /* ---------------- Helpers endpoint -------------------- */
    const listEndpoint = () => {
      if (userRole === 'Cliente') return '/citas/patient-dates';
      if (userRole === 'Barbero') return '/citas/by-barber?all=true';
      return '/citas?all=true';
    };
    const createEndpoint = () =>
      (userRole === 'Cliente' ? '/citas/by-patient' : '/citas');

    /* ----------------- Fetch citas ------------------------ */
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const { data } = await axios.get(`${API}${listEndpoint()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lista = data.citas || data;
        setCitas(lista);
        setFiltradas(lista);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    /* ----- info creación (servicios/barberos/clientes) ----- */
    const fetchInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const { data } = await axios.get(`${API}/citas/get-information-to-create`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfoCreacion(data);
      } catch { /* noop */ }
    };

    useFocusEffect(useCallback(() => { fetchCitas(); fetchInfo(); }, [userRole]));

    /* ------------------ Búsqueda -------------------------- */
    useEffect(() => {
      if (!search.trim()) {
        setFiltradas(citas);
      } else {
        const t = search.toLowerCase();
        setFiltradas(
          citas.filter((c) =>
            (c.barbero?.nombre  || '').toLowerCase().includes(t)
            || (c.cliente?.nombre  || '').toLowerCase().includes(t)
            || (c.servicio?.nombre || '').toLowerCase().includes(t)
            || (c.estado           || '').toLowerCase().includes(t)),
        );
      }
      setPagina(1);
    }, [search, citas]);

    const idxStart   = (pagina - 1) * porPagina;
    const show       = isMobile ? filtradas : filtradas.slice(idxStart, idxStart + porPagina);
    const totalPags  = Math.max(1, Math.ceil(filtradas.length / porPagina));

    /* ---------------- Acciones ---------------------------- */
    const confirmarCita = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.put(`${API}/citas/confirm-date/${pendingId}`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        fetchCitas();
        Alert.alert('Éxito', 'Cita confirmada correctamente');
      } catch (e) {
        Alert.alert('Error', e.response?.data?.mensaje || 'Error al confirmar la cita');
      } finally {
        setShowConfirm(false);
        setPendingId(null);
      }
    };

    const expirarCita = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.put(`${API}/citas/expire-date/${pendingId}`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        fetchCitas();
        Alert.alert('Éxito', 'Cita marcada como expirada');
      } catch (e) {
        Alert.alert('Error', e.response?.data?.mensaje || 'Error al expirar la cita');
      } finally {
        setShowExpire(false);
        setPendingId(null);
      }
    };

  const crearCita = async (payload) => {
    console.log('Enviando payload:', payload); // 👈🏼 Agrega esto
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API}${createEndpoint()}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCitas();
      setShowCrear(false);
      Alert.alert('Éxito', 'Cita creada correctamente');
    } catch (e) {
      console.error(e.response?.data); // 👈🏼 Agrega esto para ver el error exacto
      Alert.alert('Error', e.response?.data?.mensaje || 'Error al crear la cita');
    }
  };


    /* -------------------- UI ------------------------------ */
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#424242" />
          <Text style={styles.loadingText}>Cargando citas…</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* -------- Header -------- */}
        <View style={styles.header}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Citas</Text>
            <View style={styles.contadorContainer}>
              <Text style={styles.contadorTexto}>{filtradas.length}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowCrear(true)}>
            <MaterialIcons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>

        <Buscador
          placeholder="Buscar cita por barbero, servicio, estado…"
          value={search}
          onChangeText={setSearch}
        />

        {/* ----------- Lista ----------- */}
        {isMobile ? (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.cardsContainer}>
              {filtradas.map((c) => (
                <CitaCard
                  key={c.id}
                  item={c}
                  rol={userRole}
                  onConfirm={(id) => { setPendingId(id); setShowConfirm(true); }}
                  onExpire={(id) => { setPendingId(id); setShowExpire(true); }}
                  onView={(item) => { setDetalle(item); setShowDetalle(true); }}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <>
            {/* ---- Tabla Desktop ---- */}
            <View style={styles.tabla}>
              <View style={styles.filaEncabezado}>
                {[
                  ['Barbero', 2], ['Estado', 1.5], ['Servicio', 2],
                  ['Fecha', 1.5], ['Hora', 1], ['Acciones', 1.5],
                ].map(([txt, flex], i) => (
                  <View
                    key={i}
                    style={[
                      styles.celdaEncabezado,
                      { flex, alignItems: i === 0 ? 'flex-start' : 'center' },
                    ]}
                  >
                    <Text style={styles.encabezado}>{txt}</Text>
                  </View>
                ))}
              </View>

              <FlatList
                data={show}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                  <View style={styles.fila}>
                    <View style={[styles.celda, styles.columnaBarbero]}>
                      <View style={styles.contenedorBarbero}>
                        <Avatar nombre={item.barbero?.nombre} />
                        <Text style={styles.textoBarbero}>{item.barbero?.nombre}</Text>
                      </View>
                    </View>
                    <View style={[styles.celda, styles.columnaEstado]}>
                      <EtiquetaEstado estado={item.estado} />
                    </View>
                    <View style={[styles.celda, styles.columnaServicio]}>
                      <Text style={styles.textoServicio}>{item.servicio?.nombre}</Text>
                    </View>
                    <View style={[styles.celda, styles.columnaFecha]}>
                      <Text style={styles.fechaTexto}>{item.fechaFormateada}</Text>
                    </View>
                    <View style={[styles.celda, styles.columnaHora]}>
                      <Text style={styles.horaTexto}>{item.hora}</Text>
                    </View>
                    <View style={[styles.celda, styles.columnaAcciones]}>
                      <View style={styles.contenedorAcciones}>
                        {userRole !== 'Cliente' && item.estado === 'Pendiente' && (
                          <>
                            <TouchableOpacity 
                              onPress={() => { setPendingId(item.id); setShowConfirm(true); }} 
                              style={styles.botonAccion}
                            >
                              <AntDesign name="checkcircle" size={20} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => { setPendingId(item.id); setShowExpire(true); }} 
                              style={styles.botonAccion}
                            >
                              <AntDesign name="closecircle" size={20} color="#000" />
                            </TouchableOpacity>
                          </>
                        )}
                        <TouchableOpacity 
                          onPress={() => { setDetalle(item); setShowDetalle(true); }} 
                          style={styles.viewButtonDesktop}
                        >
                          <FontAwesome name="eye" size={20} color="#000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.paginacionContainer}>
              <Paginacion
                paginaActual={pagina}
                totalPaginas={totalPags}
                cambiarPagina={setPagina}
              />
            </View>
          </>
        )}

        {/* -------- Modales -------- */}
        <CrearCita
          visible={showCrear}
          onClose={() => setShowCrear(false)}
          onCreate={crearCita}
          infoCreacion={infoCreacion}
        />

        <DetalleCita
          visible={showDetalle}
          onClose={() => setShowDetalle(false)}
          cita={detalle}
        />

        {/* Modal Confirmar Cita */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirm}
          onRequestClose={() => setShowConfirm(false)}
        >
          <BlurView intensity={20} style={styles.modalBlurContainer}>
            <View style={styles.modalCompactContent}>
              <Text style={styles.modalCompactTitle}>¿Seguro que deseas confirmar la cita?</Text>
              <Text style={styles.modalCompactText}>
                Confirma solo si el servicio se completó y el pago se realizó.
              </Text>
              <View style={styles.modalCompactButtons}>
                <TouchableOpacity
                  style={[styles.modalCompactButton, styles.modalCompactConfirmButton]}
                  onPress={confirmarCita}
                >
                  <Text style={styles.modalCompactButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalCompactButton, styles.modalCompactCancelButton]}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={styles.modalCompactCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* Modal Expirar Cita */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showExpire}
          onRequestClose={() => setShowExpire(false)}
        >
          <BlurView intensity={20} style={styles.modalBlurContainer}>
            <View style={styles.modalCompactContent}>
              <Text style={styles.modalCompactTitle}>¿Seguro que deseas expirar esta cita?</Text>
              <Text style={styles.modalCompactText}>
                Una cita expirada no podrá confirmarse luego.  
                Después de 3 días sin confirmación, se expira automáticamente.
              </Text>
              <View style={styles.modalCompactButtons}>
                <TouchableOpacity
                  style={[styles.modalCompactButton, styles.modalCompactDangerButton]}
                  onPress={expirarCita}
                >
                  <Text style={styles.modalCompactButtonText}>Expirar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalCompactButton, styles.modalCompactCancelButton]}
                  onPress={() => setShowExpire(false)}
                >
                  <Text style={styles.modalCompactCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        <Footer />
      </View>
    );
  };

  /* ─────────────────── ESTILOS ─────────────────── */
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: isMobile ? 10 : 16,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#424242',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
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
    actionButtonText: {
      marginLeft: 5,
      color: 'white',
      fontSize: 14,
    },
    tabla: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      overflow: 'hidden',
      flex: 1,
      marginBottom: 10,
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
      borderBottomColor: '#eee',
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
    fechaTexto: {
      fontSize: 14,
      color: '#424242',
    },
    horaTexto: {
      fontSize: 14,
      color: '#424242',
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
    paginacionContainer: {
      marginBottom: 35,
    },
    /* Nuevos estilos para los modales compactos con blur */
    modalBlurContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    modalCompactContent: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      width: '85%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    modalCompactTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
      color: '#424242',
    },
    modalCompactText: {
      fontSize: 15,
      marginBottom: 24,
      textAlign: 'center',
      color: '#666',
      lineHeight: 22,
    },
    modalCompactButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    modalCompactButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    modalCompactConfirmButton: {
      backgroundColor: '#4CAF50',
    },
    modalCompactDangerButton: {
      backgroundColor: '#F44336',
    },
    modalCompactCancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#D9D9D9',
    },
    modalCompactButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 15,
    },
    modalCompactCancelButtonText: {
      color: '#424242',
      fontWeight: '600',
      fontSize: 15,
    },
  });

  export default CitasScreen;