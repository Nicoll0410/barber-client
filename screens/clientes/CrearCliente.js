import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Keyboard,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


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


const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';


const CrearCliente = ({ visible, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: null,
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
 
  const [errors, setErrors] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  // Años desde el actual hasta 120 años atrás
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i);


  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      fechaNacimiento: null,
      email: '',
      password: '',
      confirmPassword: '',
      avatar: null
    });
    setErrors({
      nombre: '',
      telefono: '',
      fechaNacimiento: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setCalendarMonth(new Date().getMonth());
    setCalendarYear(currentYear);
  };


  const validateField = (name, value) => {
    let error = '';
   
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es requerido';
        } else if (value.length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          error = 'El teléfono es requerido';
        } else if (!/^\d{7,15}$/.test(value)) {
          error = 'Teléfono inválido (solo números, 7-15 dígitos)';
        }
        break;
      case 'fechaNacimiento':
        if (!value) {
          error = 'La fecha de nacimiento es requerida';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
         
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
         
          if (age > 120) {
            error = 'Edad inválida';
          }
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'La contraseña es requerida';
        } else if (value.length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Debe contener al menos una mayúscula';
        } else if (!/[0-9]/.test(value)) {
          error = 'Debe contener al menos un número';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = 'Confirma tu contraseña';
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
      default:
        break;
    }
   
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };


  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
   
    // Validación en tiempo real solo si ya hubo un error
    if (errors[name]) {
      validateField(name, value);
    }
  };


  const handleBlur = (name) => {
    validateField(name, formData[name]);
  };


  const handleDayPress = (day) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    handleChange('fechaNacimiento', selectedDate);
    validateField('fechaNacimiento', selectedDate);
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
   
    if (newYear <= currentYear && newYear >= (currentYear - 120)) {
      setCalendarMonth(newMonth);
      setCalendarYear(newYear);
    }
  };


  const changeYear = (increment) => {
    const newYear = calendarYear + increment;
    if (newYear <= currentYear && newYear >= (currentYear - 120)) {
      if (newYear === currentYear && calendarMonth > new Date().getMonth()) {
        setCalendarMonth(new Date().getMonth());
      }
      setCalendarYear(newYear);
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
      quality: 0.7,
      base64: true // Asegúrate de incluir esta línea
    });


    if (!result.cancelled) {
      // Crear URI base64 completa
      const base64Image = `data:image/jpeg;base64,${result.base64}`;
      setAvatar(base64Image);
      console.log('Imagen seleccionada (tamaño):', result.base64.length);
    }
  } catch (error) {
    console.error('Error al seleccionar imagen:', error);
    Alert.alert('Error', 'No se pudo seleccionar la imagen');
  }
};


  const validateForm = () => {
    let isValid = true;
    const fieldsToValidate = ['nombre', 'telefono', 'fechaNacimiento', 'email', 'password', 'confirmPassword'];
   
    fieldsToValidate.forEach(field => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });
   
    return isValid;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;


    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        fecha_nacimiento: formatDateString(formData.fechaNacimiento),
        avatarBase64: formData.avatar,
        email: formData.email,
        password: formData.password
      };


      console.log('Enviando datos:', {
        ...payload,
        avatarBase64: payload.avatarBase64 ? '[...imagen base64...]' : null
      });


      const response = await axios.post(`${BASE_URL}/clientes`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });


      // Llamar a la función onCreate pasada como prop
      if (onCreate) {
        onCreate({
          ...response.data.cliente,
          avatar: formData.avatar,
          estaVerificado: false,
          email: formData.email
        });
      }


      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      Alert.alert(
        'Error',
        error.response?.data?.mensaje || 'No se pudo crear el cliente'
      );
    } finally {
      setLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSubmit();
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


  const formatDateString = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const getDisabledDates = () => {
    const disabledDates = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
   
    const startDate = new Date(calendarYear, calendarMonth, 1);
    const endDate = new Date(calendarYear, calendarMonth + 1, 0);
    const tempDate = new Date(startDate);
   
    while (tempDate <= endDate) {
      if (tempDate > today ||
          (calendarYear === currentYear && calendarMonth > today.getMonth())) {
        disabledDates[`${tempDate.getFullYear()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`] = {
          disabled: true,
          disableTouchEvent: true
        };
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
   
    return disabledDates;
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
              <Text style={styles.title}>Crear nuevo cliente</Text>
              <Text style={styles.subtitle}>Por favor, proporciona las credenciales del nuevo cliente</Text>
            </View>
           
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                placeholder="Ej: Carlos Gómez"
                placeholderTextColor="#929292"
                value={formData.nombre}
                onChangeText={(text) => handleChange('nombre', text)}
                onBlur={() => handleBlur('nombre')}
                onSubmitEditing={handleKeyPress}
                returnKeyType="next"
              />
              {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}
            </View>
           
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.telefono && styles.inputError]}
                  placeholder="3001234567"
                  placeholderTextColor="#929292"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(text) => handleChange('telefono', text)}
                  onBlur={() => handleBlur('telefono')}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="next"
                />
                {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
              </View>
             
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Fecha Nacimiento<Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                  style={[styles.dateInput, errors.fechaNacimiento && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[
                    styles.dateText,
                    formData.fechaNacimiento && styles.dateTextSelected
                  ]}>
                    {formatDate(formData.fechaNacimiento)}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
                {errors.fechaNacimiento ? <Text style={styles.errorText}>{errors.fechaNacimiento}</Text> : null}
              </View>
            </View>
           
            {showDatePicker && (
              <View style={styles.customDatePickerContainer}>
                <View style={styles.customDatePicker}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      onPress={() => changeMonth(-1)}
                      disabled={calendarYear === (currentYear - 120) && calendarMonth === 0}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={24}
                        color={
                          calendarYear === (currentYear - 120) && calendarMonth === 0
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
                      disabled={calendarYear === currentYear && calendarMonth === new Date().getMonth()}
                    >
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={
                          calendarYear === currentYear && calendarMonth === new Date().getMonth()
                            ? '#ccc'
                            : '#333'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                 
                  <View style={styles.yearSelectorContainer}>
                    <TouchableOpacity
                      onPress={() => changeYear(-10)}
                      disabled={calendarYear - 10 < (currentYear - 120)}
                      style={styles.yearArrowButton}
                    >
                      <MaterialIcons
                        name="keyboard-double-arrow-left"
                        size={20}
                        color={
                          calendarYear - 10 < (currentYear - 120)
                            ? '#ccc'
                            : '#333'
                        }
                      />
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                      onPress={() => changeYear(-1)}
                      disabled={calendarYear - 1 < (currentYear - 120)}
                      style={styles.yearArrowButton}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={20}
                        color={
                          calendarYear - 1 < (currentYear - 120)
                            ? '#ccc'
                            : '#333'
                        }
                      />
                    </TouchableOpacity>
                   
                    <View style={styles.yearDisplay}>
                      <Text style={styles.yearText}>{calendarYear}</Text>
                    </View>
                   
                    <TouchableOpacity
                      onPress={() => changeYear(1)}
                      disabled={calendarYear + 1 > currentYear}
                      style={styles.yearArrowButton}
                    >
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color={
                          calendarYear + 1 > currentYear
                            ? '#ccc'
                            : '#333'
                        }
                      />
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                      onPress={() => changeYear(10)}
                      disabled={calendarYear + 10 > currentYear}
                      style={styles.yearArrowButton}
                    >
                      <MaterialIcons
                        name="keyboard-double-arrow-right"
                        size={20}
                        color={
                          calendarYear + 10 > currentYear
                            ? '#ccc'
                            : '#333'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                 
                  <View style={styles.calendarContainer}>
                    <Calendar
                      key={`${calendarYear}-${calendarMonth}`}
                      current={`${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-01`}
                      minDate={`${currentYear - 120}-01-01`}
                      maxDate={new Date().toISOString().split('T')[0]}
                      onDayPress={handleDayPress}
                      monthFormat={'MMMM yyyy'}
                      hideArrows={true}
                      hideExtraDays={true}
                      disableMonthChange={true}
                      markedDates={{
                        ...getDisabledDates(),
                        [formData.fechaNacimiento ? formatDateString(formData.fechaNacimiento) : '']: {
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
                        handleChange('fechaNacimiento', today);
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
           
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="cliente@email.com"
                placeholderTextColor="#929292"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                onBlur={() => handleBlur('email')}
                onSubmitEditing={handleKeyPress}
                returnKeyType="next"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
           
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Contraseña <Text style={styles.required}>*</Text></Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor="#929292"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    onBlur={() => handleBlur('password')}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="next"
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
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>
             
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Confirmar <Text style={styles.required}>*</Text></Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor="#929292"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    onBlur={() => handleBlur('confirmPassword')}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
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
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
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
           
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Aceptar</Text>
                )}
              </TouchableOpacity>
             
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  onClose();
                  resetForm();
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>


      {/* Modal de éxito */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successModalIcon}>
              <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
            </View>
            <Text style={styles.successModalTitle}>¡Cliente creado exitosamente!</Text>
            <Text style={styles.successModalText}>
              El cliente debe verificar su cuenta antes de poder iniciar sesión.
            </Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={() => {
                setShowSuccess(false);
                onClose();
              }}
            >
              <Text style={styles.successModalButtonText}>Entendido</Text>
            </TouchableOpacity>
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  yearArrowButton: {
    padding: 8,
  },
  yearDisplay: {
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
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
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  successModalIcon: {
    marginBottom: 20,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#424242',
    textAlign: 'center',
  },
  successModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  successModalButton: {
    backgroundColor: '#424242',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default CrearCliente;
