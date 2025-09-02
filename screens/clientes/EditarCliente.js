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
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import Calendar from '../../components/Calendar';
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

const EditarCliente = ({ visible, onClose, cliente, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: null,
    email: '',
    avatar: null
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Actualizar el estado cuando cambia el cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        fechaNacimiento: cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento) : null,
        email: cliente.email || '',
        avatar: cliente.avatar || null
      });
      
      // Establecer mes y año del calendario según la fecha de nacimiento
      if (cliente.fechaNacimiento) {
        const fecha = new Date(cliente.fechaNacimiento);
        setCalendarMonth(fecha.getMonth());
        setCalendarYear(fecha.getFullYear());
      }
    }
  }, [cliente]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 81 }, (_, i) => currentYear - i);

const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Necesitamos acceso a tus fotos para seleccionar un avatar"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true, // Asegurar que se devuelva base64
    });

    if (!result.canceled) {
      // Usar base64 para consistencia con el backend
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData({...formData, avatar: base64Image});
      console.log("Imagen seleccionada y convertida a base64");
    }
  } catch (error) {
    console.error("Error al seleccionar imagen:", error);
    Alert.alert("Error", "No se pudo seleccionar la imagen");
  }
};

  const handleSubmit = () => {
    if (formData.nombre && formData.telefono && formData.fechaNacimiento && formData.email) {
      onUpdate({
        ...cliente,
        nombre: formData.nombre,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.email,
        avatar: formData.avatar
      });
      onClose();
    } else {
      Alert.alert('Campos requeridos', 'Por favor complete todos los campos obligatorios');
    }
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setFormData({...formData, fechaNacimiento: selectedDate});
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
    
    if (newYear <= currentYear && newYear >= (currentYear - 80)) {
      setCalendarMonth(newMonth);
      setCalendarYear(newYear);
    }
  };

  const changeYear = (year) => {
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
    if (!date) return '';
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
              <Text style={styles.title}>Editar cliente</Text>
              <Text style={styles.subtitle}>Edita los datos del cliente según sea necesario</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Carlos Gómez"
                placeholderTextColor="#929292"
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
                  placeholderTextColor="#929292"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Fecha de nacimiento <Text style={styles.required}>*</Text></Text>
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
          disabled={calendarYear === (currentYear - 80) && calendarMonth === 0}
        >
          <MaterialIcons 
            name="chevron-left" 
            size={24} 
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
      
      {/* REEMPLAZAMOS EL CALENDARIO CON NUESTRO COMPONENTE */}
      <View style={styles.calendarContainer}>
        <Calendar
          selectedDate={formData.fechaNacimiento ? formatDateString(formData.fechaNacimiento) : null}
          onDateChange={(date) => {
            const selectedDate = new Date(date);
            setFormData({...formData, fechaNacimiento: selectedDate});
            setShowDatePicker(false);
          }}
          minDate={`${currentYear - 80}-01-01`}
          maxDate={new Date().toISOString().split('T')[0]}
          markedDates={getDisabledDates()}
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
                placeholderTextColor="#929292"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
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

export default EditarCliente;