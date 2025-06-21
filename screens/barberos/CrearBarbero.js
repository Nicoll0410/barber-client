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

const CrearBarbero = ({ visible, onClose, onCreate }) => {
  // Roles de ejemplo
  const [roles, setRoles] = useState([
    { id: 1, nombre: 'Barbero Master' },
    { id: 2, nombre: 'Barbero Senior' },
    { id: 3, nombre: 'Barbero Junior' },
    { id: 4, nombre: 'Aprendiz' }
  ]);

  const [formData, setFormData] = useState({
    rol: '',
    cedula: '',
    nombre: '',
    telefono: '',
    email: '',
    fechaNacimiento: null,
    fechaContratacion: null,
    password: '',
    confirmPassword: '',
    avatar: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerType, setPickerType] = useState('nacimiento');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  // Años para fecha de nacimiento (80 años atrás)
  const yearsNacimiento = Array.from({ length: 81 }, (_, i) => currentYear - i);
  // Años para fecha de contratación (35 años atrás y 10 años adelante)
  const yearsContratacion = Array.from({ length: 46 }, (_, i) => currentYear - 35 + i);

  const resetForm = () => {
    setFormData({
      rol: '',
      cedula: '',
      nombre: '',
      telefono: '',
      email: '',
      fechaNacimiento: null,
      fechaContratacion: null,
      password: '',
      confirmPassword: '',
      avatar: null
    });
    // Resetear también el calendario a la fecha actual
    setCalendarMonth(new Date().getMonth());
    setCalendarYear(currentYear);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    if (pickerType === 'nacimiento') {
      handleChange('fechaNacimiento', selectedDate);
    } else {
      handleChange('fechaContratacion', selectedDate);
    }
    setShowDatePicker(false);
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
    
    // Validar según el tipo de calendario
    if (pickerType === 'nacimiento') {
      if (newYear <= currentYear && newYear >= (currentYear - 80)) {
        setCalendarMonth(newMonth);
        setCalendarYear(newYear);
      }
    } else {
      if (newYear >= (currentYear - 35) && newYear <= (currentYear + 10)) {
        setCalendarMonth(newMonth);
        setCalendarYear(newYear);
      }
    }
  };

  const changeYear = (year) => {
    // Validar según el tipo de calendario
    if (pickerType === 'nacimiento') {
      if (year <= currentYear && year >= (currentYear - 80)) {
        // Si el año seleccionado es el año actual, asegurarse de que el mes no sea futuro
        if (year === currentYear && calendarMonth > new Date().getMonth()) {
          setCalendarMonth(new Date().getMonth());
        }
        setCalendarYear(year);
      }
    } else {
      if (year >= (currentYear - 35) && year <= (currentYear + 10)) {
        // Si el año seleccionado es el año actual, asegurarse de que el mes no sea pasado
        if (year === currentYear && calendarMonth < new Date().getMonth()) {
          setCalendarMonth(new Date().getMonth());
        }
        setCalendarYear(year);
      }
    }
  };

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
        handleChange('avatar', result.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = () => {
    if (formData.rol && formData.cedula && formData.nombre && formData.telefono && 
        formData.email && formData.fechaNacimiento && formData.fechaContratacion && 
        formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
      onCreate(formData);
      onClose();
      resetForm();
    } else {
      Alert.alert('Campos requeridos', 'Por favor complete todos los campos obligatorios');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'dd/mm/aaaa';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const openDatePicker = (type) => {
    setPickerType(type);
    // Resetear a fecha actual al abrir
    const today = new Date();
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setShowDatePicker(true);
  };

  const getDisabledDates = () => {
    const disabledDates = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calcular fechas a deshabilitar según el tipo
    const startDate = new Date(calendarYear, calendarMonth, 1);
    const endDate = new Date(calendarYear, calendarMonth + 1, 0);
    const tempDate = new Date(startDate);
    
    while (tempDate <= endDate) {
      if (pickerType === 'nacimiento') {
        // Deshabilitar fechas futuras y anteriores a 80 años
        if (tempDate > today || tempDate.getFullYear() < (currentYear - 80)) {
          disabledDates[formatDateString(tempDate)] = { 
            disabled: true, 
            disableTouchEvent: true 
          };
        }
      } else {
        // Deshabilitar fechas anteriores a 35 años y futuras a 10 años
        if (tempDate.getFullYear() < (currentYear - 35) || 
            tempDate.getFullYear() > (currentYear + 10) ||
            (tempDate.getFullYear() === currentYear && tempDate > today)) {
          disabledDates[formatDateString(tempDate)] = { 
            disabled: true, 
            disableTouchEvent: true 
          };
        }
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return disabledDates;
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
        resetForm();
      }}
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
              <Text style={styles.title}>Crear nuevo barbero</Text>
              <Text style={styles.subtitle}>Por favor, proporciona las credenciales del nuevo barbero</Text>
            </View>
            
            {/* Rol del barbero */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rol del barbero <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.rol}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange('rol', itemValue)}
                >
                  <Picker.Item label="Seleccione un rol..." value="" />
                  {roles.map((rol) => (
                    <Picker.Item key={rol.id} label={rol.nombre} value={rol.nombre} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* Cédula y Nombre */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Cédula <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 123456789"
                  placeholderTextColor="#929292"
                  keyboardType="numeric"
                  value={formData.cedula}
                  onChangeText={(text) => handleChange('cedula', text)}
                />
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Carlos Gómez"
                  placeholderTextColor="#929292"
                  value={formData.nombre}
                  onChangeText={(text) => handleChange('nombre', text)}
                />
              </View>
            </View>
            
            {/* Teléfono y Email */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="3001234567"
                  placeholderTextColor="#929292"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(text) => handleChange('telefono', text)}
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
                  onChangeText={(text) => handleChange('email', text)}
                />
              </View>
            </View>
            
            {/* Fecha de Nacimiento y Fecha de Contratación */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Fecha Nacimiento <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => openDatePicker('nacimiento')}
                >
                  <Text style={[
                    styles.dateText, 
                    formData.fechaNacimiento && styles.dateTextSelected
                  ]}>
                    {formatDate(formData.fechaNacimiento)}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Fecha Contratación <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => openDatePicker('contratacion')}
                >
                  <Text style={[
                    styles.dateText, 
                    formData.fechaContratacion && styles.dateTextSelected
                  ]}>
                    {formatDate(formData.fechaContratacion)}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            {showDatePicker && (
              <View style={styles.customDatePickerContainer}>
                <View style={styles.customDatePicker}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity 
                      onPress={() => changeMonth(-1)}
                      disabled={
                        pickerType === 'nacimiento' 
                          ? calendarYear === (currentYear - 80) && calendarMonth === 0
                          : calendarYear === (currentYear - 35) && calendarMonth === 0
                      }
                    >
                      <MaterialIcons 
                        name="chevron-left" 
                        size={24} 
                        color={
                          (pickerType === 'nacimiento' 
                            ? calendarYear === (currentYear - 80) && calendarMonth === 0
                            : calendarYear === (currentYear - 35) && calendarMonth === 0)
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
                    
                    <TouchableOpacity 
                      onPress={() => changeMonth(1)}
                      disabled={
                        pickerType === 'nacimiento' 
                          ? calendarYear === currentYear && calendarMonth === new Date().getMonth()
                          : calendarYear === (currentYear + 10) && calendarMonth === 11
                      }
                    >
                      <MaterialIcons 
                        name="chevron-right" 
                        size={24} 
                        color={
                          (pickerType === 'nacimiento' 
                            ? calendarYear === currentYear && calendarMonth === new Date().getMonth()
                            : calendarYear === (currentYear + 10) && calendarMonth === 11)
                            ? '#ccc' 
                            : '#333'
                        } 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.yearSelectorContainer}>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.yearScrollContent}
                    >
                      {(pickerType === 'nacimiento' ? yearsNacimiento : yearsContratacion).map(year => (
                        <TouchableOpacity 
                          key={year}
                          style={[
                            styles.yearButton,
                            calendarYear === year && styles.selectedYearButton
                          ]}
                          onPress={() => changeYear(year)}
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
                      key={`${calendarYear}-${calendarMonth}-${pickerType}`}
                      current={`${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-01`}
                      minDate={
                        pickerType === 'nacimiento' 
                          ? `${currentYear - 80}-01-01` 
                          : `${currentYear - 35}-01-01`
                      }
                      maxDate={
                        pickerType === 'nacimiento' 
                          ? new Date().toISOString().split('T')[0]
                          : `${currentYear + 10}-12-31`
                      }
                      onDayPress={handleDayPress}
                      monthFormat={'MMMM yyyy'}
                      hideArrows={true}
                      hideExtraDays={true}
                      disableMonthChange={true}
                      markedDates={{
                        ...getDisabledDates(),
                        [pickerType === 'nacimiento' 
                          ? (formData.fechaNacimiento ? formatDateString(formData.fechaNacimiento) : '')
                          : (formData.fechaContratacion ? formatDateString(formData.fechaContratacion) : '')]: {
                          selected: true,
                          selectedColor: '#424242',
                          selectedTextColor: '#fff'
                        },
                        [new Date().toISOString().split('T')[0]]: {
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
                        const today = new Date();
                        if (pickerType === 'nacimiento') {
                          handleChange('fechaNacimiento', today);
                        } else {
                          handleChange('fechaContratacion', today);
                        }
                        setCalendarMonth(today.getMonth());
                        setCalendarYear(today.getFullYear());
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={styles.datePickerButtonText}>Hoy</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            
            {/* Contraseña y Confirmar Contraseña */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Contraseña <Text style={styles.required}>*</Text></Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#929292"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? 'visibility-off' : 'visibility'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Confirmar <Text style={styles.required}>*</Text></Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#929292"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                  />
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialIcons 
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Avatar */}
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
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.createButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  onClose();
                  resetForm();
                }}
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
  dateInput: {
    borderWidth: 2,
    borderColor: '#424242',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#999',
  },
  dateTextSelected: {
    color: '#333',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 2,
    borderColor: '#424242',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    height: 45,
    paddingRight: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 12,
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
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#424242',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CrearBarbero;