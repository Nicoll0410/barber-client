/* ───────────────────────────────────────────────────────────
   screens/agenda/AgendaScreen.js
   Agenda diaria con creación y detalle de citas
   ─────────────────────────────────────────────────────────── */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import Footer from '../../components/Footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CrearCita from './CrearCita';
import DetalleCita from './DetalleCita';

/* ─────────────── Localización calendario (es) ────────────── */
LocaleConfig.locales.es = {
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

const { width } = Dimensions.get('window');

/* ───────────────────────── COMPONENTE ───────────────────── */
const AgendaScreen = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showCrearCita, setShowCrearCita] = useState(false);
  const [showDetalleCita, setShowDetalleCita] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [citas, setCitas] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBarberos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        'http://localhost:8080/barberos',
        { 
          params: { page: 1, limit: 100 },
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      setBarberos(
        data.barberos.map(b => ({
          id: b.id,
          nombre: b.nombre,
          avatar: b.avatar
            ? { uri: b.avatar }
            : require('../../assets/avatar.png'),
          subItems: ['Barbero'],
        }))
      );
    } catch (err) {
      console.error('Error al obtener barberos:', err);
      Alert.alert('Error', 'No se pudieron cargar los barberos');
    }
  };

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const fecha = formatDateString(selectedDate);

      const { data } = await axios.get(
        `http://localhost:8080/citas/diary?fecha=${fecha}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const transformed = data.flatMap(barbero =>
        barbero.schedule.map(cita => {
          const fechaCita = new Date(`${fecha}T00:00:00`);
          return {
            id: cita.id,
            fecha: fechaCita,
            fechaFormateada: fechaCita.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            hora: normalizeHoraFromDecimal(cita.start),
            horaFin: normalizeHoraFromDecimal(cita.end),
            servicio: {
              id: cita.servicio.id,
              nombre: cita.servicio.nombre,
              duracionMaxima: cita.servicio.duracion, // Campo corregido
              precio: cita.servicio.precio,
            },
            barbero: {
              id: barbero.id,
              nombre: barbero.name,
              avatar: barbero.avatar
                ? { uri: barbero.avatar }
                : require('../../assets/avatar.png'),
            },
            cliente: {
              id: cita.cliente.id,
              nombre: cita.cliente.nombre,
              email: cita.cliente.email,
            },
            estado: cita.estado,
          };
        })
      );

      setCitas(transformed);
    } catch (err) {
      console.error('Error al obtener citas:', err);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const fetchInformationForCreate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        'http://localhost:8080/citas/get-information-to-create',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServicios(data.servicios);

      setClientes(
        data.clientes.map(c => ({
          id: c.id,
          nombre: c.nombre,
          telefono: c.telefono,
          email: c.usuario?.email, // ← viene anidado
          avatar: c.avatar
            ? { uri: c.avatar }
            : require('../../assets/avatar.png'),
        }))
      );
    } catch (err) {
      console.error('Error al obtener info para crear citas:', err);
      Alert.alert('Error', 'No se pudo cargar la información necesaria');
    }
  };

  /* ─────────────── useFocusEffect: carga/refresh ─────────── */
  useFocusEffect(
    useCallback(() => {
      fetchBarberos();
      fetchCitas();
      fetchInformationForCreate();
    }, [selectedDate])
  );

  /* ─────────────── Helpers de fecha/hora ──────────────── */
  const formatDateString = d => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const da = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  // Decimal (9.5) -> "09:30:00"
  const normalizeHoraFromDecimal = decimal => {
    const h = Math.floor(decimal);
    const m = Math.round((decimal - h) * 60);
    return `${`${h}`.padStart(2, '0')}:${`${m}`.padStart(2, '0')}:00`;
  };

  // "09:00" -> "9:00 am"
  const toAMPM = t => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${`${m}`.padStart(2, '0')} ${period}`;
  };

  /* Genera slots cada 30 min según día */
  const generateTimeSlots = () => {
    const day = selectedDate.getDay();
    const slots = [];
    const startHour = day >= 1 && day <= 3 ? 11 : 9; // Lun‑Mié 11‑21, resto 9‑22
    const endHour   = day >= 1 && day <= 3 ? 21 : 22;

    for (let h = startHour; h < endHour; h++) {
      ['00','30'].forEach(min => {
        const start = `${`${h}`.padStart(2,'0')}:${min}`;
        const end   = min === '00'
          ? `${`${h}`.padStart(2,'0')}:30`
          : `${`${h+1}`.padStart(2,'0')}:00`;
        slots.push({
          key:       start,
          startTime: start,
          endTime:   end,
          displayTime: toAMPM(start),
        });
      });
    }

    /* Eliminar slots pasados si es hoy */
    if (isToday(selectedDate)) {
      const now = new Date();
      const current      = now.getHours() + now.getMinutes()/60;
      return slots.filter(s => {
        const [h, m]   = s.startTime.split(':').map(Number);
        const slotTime = h + m/60;
        return slotTime >= current;
      });
    }
    return slots;
  };

  const isToday = (d) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isPastDate = d => {
    const check = new Date(d);
    check.setHours(0,0,0,0);
    return check < today;
  };

  const formatDateFull = d =>
    d.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  /* ─────────── Navegación por días ─────────── */
  const navigateDay = dir => {
    const n = new Date(selectedDate);
    n.setDate(n.getDate() + (dir === 'next' ? 1 : -1));
    if (!isPastDate(n)) setSelectedDate(n);
  };

  const changeMonth = inc => {
    const n = new Date(selectedDate.getFullYear(),
                       selectedDate.getMonth() + inc, 1);
    if (n < today) return;
    setSelectedDate(n);
  };

  const onDayPress = ({ dateString }) => {
    const [y,m,da] = dateString.split('-').map(Number);
    const n = new Date(y, m-1, da);
    if (!isPastDate(n)) {
      setSelectedDate(n);
      setShowCalendar(false);
    }
  };

  /* ─────────── Slots & Citas ─────────── */
  const citaForSlot = (slot, barbero) =>
    citas.find(c =>
      c.fecha.toDateString() === selectedDate.toDateString() &&
      c.hora === `${slot.startTime}:00` &&
      c.barbero.id === barbero.id
    );

  const handleSlotPress = (slot, barbero) => {
    const existente = citaForSlot(slot, barbero);
    if (existente) {
      setSelectedCita(existente);
      setShowDetalleCita(true);
    } else {
      setSelectedSlot({ ...slot, barbero, fecha: selectedDate });
      setShowCrearCita(true);
    }
  };

  /* ─────────── Callback al crear exitoso ─────────── */
  const onCitaCreada = () => {
    fetchCitas();          // refrescar agenda
    setShowCrearCita(false);
    setSelectedSlot(null);
    Alert.alert('Éxito', 'Cita creada correctamente');
  };

  /* ─────────── Disabled dates (ayer & antes) ───────── */
  const getDisabledDates = () => {
    const disabled = {};
    const start = new Date(selectedDate.getFullYear(),
                           selectedDate.getMonth()-1, 1);
    const end   = new Date(selectedDate.getFullYear(),
                           selectedDate.getMonth()+2, 0);
    const tmp = new Date(start);
    while (tmp <= end) {
      if (tmp < today) {
        disabled[formatDateString(tmp)] = { disabled: true, disableTouchEvent: true };
      }
      tmp.setDate(tmp.getDate()+1);
    }
    return disabled;
  };

  /* ─────────────────────── RENDER ─────────────────────── */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#424242" />
        <Text>Cargando agenda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header fecha */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.calendarButton}>
          <MaterialIcons name="calendar-today" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <TouchableOpacity
            onPress={() => navigateDay('prev')}
            disabled={isToday(selectedDate)}>
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={isToday(selectedDate) ? '#ccc' : '#000'}
            />
          </TouchableOpacity>

          <Text style={styles.dateText}>{formatDateFull(selectedDate)}</Text>

          <TouchableOpacity onPress={() => navigateDay('next')}>
            <MaterialIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cabecera barberos */}
      <View style={styles.barberosHeader}>
        <View style={styles.timeColumn} />
        {barberos.map(b => (
          <View key={b.id} style={styles.barberoHeader}>
            <Image source={b.avatar} style={styles.avatar} />
            <Text style={styles.barberoNombre}>{b.nombre}</Text>
            {b.subItems.map((s,i)=>(
              <Text key={i} style={styles.subItem}>{s}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Slots */}
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {generateTimeSlots().map(slot=>(
            <View key={slot.key} style={styles.row}>
              {/* Columna hora */}
              <View style={styles.timeCell}>
                <Text style={styles.horaText}>{slot.displayTime}</Text>
              </View>

              {/* Columnas barberos */}
              {barberos.map(b=>{
                const cita = citaForSlot(slot,b);
                return (
                  <TouchableOpacity
                    key={`${slot.key}-${b.id}`}
                    style={[
                      styles.slot,
                      cita && styles.slotConCita,
                      selectedSlot?.key===slot.key &&
                      selectedSlot?.barbero.id===b.id &&
                      styles.selectedSlot,
                    ]}
                    onPress={()=>handleSlotPress(slot,b)}>
                    {cita && (
                      <View style={styles.citaContent}>
                        <Text style={styles.citaCliente}>{cita.cliente.nombre}</Text>
                        <Text style={styles.citaServicio}>{cita.servicio.nombre}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ─── Calendario modal ─── */}
      <Modal visible={showCalendar} animationType="fade" transparent>
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.calendarModal}>
          <View style={styles.customDatePicker}>
            {/* Header mes‑año */}
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={()=>changeMonth(-1)}
                disabled={
                  selectedDate.getFullYear()===today.getFullYear() &&
                  selectedDate.getMonth()===today.getMonth()
                }>
                <MaterialIcons
                  name="chevron-left"
                  size={24}
                  color={
                    selectedDate.getFullYear()===today.getFullYear() &&
                    selectedDate.getMonth()===today.getMonth()
                      ? '#ccc'
                      : '#333'
                  }
                />
              </TouchableOpacity>

              <View style={styles.monthYearSelector}>
                <Text style={styles.monthYearText}>
                  {LocaleConfig.locales.es.monthNames[selectedDate.getMonth()]} de {selectedDate.getFullYear()}
                </Text>
              </View>

              <TouchableOpacity onPress={()=>changeMonth(1)}>
                <MaterialIcons name="chevron-right" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Calendario */}
            <View style={styles.calendarContainer}>
              <Calendar
                current={formatDateString(selectedDate)}
                minDate={today.toISOString().split('T')[0]}
                onDayPress={onDayPress}
                monthFormat="MMMM yyyy"
                hideArrows
                hideExtraDays={false}
                disableMonthChange
                markedDates={{
                  ...getDisabledDates(),
                  [formatDateString(selectedDate)]: {
                    selected:true,selectedColor:'#424242',selectedTextColor:'#fff',
                  },
                  [today.toISOString().split('T')[0]]: {marked:true,dotColor:'#424242'},
                }}
                theme={{
                  calendarBackground:'transparent',
                  textSectionTitleColor:'#666',
                  dayTextColor:'#333',
                  todayTextColor:'#424242',
                  selectedDayTextColor:'#fff',
                  selectedDayBackgroundColor:'#424242',
                  monthTextColor:'#333',
                  textDayFontWeight:'400',
                  textMonthFontWeight:'bold',
                  textDayHeaderFontWeight:'500',
                  textDayFontSize:12,
                  textMonthFontSize:14,
                  textDayHeaderFontSize:12,
                  disabledDayTextColor:'#d9d9d9',
                }}
                style={styles.calendar}
                disableAllTouchEventsForDisabledDays
              />
            </View>

            {/* Acciones */}
            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={()=>{setSelectedDate(today);setShowCalendar(false);}}>
                <Text style={styles.datePickerButtonText}>Hoy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={()=>setShowCalendar(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Crear cita ─── */}
      <CrearCita
        visible={showCrearCita}
        onClose={()=>setShowCrearCita(false)}
        onCreate={onCitaCreada}
        barbero={selectedSlot?.barbero}
        fecha={selectedDate}
        slot={selectedSlot}
        servicios={servicios}
        clientes={clientes}
      />

      {/* ─── Detalle cita ─── */}
      <DetalleCita
        visible={showDetalleCita}
        onClose={() => setShowDetalleCita(false)}
        cita={selectedCita}
      />

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

/* ────────────────────────── ESTILOS ───────────────────────── */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  loadingContainer:{flex:1,justifyContent:'center',alignItems:'center'},
  header:{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:1,borderBottomColor:'#eee'},
  dateContainer:{flexDirection:'row',alignItems:'center',flex:1,marginLeft:15},
  dateText:{fontSize:18,fontWeight:'bold',marginHorizontal:10},
  calendarButton:{marginRight:10},
  barberosHeader:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#000',paddingVertical:10},
  timeColumn:{width:80},
  barberoHeader:{flex:1,alignItems:'center',paddingHorizontal:5,borderRightWidth:1,borderRightColor:'#000'},
  avatar:{width:40,height:40,borderRadius:20,marginBottom:5},
  barberoNombre:{fontWeight:'bold',fontSize:14,textAlign:'center'},
  subItem:{fontSize:10,color:'#666',textAlign:'center'},
  mainContent:{flex:1,marginBottom:60},
  row:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#000',minHeight:60},
  timeCell:{width:80,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#000'},
  horaText:{fontSize:14},
  slot:{flex:1,borderRightWidth:1,borderRightColor:'#000',backgroundColor:'#fff',padding:5},
  slotConCita:{backgroundColor:'#D9D9D9'},
  selectedSlot:{backgroundColor:'#D9D9D9'},
  citaContent:{flex:1,justifyContent:'center'},
  citaCliente:{fontSize:12,fontWeight:'bold',marginBottom:2},
  citaServicio:{fontSize:10,color:'#555'},
  scrollContent:{paddingBottom:20},
  calendarModal:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  customDatePicker:{width:width*0.85,maxWidth:350,backgroundColor:'#fff',borderRadius:10,padding:12,elevation:5},
  datePickerHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
  monthYearSelector:{flex:1,alignItems:'center'},
  monthYearText:{fontSize:18,fontWeight:'bold',color:'#333'},
  calendarContainer:{height:300,overflow:'hidden'},
  calendar:{marginBottom:10},
  datePickerActions:{flexDirection:'row',justifyContent:'space-between'},
  datePickerButton:{padding:10,borderRadius:5},
  datePickerButtonText:{color:'#424242',fontWeight:'bold'},
  closeButton:{padding:10,borderRadius:5,backgroundColor:'#424242'},
  closeButtonText:{color:'#fff',fontWeight:'bold'},
  footerContainer:{position:'absolute',bottom:0,left:0,right:0,height:60},
});

export default AgendaScreen;
