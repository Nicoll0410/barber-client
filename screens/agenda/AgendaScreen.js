import React, { useState, useCallback, useEffect } from 'react';
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
  const [disponibilidadBarberos, setDisponibilidadBarberos] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const diasSemanaTexto = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  const getHorarioBarberia = (day) => {
    if (day >= 1 && day <= 3) {
      return { inicio: 11, fin: 21 };
    } else {
      return { inicio: 9, fin: 22 };
    }
  };

  const fetchBarberos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        'http://localhost:8080/barberos',
        { 
          params: { page: 1, limit: 100, all: 'true' },
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      const barberosConHorario = await Promise.all(data.barberos.map(async b => {
        try {
          const horarioResponse = await axios.get(
            `http://localhost:8080/barberos/${b.id}/horario`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          return {
            id: b.id,
            nombre: b.nombre,
            avatar: b.avatar
              ? { uri: b.avatar }
              : require('../../assets/avatar.png'),
            subItems: ['Barbero'],
            disponibilidad: horarioResponse.data?.horario || {
              diasLaborales: {
                lunes: { activo: false, horas: [] },
                martes: { activo: false, horas: [] },
                miercoles: { activo: false, horas: [] },
                jueves: { activo: false, horas: [] },
                viernes: { activo: false, horas: [] },
                sabado: { activo: false, horas: [] },
                domingo: { activo: false, horas: [] }
              },
              horarioAlmuerzo: {
                inicio: "13:00",
                fin: "14:00",
                activo: true
              },
              excepciones: []
            }
          };
        } catch (error) {
          console.error(`Error al obtener horario para barbero ${b.id}:`, error);
          return {
            id: b.id,
            nombre: b.nombre,
            avatar: b.avatar
              ? { uri: b.avatar }
              : require('../../assets/avatar.png'),
            subItems: ['Barbero'],
            disponibilidad: {
              diasLaborales: {
                lunes: { activo: false, horas: [] },
                martes: { activo: false, horas: [] },
                miercoles: { activo: false, horas: [] },
                jueves: { activo: false, horas: [] },
                viernes: { activo: false, horas: [] },
                sabado: { activo: false, horas: [] },
                domingo: { activo: false, horas: [] }
              },
              horarioAlmuerzo: {
                inicio: "13:00",
                fin: "14:00",
                activo: true
              },
              excepciones: []
            }
          };
        }
      }));

      setBarberos(barberosConHorario);
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
              duracionMaxima: cita.servicio.duracion,
              precio: cita.servicio.precio,
            },
            barbero: {
              id: barbero.id,
              nombre: barbero.name,
              avatar: barbero.avatar
                ? { uri: barbero.avatar }
                : require('../../assets/avatar.png'),
              disponibilidad: barbero.disponibilidad
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
          email: c.usuario?.email,
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

  useFocusEffect(
    useCallback(() => {
      fetchBarberos();
      fetchCitas();
      fetchInformationForCreate();
    }, [selectedDate, refreshKey])
  );

  const formatDateString = d => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const da = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  const normalizeHoraFromDecimal = decimal => {
    const h = Math.floor(decimal);
    const m = Math.round((decimal - h) * 60);
    return `${`${h}`.padStart(2, '0')}:${`${m}`.padStart(2, '0')}:00`;
  };

  const toAMPM = t => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${`${m}`.padStart(2, '0')} ${period}`;
  };

  const calcularDisponibilidad = useCallback(() => {
    const nuevaDisponibilidad = {};
    
    barberos.forEach(barbero => {
      const disponibilidad = barbero.disponibilidad || {};
      const diaActual = selectedDate.getDay();
      const diaSemanaTexto = diasSemanaTexto[diaActual];
      const fechaStr = formatDateString(selectedDate);
      
      const esDiaLaboral = disponibilidad.diasLaborales?.[diaSemanaTexto]?.activo || false;
      
      const tieneExcepcion = disponibilidad.excepciones?.some(ex => 
        ex.fecha === fechaStr && ex.activo === false
      );
      
      const horasDisponibles = generateTimeSlots().filter(slot => {
        return isBarberoDisponible(barbero, selectedDate, slot.startTime);
      }).length;

      const citasBarbero = citas.filter(c => c.barbero.id === barbero.id);
      const estaCompleto = horasDisponibles <= citasBarbero.length;

      nuevaDisponibilidad[barbero.id] = {
        esDiaLaboral,
        tieneExcepcion,
        estaCompleto,
        horasDisponibles
      };
    });

    setDisponibilidadBarberos(nuevaDisponibilidad);
  }, [barberos, selectedDate, citas]);

  useEffect(() => {
    if (barberos.length > 0 && citas) {
      calcularDisponibilidad();
    }
  }, [barberos, selectedDate, citas, calcularDisponibilidad]);

  const isBarberoDisponible = (barbero, fecha, hora) => {
    const disponibilidad = barbero.disponibilidad || {};
    const diaSemana = fecha.getDay();
    const diaSemanaTexto = diasSemanaTexto[diaSemana];
    const fechaStr = formatDateString(fecha);
    
    // 1. Verificar excepciones
    const tieneExcepcion = disponibilidad.excepciones?.some(ex => 
      ex.fecha === fechaStr && ex.activo === false
    );
    if (tieneExcepcion) return false;
    
    // 2. Verificar día laboral
    const diaConfig = disponibilidad.diasLaborales?.[diaSemanaTexto];
    if (!diaConfig?.activo) {
      return false;
    }
    
    // 3. Convertir hora a minutos para comparación
    const [horaActual, minActual] = hora.split(':').map(Number);
    const horaActualMinutos = horaActual * 60 + minActual;
    
    // 4. Verificar horario específico del día si está configurado
    if (diaConfig.horas && diaConfig.horas.length > 0) {
      const horaDisponible = diaConfig.horas.some(h => {
        const [horaDisp, minDisp] = h.split(':').map(Number);
        return horaDisp === horaActual && minDisp === minActual;
      });
      if (!horaDisponible) return false;
    }
    
    // 5. Verificar horario de almuerzo
    if (disponibilidad.horarioAlmuerzo?.activo !== false) {
      const almuerzoInicio = disponibilidad.horarioAlmuerzo?.inicio || '13:00';
      const almuerzoFin = disponibilidad.horarioAlmuerzo?.fin || '14:00';
      
      const [almuerzoHInicio, almuerzoMInicio] = almuerzoInicio.split(':').map(Number);
      const [almuerzoHFin, almuerzoMFin] = almuerzoFin.split(':').map(Number);
      
      const almuerzoInicioMinutos = almuerzoHInicio * 60 + almuerzoMInicio;
      const almuerzoFinMinutos = almuerzoHFin * 60 + almuerzoMFin;
      
      if (horaActualMinutos >= almuerzoInicioMinutos && horaActualMinutos < almuerzoFinMinutos) {
        return false;
      }
    }
    
    // 6. Verificar si ya tiene cita en ese horario
    const citaExistente = citas.find(c => 
      c.barbero.id === barbero.id && 
      c.fecha.toDateString() === fecha.toDateString() && 
      c.hora === `${hora}:00`
    );
    
    return !citaExistente;
  };

  const generateTimeSlots = () => {
    const day = selectedDate.getDay();
    const horarioBarberia = getHorarioBarberia(day);
    const slots = [];

    for (let h = horarioBarberia.inicio; h < horarioBarberia.fin; h++) {
      if (day >= 1 && day <= 3 && h === 21) {
        slots.push({
          key: '21:00',
          startTime: '21:00',
          endTime: '21:30',
          displayTime: '9:00 pm'
        });
        break;
      }
      
      ['00','30'].forEach(min => {
        const start = `${h < 10 ? '0' + h : h}:${min}`;
        const end = min === '00' 
          ? `${h < 10 ? '0' + h : h}:30`
          : `${h + 1 < 10 ? '0' + (h + 1) : h + 1}:00`;
        
        slots.push({
          key: start,
          startTime: start,
          endTime: end,
          displayTime: toAMPM(start),
        });
      });
    }

    if (isToday(selectedDate)) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTotal = currentHour * 60 + currentMinute;
      
      return slots.filter(s => {
        const [h, m] = s.startTime.split(':').map(Number);
        const slotTotal = h * 60 + m;
        return slotTotal >= currentTotal;
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
      if (!isBarberoDisponible(barbero, selectedDate, slot.startTime)) {
        Alert.alert('No disponible', 'El barbero no está disponible en este horario');
        return;
      }
      setSelectedSlot({ ...slot, barbero, fecha: selectedDate });
      setShowCrearCita(true);
    }
  };

  const onCitaCreada = () => {
    setRefreshKey(prev => prev + 1);
    setShowCrearCita(false);
    setSelectedSlot(null);
  };

  const onCitaActualizada = () => {
    setRefreshKey(prev => prev + 1);
    setShowDetalleCita(false);
  };

  const getDisabledDates = () => {
    const disabled = {};
    const start = new Date(selectedDate.getFullYear(),
                           selectedDate.getMonth()-1, 1);
    const end = new Date(selectedDate.getFullYear(),
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

  const renderBarberoHeader = (b) => {
    const disp = disponibilidadBarberos[b.id] || {};
    const estaDisponible = disp.esDiaLaboral && !disp.tieneExcepcion && !disp.estaCompleto;
    
    return (
      <View key={b.id} style={styles.barberoHeader}>
        <Image source={b.avatar} style={styles.avatar} />
        <Text style={styles.barberoNombre}>{b.nombre}</Text>
        <Text style={styles.subItem}>Barbero</Text>
        <View style={styles.disponibilidadContainer}>
          <View style={[
            styles.disponibilidadPunto,
            estaDisponible ? styles.disponible : styles.noDisponible
          ]} />
          <Text style={[
            styles.disponibilidadTexto,
            estaDisponible ? styles.disponible : styles.noDisponible
          ]}>
            {estaDisponible ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </View>
    );
  };

  const renderBarberoSlot = (slot, b) => {
    const cita = citaForSlot(slot, b);
    const disp = disponibilidadBarberos[b.id] || {};
    
    let cellState = 'disponible';
    if (cita) {
      cellState = 'ocupado';
    } else if (!disp.esDiaLaboral || disp.tieneExcepcion) {
      cellState = 'no-laboral';
    } else {
      const horaDecimal = parseInt(slot.startTime.split(':')[0]) + 
                         (parseInt(slot.startTime.split(':')[1]) / 60);
      
      const diaSemana = selectedDate.getDay();
      const diaSemanaTexto = diasSemanaTexto[diaSemana];
      const diaConfig = b.disponibilidad.diasLaborales?.[diaSemanaTexto];
      
      if (diaConfig?.horas && diaConfig.horas.length > 0) {
        const horaDisponible = diaConfig.horas.some(h => h === slot.startTime);
        if (!horaDisponible) {
          cellState = 'fuera-horario';
        }
      }
      
      if (cellState === 'disponible' && b.disponibilidad?.horarioAlmuerzo?.activo !== false) {
        const [almuerzoInicio, almuerzoMinInicio] = b.disponibilidad?.horarioAlmuerzo?.inicio?.split(':').map(Number) || [13, 0];
        const [almuerzoFin, almuerzoMinFin] = b.disponibilidad?.horarioAlmuerzo?.fin?.split(':').map(Number) || [14, 0];
        
        const almuerzoInicioDecimal = almuerzoInicio + almuerzoMinInicio / 60;
        const almuerzoFinDecimal = almuerzoFin + almuerzoMinFin / 60;
        
        if (horaDecimal >= almuerzoInicioDecimal && horaDecimal < almuerzoFinDecimal) {
          cellState = 'almuerzo';
        }
      }
    }

    return (
      <TouchableOpacity
        key={`${slot.key}-${b.id}`}
        style={[
          styles.slot,
          styles[`slot-${cellState}`],
          selectedSlot?.key === slot.key && selectedSlot?.barbero.id === b.id && styles.selectedSlot,
        ]}
        onPress={() => cellState === 'disponible' ? handleSlotPress(slot, b) : null}
        disabled={cellState !== 'disponible'}
      >
        {cellState === 'no-laboral' && (
          <Text style={styles.slotNoLaboralText}>NO LABORAL</Text>
        )}
        {cellState === 'almuerzo' && (
          <Text style={styles.slotAlmuerzoText}>ALMUERZO</Text>
        )}
        {cellState === 'fuera-horario' && (
          <Text style={styles.slotFueraHorarioText}>---</Text>
        )}
        {cellState === 'disponible' && !cita && (
          <Text style={styles.slotDisponibleText}>DISPONIBLE</Text>
        )}
        {cita && (
          <TouchableOpacity 
            style={styles.citaContent}
            onPress={() => {
              setSelectedCita(cita);
              setShowDetalleCita(true);
            }}
          >
            <Text style={styles.citaCliente}>{cita.cliente.nombre}</Text>
            <Text style={styles.citaServicio}>{cita.servicio.nombre}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

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

      <View style={styles.barberosHeader}>
        <View style={styles.timeColumn} />
        {barberos.map(renderBarberoHeader)}
      </View>

      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {generateTimeSlots().map(slot => (
            <View key={slot.key} style={styles.row}>
              <View style={styles.timeCell}>
                <Text style={styles.horaText}>{slot.displayTime}</Text>
              </View>
              {barberos.map(b => renderBarberoSlot(slot, b))}
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal visible={showCalendar} animationType="fade" transparent>
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.calendarModal}>
          <View style={styles.customDatePicker}>
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

      <DetalleCita
        visible={showDetalleCita}
        onClose={() => setShowDetalleCita(false)}
        cita={selectedCita}
        onDelete={onCitaActualizada}
        onUpdate={onCitaActualizada}
      />

      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

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
  slot:{flex:1,borderRightWidth:1,borderRightColor:'#000',padding:5,justifyContent:'center',alignItems:'center'},
  'slot-no-laboral':{backgroundColor:'#FFEBEE'},
  'slot-almuerzo':{backgroundColor:'#FFF8E1'},
  'slot-fuera-horario':{backgroundColor:'#F5F5F5',opacity:0.6},
  'slot-ocupado':{backgroundColor:'#E0E0E0'},
  'slot-disponible':{backgroundColor:'#E8F5E9'},
  selectedSlot:{backgroundColor:'#D9D9D9'},
  slotNoLaboralText:{fontSize:10,color:'#F44336',fontWeight:'bold',textAlign:'center'},
  slotAlmuerzoText:{fontSize:10,color:'#FF8F00',fontWeight:'bold',textAlign:'center'},
  slotFueraHorarioText:{fontSize:10,color:'#9E9E9E',textAlign:'center',textDecorationLine:'line-through'},
  slotDisponibleText:{fontSize:10,color:'#2E7D32',textAlign:'center', fontWeight: 'bold'},
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
  disponibilidadContainer:{flexDirection:'row',alignItems:'center',marginTop:4},
  disponibilidadPunto:{width:8,height:8,borderRadius:4,marginRight:4},
  disponible:{color:'#000000ff',backgroundColor:'#4CAF50', borderRadius: 7},
  noDisponible:{color:'#000000ff',backgroundColor:'#F44336', borderRadius: 7},
  disponibilidadTexto:{fontSize:10,fontWeight:'bold'},
});

export default AgendaScreen;