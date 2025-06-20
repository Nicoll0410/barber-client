import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CrearCita from './CrearCita';
import DetalleCita from './DetalleCita';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import Footer from '../../components/Footer';

// Configuración de localización en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const { width, height } = Dimensions.get('window');

const AgendaScreen = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar la fecha actual
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showCrearCita, setShowCrearCita] = useState(false);
  const [showDetalleCita, setShowDetalleCita] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [citas, setCitas] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Años desde el actual hasta 10 años en el futuro
  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() + i);

  // Barberos con sus avatares
  const barberos = [
    { id: '1', nombre: 'Carlos', avatar: require('../../assets/avatar.png'), subItems: ['Barbero'] },
    { id: '2', nombre: 'Luis', avatar: require('../../assets/avatar.png'), subItems: ['Barbero'] },
    { id: '3', nombre: 'Miguel', avatar: require('../../assets/avatar.png'), subItems: ['Barbero'] },
  ];

  // Generar slots de tiempo cada 30 minutos según el día
  const generateTimeSlots = () => {
    const day = selectedDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const slots = [];
    let startHour, endHour;
    
    // Definir horarios exactos según lo solicitado
    if (day >= 1 && day <= 3) { // Lunes a Miércoles
      startHour = 11; // 11:00 am
      endHour = 21;   // 9:00 pm (última cita termina a las 9:00 pm)
    } else { // Jueves a Domingo
      startHour = 9;  // 9:00 am
      endHour = 22;   // 10:00 pm (última cita termina a las 10:00 pm)
    }
    
    // Generar slots cada 30 minutos hasta la hora final exacta
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        startTime: `${hour}:00`,
        endTime: `${hour}:30`,
        displayTime: formatTime(`${hour}:00`),
        key: `${hour}:00`
      });
      
      slots.push({
        startTime: `${hour}:30`,
        endTime: `${hour + 1}:00`,
        displayTime: formatTime(`${hour}:30`),
        key: `${hour}:30`
      });
    }
    
    // Agregar el último slot de la hora final (sin los 30 minutos)
    if (day >= 1 && day <= 3) { // Lunes a Miércoles
      slots.push({
        startTime: `21:00`,
        endTime: `21:30`,
        displayTime: formatTime(`21:00`),
        key: `21:00`
      });
    } else { // Jueves a Domingo
      slots.push({
        startTime: `22:00`,
        endTime: `22:30`,
        displayTime: formatTime(`22:00`),
        key: `22:00`
      });
    }
    
    // Filtrar slots pasados si es el día actual
    if (isToday(selectedDate)) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      return slots.filter(slot => {
        const [hourStr, minuteStr] = slot.startTime.split(':');
        const slotHour = parseInt(hourStr);
        const slotMinute = parseInt(minuteStr);
        
        return slotHour > currentHour || 
              (slotHour === currentHour && slotMinute >= currentMinute);
      });
    }
    
    return slots;
  };

  const isToday = (date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum < 12 ? 'am' : 'pm';
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum;
    return `${hour12}:${minute} ${ampm}`;
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    
    if (!isPastDate(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const changeMonth = (increment) => {
    let newMonth = calendarMonth + increment;
    let newYear = calendarYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    if (newYear === today.getFullYear() && newMonth < today.getMonth()) {
      return;
    }
    
    if (newYear < today.getFullYear()) {
      return;
    }
    
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  const onDayPress = (day) => {
    const [year, month, dayNum] = day.dateString.split('-').map(Number);
    const newDate = new Date(year, month - 1, dayNum);
    
    if (!isPastDate(newDate)) {
      setSelectedDate(newDate);
      setShowCalendar(false);
    }
  };

  const handleSlotPress = (slot, barbero) => {
    const citaExistente = citas.find(c => 
      c.fecha.toDateString() === selectedDate.toDateString() && 
      c.slot.key === slot.key && 
      c.barbero.id === barbero.id
    );
    
    if (citaExistente) {
      setSelectedCita(citaExistente);
      setShowDetalleCita(true);
    } else {
      setSelectedSlot({ ...slot, barbero, fecha: selectedDate });
      setShowCrearCita(true);
    }
  };

  const handleCrearCita = (nuevaCita) => {
    setCitas([...citas, {
      ...nuevaCita,
      id: Date.now().toString(),
      fecha: selectedDate,
      slot: selectedSlot,
      barbero: selectedSlot.barbero
    }]);
    setShowCrearCita(false);
    setSelectedSlot(null);
  };

  const getCitaForSlot = (slot, barbero) => {
    return citas.find(c => 
      c.fecha.toDateString() === selectedDate.toDateString() && 
      c.slot.key === slot.key && 
      c.barbero.id === barbero.id
    );
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDisabledDates = () => {
    const disabledDates = {};
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);
    
    const startDate = new Date(calendarYear, calendarMonth - 1, 1);
    const endDate = new Date(calendarYear, calendarMonth + 2, 0);
    const tempDate = new Date(startDate);
    
    while (tempDate <= endDate) {
      if (tempDate < today) {
        disabledDates[formatDateString(tempDate)] = { 
          disabled: true, 
          disableTouchEvent: true 
        };
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return disabledDates;
  };

  return (
    <View style={styles.container}>
      {/* Header con fecha y calendario */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          setCalendarMonth(selectedDate.getMonth());
          setCalendarYear(selectedDate.getFullYear());
          setShowCalendar(true);
        }} style={styles.calendarButton}>
          <MaterialIcons name="calendar-today" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            onPress={() => navigateDay('prev')}
            disabled={isToday(selectedDate)}
          >
            <MaterialIcons 
              name="chevron-left" 
              size={24} 
              color={isToday(selectedDate) ? '#ccc' : '#000'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          
          <TouchableOpacity onPress={() => navigateDay('next')}>
            <MaterialIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de barberos */}
      <View style={styles.barberosHeader}>
        <View style={styles.timeColumn}></View>
        {barberos.map((barbero) => (
          <View key={barbero.id} style={styles.barberoHeader}>
            <Image source={barbero.avatar} style={styles.avatar} />
            <Text style={styles.barberoNombre}>{barbero.nombre}</Text>
            {barbero.subItems.map((subItem, index) => (
              <Text key={index} style={styles.subItem}>{subItem}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Contenedor principal con ScrollView */}
      <View style={styles.mainContent}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {generateTimeSlots().map((slot) => (
            <View key={slot.key} style={styles.row}>
              <View style={styles.timeCell}>
                <Text style={styles.horaText}>{slot.displayTime}</Text>
              </View>
              {barberos.map((barbero) => {
                const cita = getCitaForSlot(slot, barbero);
                
                return (
                  <TouchableOpacity
                    key={`${slot.key}-${barbero.id}`}
                    style={[
                      styles.slot,
                      cita && styles.slotConCita,
                      selectedSlot?.key === slot.key && selectedSlot?.barbero.id === barbero.id && styles.selectedSlot
                    ]}
                    onPress={() => handleSlotPress(slot, barbero)}
                  >
                    {cita && (
                      <View style={styles.citaContent}>
                        <Text style={styles.citaCliente}>{cita.cliente}</Text>
                        <Text style={styles.citaServicio}>{cita.servicio}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Calendario modal */}
      <Modal visible={showCalendar} animationType="fade" transparent={true}>
        <BlurView
          intensity={15}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.calendarModal}>
          <View style={styles.customDatePicker}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity 
                onPress={() => changeMonth(-1)}
                disabled={calendarYear === today.getFullYear() && calendarMonth === today.getMonth()}
              >
                <MaterialIcons 
                  name="chevron-left" 
                  size={24} 
                  color={
                    calendarYear === today.getFullYear() && calendarMonth === today.getMonth()
                      ? '#ccc' 
                      : '#333'
                  } 
                />
              </TouchableOpacity>
              
              <View style={styles.monthYearSelector}>
                <Text style={styles.monthYearText}>
                  {months[calendarMonth]} de {calendarYear}
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <MaterialIcons name="chevron-right" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.yearSelectorContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.yearScrollContent}
              >
                {years.map(year => (
                  <TouchableOpacity 
                    key={year}
                    style={[
                      styles.yearButton,
                      calendarYear === year && styles.selectedYearButton
                    ]}
                    onPress={() => {
                      setCalendarYear(year);
                      if (year === today.getFullYear() && calendarMonth < today.getMonth()) {
                        setCalendarMonth(today.getMonth());
                      }
                    }}
                  >
                    <Text style={[
                      styles.yearButtonText,
                      calendarYear === year && styles.selectedYearButtonText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.calendarContainer}>
              <Calendar
                key={`${calendarYear}-${calendarMonth}`}
                current={`${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-01`}
                minDate={today.toISOString().split('T')[0]}
                onDayPress={onDayPress}
                monthFormat={'MMMM yyyy'}
                hideArrows={true}
                hideExtraDays={false}
                disableMonthChange={true}
                markedDates={{
                  ...getDisabledDates(),
                  [formatDateString(selectedDate)]: { 
                    selected: true, 
                    selectedColor: '#424242',
                    selectedTextColor: '#fff'
                  },
                  [today.toISOString().split('T')[0]]: { 
                    marked: true, 
                    dotColor: '#424242'
                  }
                }}
                theme={{
                  calendarBackground: 'transparent',
                  textSectionTitleColor: '#666',
                  dayTextColor: '#333',
                  todayTextColor: '#424242',
                  selectedDayTextColor: '#fff',
                  selectedDayBackgroundColor: '#424242',
                  arrowColor: '#424242',
                  monthTextColor: '#333',
                  textDayFontWeight: '400',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '500',
                  textDayFontSize: 12,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                  'stylesheet.calendar.header': {
                    week: {
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }
                  },
                  'stylesheet.calendar.main': {
                    container: {
                      padding: 0,
                    },
                    week: {
                      marginTop: 0,
                      marginBottom: 0,
                      flexDirection: 'row',
                      justifyContent: 'space-around'
                    },
                  },
                  disabledDayTextColor: '#d9d9d9'
                }}
                style={styles.calendar}
                disableAllTouchEventsForDisabledDays={true}
              />
            </View>
            
            <View style={styles.datePickerActions}>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  setSelectedDate(today);
                  setCalendarMonth(today.getMonth());
                  setCalendarYear(today.getFullYear());
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.datePickerButtonText}>Hoy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para crear cita */}
      <CrearCita
        visible={showCrearCita}
        onClose={() => setShowCrearCita(false)}
        onCreate={handleCrearCita}
        barbero={selectedSlot?.barbero}
        fecha={selectedDate}
        slot={selectedSlot}
      />

      {/* Modal para ver detalle de cita */}
      <DetalleCita
        visible={showDetalleCita}
        onClose={() => setShowDetalleCita(false)}
        cita={selectedCita}
      />
      
      {/* Footer fijo en la parte inferior */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  calendarButton: {
    marginRight: 10,
  },
  barberosHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,
  },
  timeColumn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  barberoHeader: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  barberoNombre: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  subItem: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    marginBottom: 60, // Espacio para el footer
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 60,
  },
  timeCell: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  horaText: {
    fontSize: 14,
  },
  slot: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    backgroundColor: '#fff',
    padding: 5,
  },
  slotConCita: {
    backgroundColor: '#D9D9D9',
  },
  selectedSlot: {
    backgroundColor: '#D9D9D9',
  },
  citaContent: {
    flex: 1,
    justifyContent: 'center',
  },
  citaCliente: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  citaServicio: {
    fontSize: 10,
    color: '#555',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Espacio adicional al final del contenido
  },
  calendarModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  customDatePicker: {
    width: width * 0.85,
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthYearSelector: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  yearSelectorContainer: {
    marginBottom: 10,
  },
  yearScrollContent: {
    paddingHorizontal: 10,
  },
  yearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
  },
  selectedYearButton: {
    backgroundColor: '#424242',
  },
  yearButtonText: {
    color: '#666',
  },
  selectedYearButtonText: {
    color: 'white',
  },
  calendarContainer: {
    height: 300,
    overflow: 'hidden',
  },
  calendar: {
    marginBottom: 10,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#424242',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#424242',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Altura del footer
  },
});

export default AgendaScreen;