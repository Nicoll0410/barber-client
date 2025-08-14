import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  ActivityIndicator, 
  Alert,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' }
];

const generateHours = () => {
  const hours = [];
  for (let h = 8; h <= 22; h++) {
    ['00', '30'].forEach(min => {
      hours.push(`${h < 10 ? '0' + h : h}:${min}`);
    });
  }
  return hours;
};

const horasDisponibles = generateHours();

const defaultHorario = {
  diasLaborales: {
    lunes: { activo: false, horas: [] },
    martes: { activo: false, horas: [] },
    miercoles: { activo: false, horas: [] },
    jueves: { activo: false, horas: [] },
    viernes: { activo: false, horas: [] },
    sabado: { activo: false, horas: [] },
    domingo: { activo: false, horas: [] }
  },
  horarioAlmuerzo: { inicio: '13:00', fin: '14:00', activo: true },
  excepciones: []
};

const HorarioBarbero = ({ barberoId, fecha, visible, onClose }) => {
  const [horario, setHorario] = useState(defaultHorario);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [almuerzo, setAlmuerzo] = useState(defaultHorario.horarioAlmuerzo);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (visible && barberoId && fecha) {
      fetchHorario();
      fetchCitas();
    } else {
      setHorario(defaultHorario);
      setAlmuerzo(defaultHorario.horarioAlmuerzo);
      setCitas([]);
    }
  }, [visible, barberoId, fecha]);

  const fetchHorario = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/barberos/${barberoId}/horario`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.horario) {
        const horarioRecibido = response.data.horario;
        
        const diasLaboralesNormalizados = {
          lunes: horarioRecibido.diasLaborales?.lunes || { activo: false, horas: [] },
          martes: horarioRecibido.diasLaborales?.martes || { activo: false, horas: [] },
          miercoles: horarioRecibido.diasLaborales?.miercoles || { activo: false, horas: [] },
          jueves: horarioRecibido.diasLaborales?.jueves || { activo: false, horas: [] },
          viernes: horarioRecibido.diasLaborales?.viernes || { activo: false, horas: [] },
          sabado: horarioRecibido.diasLaborales?.sabado || { activo: false, horas: [] },
          domingo: horarioRecibido.diasLaborales?.domingo || { activo: false, horas: [] }
        };

        let horarioAlmuerzoNormalizado = horarioRecibido.horarioAlmuerzo || { 
          inicio: '13:00', 
          fin: '14:00', 
          activo: true 
        };

        if (!horarioAlmuerzoNormalizado.inicio || !horarioAlmuerzoNormalizado.fin) {
          horarioAlmuerzoNormalizado = { inicio: '13:00', fin: '14:00', activo: true };
        }

        setHorario({
          ...defaultHorario,
          diasLaborales: diasLaboralesNormalizados,
          horarioAlmuerzo: horarioAlmuerzoNormalizado,
          excepciones: horarioRecibido.excepciones || []
        });

        setAlmuerzo(horarioAlmuerzoNormalizado);
      }
    } catch (error) {
      console.error('Error al obtener horario:', error);
      Alert.alert('Error', 'No se pudo cargar el horario del barbero');
      setHorario(defaultHorario);
      setAlmuerzo(defaultHorario.horarioAlmuerzo);
    }
  };

  const fetchCitas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
      
      const response = await axios.get(`http://localhost:8080/citas`, {
        params: {
          barberoID: barberoId,
          fecha: fechaFormateada,
          all: 'true'
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCitas(response.data?.citas || []);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDiaActivo = (diaId) => {
    setHorario(prev => ({
      ...prev,
      diasLaborales: {
        ...prev.diasLaborales,
        [diaId]: {
          ...prev.diasLaborales[diaId],
          activo: !prev.diasLaborales[diaId]?.activo
        }
      }
    }));
  };

  const toggleHora = (diaId, hora) => {
    setHorario(prev => {
      const diaActual = prev.diasLaborales[diaId] || { activo: false, horas: [] };
      const horas = [...diaActual.horas];
      const index = horas.indexOf(hora);
      
      if (index === -1) {
        horas.push(hora);
      } else {
        horas.splice(index, 1);
      }

      return {
        ...prev,
        diasLaborales: {
          ...prev.diasLaborales,
          [diaId]: {
            ...diaActual,
            horas: horas.sort()
          }
        }
      };
    });
  };

  const handleAlmuerzoChange = (field, value) => {
    setAlmuerzo(prev => {
      const newAlmuerzo = { ...prev, [field]: value };
      
      const [inicioH, inicioM] = (field === 'inicio' ? value : prev.inicio).split(':').map(Number);
      const [finH, finM] = (field === 'fin' ? value : prev.fin).split(':').map(Number);
      
      const inicioTotal = inicioH * 60 + inicioM;
      const finTotal = finH * 60 + finM;
      
      if (finTotal <= inicioTotal) {
        Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
        return prev;
      }
      
      return newAlmuerzo;
    });
  };

  const toggleAlmuerzoActivo = () => {
    setAlmuerzo(prev => ({
      ...prev,
      activo: !prev.activo
    }));
  };

  const saveHorario = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const [inicioH, inicioM] = almuerzo.inicio.split(':').map(Number);
      const [finH, finM] = almuerzo.fin.split(':').map(Number);
      
      const inicioTotal = inicioH * 60 + inicioM;
      const finTotal = finH * 60 + finM;
      
      if (finTotal <= inicioTotal) {
        Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
        return;
      }

      if ((finTotal - inicioTotal) < 30) {
        Alert.alert('Error', 'El horario de almuerzo debe ser de al menos 30 minutos');
        return;
      }

      const datosEnviar = {
        diasLaborales: horario.diasLaborales,
        horarioAlmuerzo: almuerzo,
        excepciones: horario.excepciones || []
      };

      await axios.put(`http://localhost:8080/barberos/${barberoId}/horario`, datosEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar horario:', error);
      Alert.alert('Error', 'No se pudo guardar el horario');
    } finally {
      setLoading(false);
    }
  };

  const getCitaForSlot = (hora) => {
    return citas.find(cita => {
      const citaHora = cita.hora.split(':').slice(0, 2).join(':');
      const citaHoraFin = cita.horaFin.split(':').slice(0, 2).join(':');
      return hora >= citaHora && hora < citaHoraFin;
    });
  };

  const renderHourSlot = (hora, diaId) => {
    const cita = getCitaForSlot(hora);
    const isSelected = horario.diasLaborales[diaId]?.horas?.includes(hora);
    
    if (cita) {
      return (
        <View key={`${diaId}-${hora}-ocupado`} style={styles.hourButtonOccupied}>
          <Text style={styles.hourTextOccupied}>{hora}</Text>
          <Text style={styles.citaCliente} numberOfLines={1}>
            {cita.cliente?.nombre || cita.pacienteTemporalNombre || 'Cliente'}
          </Text>
          <Text style={styles.citaServicio} numberOfLines={1}>
            {cita.servicio?.nombre || 'Servicio'}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`${diaId}-${hora}`}
        style={[
          styles.hourButton,
          isSelected && styles.hourButtonSelected
        ]}
        onPress={() => toggleHora(diaId, hora)}
        disabled={loading}
      >
        <Text style={[
          styles.hourText,
          isSelected && styles.hourTextSelected
        ]}>
          {hora}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  if (loading && !citas.length) {
    return (
      <Modal visible={true} transparent animationType="fade">
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#424242" />
          <Text>Cargando horario...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Horario del Barbero - {fecha.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
            
            {/* Configuración de almuerzo */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Horario de Almuerzo</Text>
                <TouchableOpacity onPress={toggleAlmuerzoActivo}>
                  <MaterialIcons 
                    name={almuerzo.activo ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color={almuerzo.activo ? "#424242" : "#ccc"} 
                  />
                </TouchableOpacity>
              </View>
              
              {almuerzo.activo && (
                <View style={styles.timeInputContainer}>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeLabel}>Inicio:</Text>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        setCurrentDay('almuerzo-inicio');
                        setShowTimePicker(true);
                      }}
                    >
                      <Text style={styles.timeText}>{almuerzo.inicio}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.timeInput}>
                    <Text style={styles.timeLabel}>Fin:</Text>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        setCurrentDay('almuerzo-fin');
                        setShowTimePicker(true);
                      }}
                    >
                      <Text style={styles.timeText}>{almuerzo.fin}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Días laborales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Días Laborales</Text>
              
              {diasSemana.map(dia => {
                const diaData = horario.diasLaborales[dia.id] || { activo: false, horas: [] };
                return (
                  <View key={dia.id} style={styles.dayContainer}>
                    <View style={styles.dayHeader}>
                      <TouchableOpacity onPress={() => toggleDiaActivo(dia.id)}>
                        <MaterialIcons 
                          name={diaData.activo ? "check-box" : "check-box-outline-blank"} 
                          size={24} 
                          color={diaData.activo ? "#424242" : "#ccc"} 
                        />
                      </TouchableOpacity>
                      <Text style={styles.dayName}>{dia.nombre}</Text>
                    </View>
                    
                    {diaData.activo && (
                      <View style={styles.hoursContainer}>
                        <Text style={styles.hoursTitle}>Horas disponibles:</Text>
                        <View style={styles.hoursGrid}>
                          {horasDisponibles.map(hora => renderHourSlot(hora, dia.id))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={saveHorario}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.timePickerModal}>
          <View style={styles.timePickerContent}>
            <Text style={styles.timePickerTitle}>
              Seleccionar Hora
            </Text>
            
            <ScrollView contentContainerStyle={styles.timePickerScroll}>
              {horasDisponibles.map(hora => (
                <TouchableOpacity
                  key={hora}
                  style={styles.timeOption}
                  onPress={() => {
                    if (currentDay === 'almuerzo-inicio') {
                      handleAlmuerzoChange('inicio', hora);
                    } else if (currentDay === 'almuerzo-fin') {
                      handleAlmuerzoChange('fin', hora);
                    }
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={styles.timeOptionText}>{hora}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.timePickerClose}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.timePickerCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.successModal}>
          <View style={styles.successContent}>
            <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.successText}>Horario guardado correctamente</Text>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  scrollContent: {
    paddingBottom: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#424242'
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#424242'
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 5
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666'
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center'
  },
  timeText: {
    fontSize: 16
  },
  dayContainer: {
    marginBottom: 15
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  dayName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#424242'
  },
  hoursContainer: {
    marginLeft: 35
  },
  hoursTitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666'
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  hourButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    margin: 3,
    minWidth: 70,
    alignItems: 'center'
  },
  hourButtonSelected: {
    backgroundColor: '#424242',
    borderColor: '#424242'
  },
  hourButtonOccupied: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 5,
    padding: 6,
    margin: 3,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hourText: {
    fontSize: 14
  },
  hourTextSelected: {
    color: 'white'
  },
  hourTextOccupied: {
    fontSize: 12,
    color: '#616161',
    fontWeight: 'bold'
  },
  citaCliente: {
    fontSize: 10,
    color: '#424242',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  citaServicio: {
    fontSize: 10,
    color: '#616161',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  saveButton: {
    backgroundColor: '#424242'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  timePickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  timePickerContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#424242'
  },
  timePickerScroll: {
    paddingBottom: 15
  },
  timeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  timeOptionText: {
    fontSize: 16,
    textAlign: 'center'
  },
  timePickerClose: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
  },
  timePickerCloseText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: 'bold'
  },
  successModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    elevation: 5
  },
  successText: {
    fontSize: 18,
    marginTop: 15,
    color: '#424242',
    fontWeight: 'bold'
  }
});

export default HorarioBarbero;