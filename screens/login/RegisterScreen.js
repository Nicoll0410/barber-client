import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer'; // Asegúrate de importar el componente Footer

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
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: null,
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  
  const { register } = useContext(AuthContext);
  const navigation = useNavigation();

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Años desde el actual hasta 80 años atrás
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 81 }, (_, i) => currentYear - i);

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
        setFormData({ ...formData, avatar: result.uri });
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

const handleRegister = async () => {
    if (!formData.nombre || !formData.telefono || !formData.fechaNacimiento || 
        !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
    }

    setIsLoading(true);
    
    try {
        const response = await register(
            formData.email,
            formData.password,
            {
                nombre: formData.nombre,
                telefono: formData.telefono,
                fecha_nacimiento: formData.fechaNacimiento.toISOString().split('T')[0],
                avatar: formData.avatar
            }
        );
        
        Alert.alert(
            'Registro Exitoso',
            'Por favor verifica tu email para activar tu cuenta',
            [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]
        );
    } catch (error) {
        Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
        setIsLoading(false);
    }
};

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setFormData({ ...formData, fechaNacimiento: selectedDate });
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
    
    // Verificar que el nuevo año esté dentro del rango permitido
    if (newYear <= currentYear && newYear >= (currentYear - 80)) {
      setCalendarMonth(newMonth);
      setCalendarYear(newYear);
    }
  };

  const changeYear = (year) => {
    // Si el año seleccionado es el año actual, asegurarse de que el mes no sea futuro
    if (year === currentYear && calendarMonth > new Date().getMonth()) {
      setCalendarMonth(new Date().getMonth());
    }
    setCalendarYear(year);
  };

  const formatDate = (date) => {
    if (!date) return 'dd/mm/aaaa';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDisabledDates = () => {
    const disabledDates = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Deshabilitar fechas futuras
    const startDate = new Date(calendarYear, calendarMonth, 1);
    const endDate = new Date(calendarYear, calendarMonth + 1, 0);
    const tempDate = new Date(startDate);
    
    while (tempDate <= endDate) {
      if (tempDate > today || 
          (calendarYear === currentYear && calendarMonth > today.getMonth()) ||
          tempDate.getFullYear() < (currentYear - 80)) {
        disabledDates[`${tempDate.getFullYear()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`] = { 
          disabled: true, 
          disableTouchEvent: true 
        };
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

  // Contenido principal del formulario
  const formContent = (
    <View style={styles.formContainer}>
      {isMobile && (
        <Image 
          source={require('../../assets/images/newYorkBarber.jpeg')} 
          style={styles.mobileLogo} 
          resizeMode="contain"
        />
      )}
      
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Regístrate para comenzar</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre Completo <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor="#808080"
          value={formData.nombre}
          onChangeText={(text) => setFormData({...formData, nombre: text})}
        />
      </View>
      
      <View style={styles.doubleRow}>
        <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="3001234567"
            placeholderTextColor="#808080"
            keyboardType="phone-pad"
            value={formData.telefono}
            onChangeText={(text) => setFormData({...formData, telefono: text})}
          />
        </View>
        
        <View style={[styles.formGroup, {flex: 1}]}>
          <Text style={styles.label}>Fecha Nacimiento <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[
              styles.dateText, 
              formData.fechaNacimiento && styles.dateTextSelected
            ]}>
              {formatDate(formData.fechaNacimiento)}
            </Text>
            <MaterialIcons name="calendar-today" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <View style={styles.datePicker}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity 
                onPress={() => changeMonth(-1)}
                disabled={calendarYear === (currentYear - 80) && calendarMonth === 0}
              >
                <MaterialIcons 
                  name="chevron-left" 
                  size={22} 
                  color={
                    calendarYear === (currentYear - 80) && calendarMonth === 0
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
                  size={22} 
                  color={
                    calendarYear === currentYear && calendarMonth === new Date().getMonth()
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
                {years.map(year => (
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
                key={`${calendarYear}-${calendarMonth}`}
                current={`${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-01`}
                minDate={`${currentYear - 80}-01-01`}
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
                  setFormData({...formData, fechaNacimiento: today});
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
          style={styles.input}
          placeholder="cliente@email.com"
          placeholderTextColor="#808080"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
        />
      </View>
      
      <View style={styles.doubleRow}>
        <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>Contraseña <Text style={styles.required}>*</Text></Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#808080"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
            />
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons 
                name={showPassword ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#808080" 
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
              placeholderTextColor="#808080"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            />
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons 
                name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#808080" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Avatar (Opcional)</Text>
        <TouchableOpacity style={styles.avatarSelector} onPress={pickImage}>
          {formData.avatar ? (
            <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="add-a-photo" size={20} color="#666" />
              <Text style={styles.avatarText}>Seleccionar imagen</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {!isMobile && (
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/images/newYorkBarber.jpeg')} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
              </View>
            )}
            {formContent}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Espacio para el footer
  },
  container: {
    flex: 1,
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? 20 : 40,
    backgroundColor: '#fff',
    minHeight: isMobile ? undefined : height - 100, // Ajuste para el footer
  },
  logoContainer: {
    marginRight: isDesktop ? 80 : 40,
    width: isDesktop ? 300 : 200,
  },
  logo: {
    width: '100%',
    height: isDesktop ? 300 : 200,
  },
  mobileLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
  formContainer: {
    width: isMobile ? '100%' : 400,
    maxWidth: 400,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: isDesktop ? 28 : (isMobile ? 24 : 26),
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    color: '#808080',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 15,
  },
  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    color: '#000',
    marginBottom: 8,
    fontWeight: '700',
  },
  required: {
    color: 'red',
  },
  input: {
    height: isDesktop ? 50 : (isMobile ? 45 : 48),
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    height: isDesktop ? 50 : (isMobile ? 45 : 48),
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    color: '#808080',
  },
  dateTextSelected: {
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: isDesktop ? 50 : (isMobile ? 45 : 48),
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    paddingHorizontal: 15,
  },
  toggleButton: {
    padding: 10,
  },
  avatarSelector: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    fontSize: 14,
  },
  button: {
    height: isDesktop ? 50 : (isMobile ? 45 : 48),
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: isDesktop ? 18 : (isMobile ? 16 : 17),
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    color: '#000',
    marginRight: 5,
  },
  loginButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loginButtonText: {
    fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  datePickerContainer: {
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
  datePicker: {
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
    fontSize: 16,
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
    fontSize: 14,
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
    padding: 8,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#424242',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#424242',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RegisterScreen;