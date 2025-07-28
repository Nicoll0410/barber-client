/* ───────────────────────────────────────────────────────────
  screens/citas/CrearCita.js
  Wizard de 5 pasos (Admin/Barbero) o 4 pasos (Cliente)
  ─────────────────────────────────────────────────────────── */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';

/* -------------------- Constantes ------------------------ */
const API = 'http://localhost:8080';

/* ======================================================== */
const CrearCita = ({ visible, onClose, onCreate, infoCreacion }) => {
  const { userRole } = useContext(AuthContext);
  const isClient = userRole === 'Cliente';

  /* ------------------- State ---------------------------- */
  const [paso, setPaso] = useState(1);

  const [servicioSel, setServicioSel] = useState(null);
  const [barberoSel, setBarberoSel] = useState(null);
  const [clienteSel, setClienteSel] = useState(null);

  const [fechaSel, setFechaSel] = useState(null); // "YYYY-MM-DD"
  const [horaSel, setHoraSel] = useState(null);   // "h:mm AM"

  const [mesActual, setMesActual] = useState(new Date());
  const [diasMes, setDiasMes] = useState([]);
  const [horasDisp, setHorasDisp] = useState([]);
  const [loadingHoras, setLoadingHoras] = useState(false);

  const [busBarbero, setBusBarbero] = useState('');
  const [busCliente, setBusCliente] = useState('');

  /* ------------ Datos origen ---------------------------- */
  const servicios = infoCreacion?.servicios || [];
  const barberos  = infoCreacion?.barberos  || [];
  const clientes  = infoCreacion?.clientes  || [];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  /* ----------------- Efectos ---------------------------- */
  useEffect(() => { if (visible) reset(false); }, [visible]);
  useEffect(() => { if (paso === (isClient ? 3 : 4)) generarDiasMes(); }, [paso, mesActual]);
  useEffect(() => {
    if (paso === (isClient ? 3 : 4) && fechaSel && barberoSel && servicioSel) {
      obtenerHoras();
    }
  }, [fechaSel, barberoSel, servicioSel]);

  /* --------------- Helpers fecha/hora ------------------ */
  const formatearFecha = (d) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const da = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${da}`;
  };
  const esPasada = (d) => {
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    const cmp = new Date(d);
    cmp.setHours(0, 0, 0, 0);
    return cmp < h;
  };

  /* ---------- Helper para asegurar el ID correcto ------- */
  const getId = (obj) =>
    obj?.id
    ?? obj?.barberoID
    ?? obj?.servicioID
    ?? obj?.pacienteID
    ?? obj?._id
    ?? null;

  /* ----------------- Generar calendario ---------------- */
  const generarDiasMes = () => {
    const y = mesActual.getFullYear();
    const m = mesActual.getMonth();
    const primero = new Date(y, m, 1);
    const ultimo  = new Date(y, m + 1, 0);
    const offset  = primero.getDay();

    const arr = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let d = 1; d <= ultimo.getDate(); d++) arr.push(new Date(y, m, d));
    while (arr.length < 42) arr.push(null);
    setDiasMes(arr);
  };

  const cambiarMes = (inc) => {
    const n = new Date(mesActual);
    n.setMonth(n.getMonth() + inc);
    setMesActual(n);
    setFechaSel(null);
    setHoraSel(null);
    setHorasDisp([]);
  };

  /* -------------- API horas disponibles ---------------- */
  const obtenerHoras = async () => {
    if (!fechaSel) return;
    try {
      setLoadingHoras(true);

      const fecha = new Date(`${fechaSel}T00:00:00`);
      const diaSemana = fecha.getDay(); // 0=Domingo, ..., 6=Sábado

      let horaInicio, horaFin;

      if (diaSemana >= 1 && diaSemana <= 3) {
        // Lunes a miércoles
        horaInicio = 11; // 11:00 AM
        horaFin = 21;    // 9:00 PM
      } else {
        // Jueves a domingo
        horaInicio = 9;  // 9:00 AM
        horaFin = 22;    // 10:00 PM
      }

      const horas = [];
      for (let h = horaInicio; h <= horaFin; h++) {
        horas.push(formatearHora(h, 0));
        if (h !== horaFin) {
          horas.push(formatearHora(h, 30));
        }
      }

      setHorasDisp(horas);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las horas disponibles');
    } finally {
      setLoadingHoras(false);
    }
  };

  const formatearHora = (hora24, minutos) => {
    const hora = hora24 % 12 || 12;
    const sufijo = hora24 < 12 ? 'AM' : 'PM';
    const minStr = minutos.toString().padStart(2, '0');
    return `${hora}:${minStr} ${sufijo}`;
  };

  /* -------------------- Handlers ----------------------- */
  const crearCita = () => {
    if (
      !servicioSel ||
      !barberoSel  ||
      !fechaSel    ||
      !horaSel     ||
      (!isClient && !clienteSel)
    ) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const payload = {
      servicioID: getId(servicioSel),
      barberoID: getId(barberoSel),
      fecha: fechaSel,
      hora: horaSel,
      ...(!isClient && { pacienteID: getId(clienteSel) }),
    };

    if (!payload.barberoID || !payload.servicioID) {
      Alert.alert('Error', 'Ocurrió un problema con los IDs seleccionados');
      return;
    }

    console.log('Payload enviado a /citas ->', payload);
    onCreate(payload);
    reset();
  };

  const reset = (close = true) => {
    setPaso(1);
    setServicioSel(null);
    setBarberoSel(null);
    setClienteSel(null);
    setFechaSel(null);
    setHoraSel(null);
    setBusBarbero('');
    setBusCliente('');
    setMesActual(new Date());
    setDiasMes([]);
    setHorasDisp([]);
    if (close) onClose();
  };

  /* ---------------- Render Paso ------------------------ */
  const Paso1 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Selecciona el servicio</Text>
      <FlatList
        data={servicios}
        keyExtractor={(i) => getId(i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.servicioItem,
              servicioSel && getId(servicioSel) === getId(item) && styles.servicioSeleccionado,
            ]}
            onPress={() => setServicioSel(item)}
          >
            <Text style={styles.servicioNombre}>{item.nombre}</Text>
            <Text style={styles.servicioPrecio}>${item.precio}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.botonContainerCentrado}>
        <TouchableOpacity
          style={[styles.botonSiguiente, !servicioSel && styles.botonDisabled]}
          disabled={!servicioSel}
          onPress={() => setPaso(2)}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const barberosFiltrados = barberos.filter((b) =>
    b.nombre.toLowerCase().includes(busBarbero.toLowerCase()),
  );
  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busCliente.toLowerCase()),
  );

  const Paso2 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Selecciona el barbero</Text>
      <View style={styles.buscadorContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar barbero"
          value={busBarbero}
          onChangeText={setBusBarbero}
        />
      </View>
      <FlatList
        data={barberosFiltrados}
        keyExtractor={(i) => getId(i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.barberoItem,
              barberoSel && getId(barberoSel) === getId(item) && styles.barberoSeleccionado,
            ]}
            onPress={() => setBarberoSel(item)}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {item.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <Text style={styles.barberoNombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => setPaso(1)}>
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonSiguiente, !barberoSel && styles.botonDisabled]}
          disabled={!barberoSel}
          onPress={() => setPaso(isClient ? 3 : 3)}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Paso3ClienteSel = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Selecciona el cliente</Text>
      <View style={styles.buscadorContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar cliente"
          value={busCliente}
          onChangeText={setBusCliente}
        />
      </View>
      <FlatList
        data={clientesFiltrados}
        keyExtractor={(i) => getId(i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.clienteItem,
              clienteSel && getId(clienteSel) === getId(item) && styles.clienteSeleccionado,
            ]}
            onPress={() => setClienteSel(item)}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {item.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <Text style={styles.clienteNombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => setPaso(2)}>
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonSiguiente, !clienteSel && styles.botonDisabled]}
          disabled={!clienteSel}
          onPress={() => setPaso(4)}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PasoFechaHora = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Elige fecha y hora</Text>

      {/* Header mes */}
      <View style={styles.calendarioHeader}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <MaterialIcons name="chevron-left" size={24} color="#424242" />
        </TouchableOpacity>
        <Text style={styles.mesActual}>
          {mesActual.toLocaleString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <MaterialIcons name="chevron-right" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      {/* Días semana */}
      <View style={styles.diasSemanaContainer}>
        {diasSemana.map((d) => (
          <View key={d} style={styles.diaSemanaItem}>
            <Text style={styles.diaSemanaTexto}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Días mes */}
      <View style={styles.diasMesContainer}>
        {Array.from({ length: 6 }).map((_, s) => (
          <View key={s} style={styles.semanaContainer}>
            {diasSemana.map((_, d) => {
              const idx = s * 7 + d;
              const dia = diasMes[idx];
              if (!dia) return <View key={idx} style={styles.diaVacio} />;

              const fStr = formatearFecha(dia);
              const sel  = fStr === fechaSel;
              const hoy  = dia.toDateString() === new Date().toDateString();
              const pas  = esPasada(dia);

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.diaItem,
                    hoy && styles.diaHoy,
                    sel && styles.diaSeleccionado,
                    pas && styles.diaPasado,
                  ]}
                  disabled={pas}
                  onPress={() => {
                    setFechaSel(fStr);
                    setHoraSel(null);
                  }}
                >
                  <Text
                    style={[
                      styles.diaNumero,
                      hoy && styles.diaNumeroHoy,
                      sel && styles.diaNumeroSeleccionado,
                      pas && styles.diaNumeroPasado,
                    ]}
                  >
                    {dia.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Horas */}
      {fechaSel && (
        <View style={styles.horasContainer}>
          <Text style={styles.horasTitulo}>Horarios disponibles:</Text>
          {loadingHoras ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#424242" />
              <Text style={styles.loadingText}>Cargando…</Text>
            </View>
          ) : horasDisp.length ? (
            <View style={styles.horasGrid}>
              {horasDisp.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.horaButton,
                    h === horaSel && styles.horaSeleccionada,
                  ]}
                  onPress={() => setHoraSel(h)}
                >
                  <Text
                    style={[
                      styles.horaTexto,
                      h === horaSel && styles.horaTextoSeleccionado,
                    ]}
                  >
                    {h}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.sinDisponibilidad}>
              <Text style={styles.sinDisponibilidadTitulo}>Sin citas disponibles</Text>
              <Text style={styles.sinDisponibilidadTexto}>Selecciona otra fecha</Text>
            </View>
          )}
        </View>
      )}

      {/* Navegación */}
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(isClient ? 2 : 3)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.botonSiguiente,
            (!fechaSel || !horaSel) && styles.botonDisabled,
          ]}
          disabled={!fechaSel || !horaSel}
          onPress={() => setPaso(5)}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PasoRevisa = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Revisa la información</Text>
      <View style={styles.infoConfirmacion}>
        {[
          ['Servicio:', servicioSel?.nombre],
          ['Barbero:',  barberoSel?.nombre],
          !isClient && ['Cliente:', clienteSel?.nombre],
          [
            'Fecha:',
            new Date(`${fechaSel}T00:00:00`).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ],
          ['Hora:', horaSel],
        ]
          .filter(Boolean)
          .map(([k, v]) => (
            <React.Fragment key={k}>
              <Text style={styles.infoTitulo}>{k}</Text>
              <Text style={styles.infoTexto}>{v}</Text>
            </React.Fragment>
          ))}
      </View>
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => setPaso(4)}>
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonConfirmar} onPress={crearCita}>
          <Text style={styles.botonTexto}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaso = () => {
    if (paso === 1) return <Paso1 />;
    if (paso === 2) return <Paso2 />;
    if (paso === 3) return isClient ? <PasoFechaHora /> : <Paso3ClienteSel />;
    if (paso === 4) return <PasoFechaHora />;
    return <PasoRevisa />;
  };

  /* -------------------- Modal --------------------------- */
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {
                ['Servicio', 'Barbero', isClient ? 'Fecha & Hora' : 'Cliente', 'Fecha & Hora', 'Revisión'][
                  paso - 1
                ]
              }
            </Text>
            <TouchableOpacity onPress={() => reset()}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderPaso()}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

/* ──────────────────── ESTILOS ───────────────────────── */
const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  pasoContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  servicioItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  servicioSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  servicioPrecio: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  buscadorIcono: {
    marginRight: 10,
  },
  buscadorInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: '#333',
  },
  barberoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  barberoSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  barberoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  clienteSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  calendarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mesActual: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
  },
  diasSemanaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  diaSemanaItem: {
    width: 40,
    alignItems: 'center',
  },
  diaSemanaTexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  diasMesContainer: {
    marginBottom: 20,
  },
  semanaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  diaVacio: {
    width: 40,
    height: 40,
  },
  diaItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  diaHoy: {
    borderWidth: 1,
    borderColor: '#424242',
  },
  diaSeleccionado: {
    backgroundColor: '#424242',
  },
  diaPasado: {
    opacity: 0.5,
  },
  diaNumero: {
    fontSize: 16,
    color: '#333',
  },
  diaNumeroHoy: {
    fontWeight: 'bold',
  },
  diaNumeroSeleccionado: {
    color: '#fff',
  },
  diaNumeroPasado: {
    color: '#999',
  },
  horasContainer: {
    marginTop: 10,
  },
  horasTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#424242',
  },
  horasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  horaButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  horaSeleccionada: {
    borderColor: '#424242',
    backgroundColor: '#424242',
  },
  horaTexto: {
    fontSize: 14,
    color: '#333',
  },
  horaTextoSeleccionado: {
    color: '#fff',
  },
  sinDisponibilidad: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  sinDisponibilidadTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 5,
    textAlign: 'center',
  },
  sinDisponibilidadTexto: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 15,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  infoConfirmacion: {
    marginTop: 10,
    marginBottom: 18,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    color: '#222',
  },
  infoTexto: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  botonesNavegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  botonVolver: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  botonSiguiente: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  botonConfirmar: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  botonDisabled: {
    backgroundColor: '#bbb',
  },
  botonTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  botonTextoVolver: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  botonContainerCentrado: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default CrearCita;