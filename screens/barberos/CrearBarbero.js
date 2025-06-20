import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    rolID: '',
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
  const [loading, setLoading] = useState(false);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const yearsNacimiento = Array.from({ length: 81 }, (_, i) => currentYear - i);
  const yearsContratacion = Array.from({ length: 46 }, (_, i) => currentYear - 35 + i);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/roles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  const resetForm = () => {
    setFormData({
      rolID: '',
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
    setErrors({});
    setCalendarMonth(new Date().getMonth());
    setCalendarYear(currentYear);
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

  const validateField = (name, value) => {
    const newErrors = {...errors};
    
    switch(name) {
      case 'email':
        if (!value || value.trim() === '') {
          newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'Mínimo 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirme la contraseña';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'telefono':
        if (!value) {
          newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.telefono = 'Debe tener 10 dígitos';
        } else {
          delete newErrors.telefono;
        }
        break;
      case 'cedula':
        if (!value) {
          newErrors.cedula = 'La cédula es requerida';
        } else if (!/^\d{6,12}$/.test(value)) {
          newErrors.cedula = '6-12 dígitos numéricos';
        } else {
          delete newErrors.cedula;
        }
        break;
      case 'nombre':
        if (!value) {
          newErrors.nombre = 'El nombre es requerido';
        } else if (value.length < 3) {
          newErrors.nombre = 'Mínimo 3 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'rolID':
        if (!value) {
          newErrors.rolID = 'Seleccione un rol';
        } else {
          delete newErrors.rolID;
        }
        break;
      case 'fechaNacimiento':
        if (!value) {
          newErrors.fechaNacimiento = 'Seleccione fecha';
        } else {
          delete newErrors.fechaNacimiento;
        }
        break;
      case 'fechaContratacion':
        if (!value) {
          newErrors.fechaContratacion = 'Seleccione fecha';
        } else if (formData.fechaNacimiento && value < formData.fechaNacimiento) {
          newErrors.fechaContratacion = 'Debe ser después de nacimiento';
        } else {
          delete newErrors.fechaContratacion;
        }
        break;
      default:
        if (!value) {
          newErrors[name] = 'Este campo es requerido';
        } else {
          delete newErrors[name];
        }
    }
    
    setErrors(newErrors);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
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
    if (pickerType === 'nacimiento') {
      if (year <= currentYear && year >= (currentYear - 80)) {
        if (year === currentYear && calendarMonth > new Date().getMonth()) {
          setCalendarMonth(new Date().getMonth());
        }
        setCalendarYear(year);
      }
    } else {
      if (year >= (currentYear - 35) && year <= (currentYear + 10)) {
        if (year === currentYear && calendarMonth < new Date().getMonth()) {
          setCalendarMonth(new Date().getMonth());
        }
        setCalendarYear(year);
      }
    }
  };

  const validateForm = () => {
    validateField('rolID', formData.rolID);
    validateField('cedula', formData.cedula);
    validateField('nombre', formData.nombre);
    validateField('telefono', formData.telefono);
    validateField('email', formData.email);
    validateField('fechaNacimiento', formData.fechaNacimiento);
    validateField('fechaContratacion', formData.fechaContratacion);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!validateForm()) {
        Alert.alert('Error', 'Por favor complete todos los campos correctamente');
        return;
      }

      const dataToSend = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        cedula: formData.cedula,
        email: formData.email.trim(),
        fecha_nacimiento: formData.fechaNacimiento.toISOString().split('T')[0],
        fecha_de_contratacion: formData.fechaContratacion.toISOString().split('T')[0],
        password: formData.password,
        rolID: formData.rolID
      };

      console.log('Datos enviados al servidor:', dataToSend);

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/barberos', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      Alert.alert('Éxito', 'Barbero creado correctamente');
      onCreate(response.data.barbero);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error al crear barbero:', error);
      console.error('Respuesta del error:', error.response?.data);
      
      let errorMessage = 'Error al crear barbero';
      
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
        
        if (error.response.data.campo) {
          setErrors(prev => ({
            ...prev,
            [error.response.data.campo]: error.response.data.mensaje
          }));
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos enviados al servidor';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
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
    const today = new Date();
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setShowDatePicker(true);
  };

  const getDisabledDates = () => {
    const disabledDates = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(calendarYear, calendarMonth, 1);
    const endDate = new Date(calendarYear, calendarMonth + 1, 0);
    const tempDate = new Date(startDate);
    
    while (tempDate <= endDate) {
      if (pickerType === 'nacimiento') {
        if (tempDate > today || tempDate.getFullYear() < (currentYear - 80)) {
          disabledDates[formatDateString(tempDate)] = { 
            disabled: true, 
            disableTouchEvent: true 
          };
        }
      } else {
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
              <View style={[styles.pickerContainer, errors.rolID && styles.inputError]}>
                <Picker
                  selectedValue={formData.rolID}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange('rolID', itemValue)}
                >
                  <Picker.Item label="Seleccione un rol..." value="" />
                  {roles.map((rol) => (
                    <Picker.Item key={rol.id} label={rol.nombre} value={rol.id} />
                  ))}
                </Picker>
              </View>
              {errors.rolID && <Text style={styles.errorText}>{errors.rolID}</Text>}
            </View>
            
            {/* Cédula y Nombre */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Cédula <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.cedula && styles.inputError]}
                  placeholder="Ej: 123456789"
                  placeholderTextColor="#929292"
                  keyboardType="numeric"
                  value={formData.cedula}
                  onChangeText={(text) => handleChange('cedula', text)}
                  onBlur={() => validateField('cedula', formData.cedula)}
                />
                {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.nombre && styles.inputError]}
                  placeholder="Ej: Carlos Gómez"
                  placeholderTextColor="#929292"
                  value={formData.nombre}
                  onChangeText={(text) => handleChange('nombre', text)}
                  onBlur={() => validateField('nombre', formData.nombre)}
                />
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
              </View>
            </View>
            
            {/* Teléfono y Email */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.telefono && styles.inputError]}
                  placeholder="3001234567"
                  placeholderTextColor="#929292"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.telefono}
                  onChangeText={(text) => handleChange('telefono', text)}
                  onBlur={() => validateField('telefono', formData.telefono)}
                />
                {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="barbero@email.com"
                  placeholderTextColor="#929292"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text.trim())}
                  onBlur={() => validateField('email', formData.email)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
            </View>
            
            {/* Fecha de Nacimiento y Fecha de Contratación */}
            <View style={styles.doubleRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Fecha Nacimiento <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={[styles.dateInput, errors.fechaNacimiento && styles.inputError]}
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
                {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
              </View>
              
              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Fecha Contratación <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={[styles.dateInput, errors.fechaContratacion && styles.inputError]}
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
                {errors.fechaContratacion && <Text style={styles.errorText}>{errors.fechaContratacion}</Text>}
              </View>
            </View>
            
            {/* Contraseña y Confirmar Contraseña */}
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
                    onBlur={() => validateField('password', formData.password)}
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
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
                    onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
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
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
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
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.createButton, (Object.keys(errors).length > 0 && styles.disabledButton)]}
                onPress={handleSubmit}
                disabled={loading || Object.keys(errors).length > 0}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creando...' : 'Aceptar'}
                </Text>
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
  inputError: {
    borderColor: 'red',
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
  disabledButton: {
    opacity: 0.6,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
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