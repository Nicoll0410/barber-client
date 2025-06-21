import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal,
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  Picker
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';

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

const { width } = Dimensions.get('window');

const rolesDisponibles = [
  { label: 'Barbero', value: 'barbero' },
  { label: 'Administrador', value: 'administrador' },
  { label: 'Aprendiz', value: 'aprendiz' }
];

const EditarBarbero = ({ visible, onClose, barbero, onUpdate }) => {
  const [formData, setFormData] = useState({
    telefono: barbero?.telefono || '',
    email: barbero?.email || '',
    rol: barbero?.rol || 'barbero',
    avatar: barbero?.avatar || null
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tus fotos para seleccionar un avatar');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setFormData({...formData, avatar: result.uri});
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = () => {
    if (formData.telefono && formData.email) {
      onUpdate({
        ...barbero,
        telefono: formData.telefono,
        email: formData.email,
        rol: formData.rol,
        avatar: formData.avatar
      });
      onClose();
    } else {
      Alert.alert('Campos requeridos', 'Por favor complete todos los campos obligatorios');
    }
  };

  const formatDate = (fecha) => {
    return fecha ? moment(fecha).format('DD/MM/YYYY') : 'No especificada';
  };

  const changeMonth = (increment) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleDayPress = (day) => {
    setShowDatePicker(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={15}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Editar barbero</Text>
              <Text style={styles.subtitle}>Actualiza la información editable del barbero</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={barbero?.nombre || ''}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cédula</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={barbero?.cedula || ''}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.rol}
                  style={styles.picker}
                  onValueChange={(itemValue) => setFormData({...formData, rol: itemValue})}
                >
                  {rolesDisponibles.map((rol) => (
                    <Picker.Item key={rol.value} label={rol.label} value={rol.value} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="3001234567"
                  placeholderTextColor="#929292"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="barbero@email.com"
                  placeholderTextColor="#929292"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>
            </View>
            
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <TouchableOpacity 
                  style={[styles.input, styles.disabledInput, {justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}]}
                  disabled={true}
                >
                  <Text>{formatDate(barbero?.fechaNacimiento)}</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Fecha de contratación</Text>
                <TouchableOpacity 
                  style={[styles.input, styles.disabledInput, {justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}]}
                  disabled={true}
                >
                  <Text>{formatDate(barbero?.fechaContratacion)}</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Avatar (Opcional)</Text>
              <TouchableOpacity style={styles.avatarSelector} onPress={pickImage}>
                {formData.avatar ? (
                  <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons name="add-a-photo" size={24} color="#666" />
                    <Text style={styles.avatarText}>Seleccionar imagen</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            {showDatePicker && (
              <View style={styles.customDatePickerContainer}>
                <View style={styles.customDatePicker}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                      <MaterialIcons name="chevron-left" size={24} color="#333" />
                    </TouchableOpacity>
                    
                    <View style={styles.monthYearSelector}>
                      <Text style={styles.monthYearText}>
                        {months[selectedMonth]} de {selectedYear}
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                      <MaterialIcons name="chevron-right" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.calendarContainer}>
                    <Calendar
                      current={`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`}
                      minDate={'1900-01-01'}
                      maxDate={new Date().toISOString().split('T')[0]}
                      onDayPress={handleDayPress}
                      monthFormat={'MMMM yyyy'}
                      hideArrows={true}
                      hideExtraDays={true}
                      disableMonthChange={true}
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
                        }
                      }}
                      style={styles.calendar}
                    />
                  </View>
                  
                  <View style={styles.datePickerActions}>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => {
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={styles.datePickerButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.createButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
  formGroup: {
    marginBottom: 15,
  },
  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 2,
    borderColor: '#424242',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#424242',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  picker: {
    height: 45,
    width: '100%',
  },
  avatarSelector: {
    borderWidth: 2,
    borderColor: '#424242',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    marginTop: 5,
    color: '#666',
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#929292',
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: '#424242',
    marginRight: 10,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 15,
    color: 'white',
  },
  cancelButtonText: {
    fontWeight: '500',
    fontSize: 15,
    color: 'black',
  },
  customDatePickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
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
    maxHeight: '80%',
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
    height: 250,
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
});

export default EditarBarbero;