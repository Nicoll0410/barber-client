import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  FlatList,
  Alert,
  Dimensions 
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

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

const CrearCompra = ({ visible, onClose, onCreate }) => {
  // Datos de ejemplo para proveedores e insumos
  const proveedores = [
    { label: 'Distribuidora SurtiTodo', value: '1' },
    { label: 'Belleza Total SAS', value: '2' },
    { label: 'Importaciones Estética', value: '3' },
    { label: 'Suministros Peluquería', value: '4' },
  ];

  const insumosDisponibles = [
    { label: 'Tijeras profesionales', value: '1' },
    { label: 'Máquina cortapelo', value: '2' },
    { label: 'Gel fijador', value: '3' },
    { label: 'Shampoo profesional', value: '4' },
    { label: 'Acondicionador', value: '5' },
    { label: 'Crema para peinar', value: '6' },
    { label: 'Tinte profesional', value: '7' },
    { label: 'Guantes desechables', value: '8' },
    { label: 'Toallas desechables', value: '9' },
  ];

  // Estados del formulario
  const [formData, setFormData] = useState({
    metodoPago: 'efectivo',
    proveedor: '',
    fecha: null,
    insumos: []
  });

  const [pasoActual, setPasoActual] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const resetForm = () => {
    setFormData({
      metodoPago: 'efectivo',
      proveedor: '',
      fecha: null,
      insumos: []
    });
    setPasoActual(1);
    // Resetear también el calendario a la fecha actual
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    handleChange('fecha', selectedDate);
    setShowDatePicker(false);
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
    
    // Validar que el mes no esté fuera del rango permitido (8 días atrás)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 8);
    
    const nuevoMesLimite = new Date(newYear, newMonth, 1);
    
    if (nuevoMesLimite >= new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), 1) || 
        nuevoMesLimite <= new Date(currentYear, currentMonth, 1)) {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    }
  };

  const getDisabledDates = () => {
    const disabledDates = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fechaMinima = new Date(today);
    fechaMinima.setDate(today.getDate() - 8);
    
    // Calcular fechas a deshabilitar
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    const tempDate = new Date(startDate);
    
    while (tempDate <= endDate) {
      // Deshabilitar fechas fuera del rango (8 días atrás hasta hoy)
      if (tempDate > today || tempDate < fechaMinima) {
        disabledDates[formatDateString(tempDate)] = { 
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

  const agregarInsumo = () => {
    const nuevoInsumo = {
      id: Date.now().toString(),
      insumo: '',
      cantidad: '',
      precioUnitario: ''
    };
    setFormData({
      ...formData,
      insumos: [...formData.insumos, nuevoInsumo]
    });
  };

  const eliminarInsumo = (id) => {
    setFormData({
      ...formData,
      insumos: formData.insumos.filter(insumo => insumo.id !== id)
    });
  };

  const actualizarInsumo = (id, campo, valor) => {
    setFormData({
      ...formData,
      insumos: formData.insumos.map(insumo => 
        insumo.id === id ? { ...insumo, [campo]: valor } : insumo
      )
    });
  };

  const calcularTotal = () => {
    return formData.insumos.reduce((total, insumo) => {
      const cantidad = parseFloat(insumo.cantidad) || 0;
      const precio = parseFloat(insumo.precioUnitario) || 0;
      return total + (cantidad * precio);
    }, 0);
  };

  const handleSubmit = () => {
    if (pasoActual === 1) {
      if (!formData.proveedor || !formData.fecha) {
        Alert.alert('Campos requeridos', 'Por favor complete todos los campos obligatorios');
        return;
      }
      setPasoActual(2);
    } else {
      if (formData.insumos.length === 0) {
        Alert.alert('Insumos requeridos', 'Debe agregar al menos un insumo');
        return;
      }
      
      const insumosIncompletos = formData.insumos.some(insumo => 
        !insumo.insumo || !insumo.cantidad || !insumo.precioUnitario
      );
      
      if (insumosIncompletos) {
        Alert.alert('Insumos incompletos', 'Todos los insumos deben estar completamente diligenciados');
        return;
      }
      
      const compra = {
        ...formData,
        costoTotal: calcularTotal(),
        estado: 'confirmado'
      };
      
      onCreate(compra);
      onClose();
      resetForm();
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

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor || 0);
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
              <Text style={styles.title}>
                {pasoActual === 1 ? 'Crear nueva compra' : 'Añadir insumos a la compra'}
              </Text>
              <Text style={styles.subtitle}>
                {pasoActual === 1 
                  ? 'Por favor, proporciona la información de la nueva compra' 
                  : 'Por favor, adjunta los insumos que fueron adquiridos en la compra'}
              </Text>
            </View>

            {pasoActual === 1 ? (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Método de pago</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.metodoPago}
                      onValueChange={(value) => handleChange('metodoPago', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Efectivo" value="efectivo" />
                      <Picker.Item label="Transferencia" value="transferencia" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.separador} />

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Proveedor <Text style={styles.required}>*</Text></Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.proveedor}
                      onValueChange={(value) => handleChange('proveedor', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Seleccione un proveedor" value="" />
                      {proveedores.map(prov => (
                        <Picker.Item key={prov.value} label={prov.label} value={prov.value} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Fecha <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity 
                    style={styles.dateInput}
                    onPress={() => {
                      setShowDatePicker(true);
                      // Resetear a fecha actual al abrir
                      const today = new Date();
                      setSelectedMonth(today.getMonth());
                      setSelectedYear(today.getFullYear());
                    }}
                  >
                    <Text style={[
                      styles.dateText, 
                      formData.fecha && styles.dateTextSelected
                    ]}>
                      {formatDate(formData.fecha)}
                    </Text>
                    <MaterialIcons name="calendar-today" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <View style={styles.customDatePickerContainer}>
                    <View style={styles.customDatePicker}>
                      <View style={styles.datePickerHeader}>
                        <TouchableOpacity 
                          onPress={() => changeMonth(-1)}
                          disabled={
                            new Date(selectedYear, selectedMonth, 1) <= 
                            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 8)
                          }
                        >
                          <MaterialIcons 
                            name="chevron-left" 
                            size={24} 
                            color={
                              new Date(selectedYear, selectedMonth, 1) <= 
                              new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 8)
                                ? '#ccc' 
                                : '#333'
                            } 
                          />
                        </TouchableOpacity>
                        
                        <View style={styles.monthYearSelector}>
                          <Text style={styles.monthYearText}>
                            {meses[selectedMonth]} de {selectedYear}
                          </Text>
                        </View>
                        
                        <TouchableOpacity 
                          onPress={() => changeMonth(1)}
                          disabled={
                            new Date(selectedYear, selectedMonth, 1) >= 
                            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                          }
                        >
                          <MaterialIcons 
                            name="chevron-right" 
                            size={24} 
                            color={
                              new Date(selectedYear, selectedMonth, 1) >= 
                              new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                                ? '#ccc' 
                                : '#333'
                            } 
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.calendarContainer}>
                        <Calendar
                          key={`${selectedYear}-${selectedMonth}`}
                          current={`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`}
                          onDayPress={handleDayPress}
                          monthFormat={'MMMM yyyy'}
                          hideArrows={true}
                          hideExtraDays={true}
                          disableMonthChange={true}
                          markedDates={{
                            ...getDisabledDates(),
                            [formData.fecha ? formatDateString(formData.fecha) : '']: {
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
                            handleChange('fecha', new Date());
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
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.botonAgregarInsumo}
                  onPress={agregarInsumo}
                >
                  <MaterialIcons name="add" size={24} color="#424242" />
                  <Text style={styles.textoBotonAgregar}>Agregar insumo</Text>
                </TouchableOpacity>

                <FlatList
                  data={formData.insumos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.insumoContainer}>
                      <Text style={styles.subtituloInsumo}>Insumo {formData.insumos.indexOf(item) + 1}</Text>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Insumo <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={item.insumo}
                            onValueChange={(value) => actualizarInsumo(item.id, 'insumo', value)}
                            style={styles.picker}
                          >
                            <Picker.Item label="Seleccione un insumo" value="" />
                            {insumosDisponibles.map(insumo => (
                              <Picker.Item key={insumo.value} label={insumo.label} value={insumo.value} />
                            ))}
                          </Picker>
                        </View>
                      </View>

                      <View style={styles.doubleRow}>
                        <View style={[styles.formGroup, {flex: 1, marginRight: 10}]}>
                          <Text style={styles.label}>Cantidad <Text style={styles.required}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ej: 5"
                            placeholderTextColor="#929292"
                            keyboardType="numeric"
                            value={item.cantidad}
                            onChangeText={(text) => actualizarInsumo(item.id, 'cantidad', text)}
                          />
                        </View>
                        
                        <View style={[styles.formGroup, {flex: 1}]}>
                          <Text style={styles.label}>Precio unitario (COP) <Text style={styles.required}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ej: 25000"
                            placeholderTextColor="#929292"
                            keyboardType="numeric"
                            value={item.precioUnitario}
                            onChangeText={(text) => actualizarInsumo(item.id, 'precioUnitario', text)}
                          />
                        </View>
                      </View>

                      <View style={styles.doubleRow}>
                        <View style={[styles.formGroup, {flex: 1}]}>
                          <Text style={styles.label}>Subtotal</Text>
                          <Text style={styles.subtotal}>
                            {formatearMoneda(
                              (parseFloat(item.cantidad) || 0) * 
                              (parseFloat(item.precioUnitario) || 0)
                            )}
                          </Text>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.botonEliminarInsumo}
                          onPress={() => eliminarInsumo(item.id)}
                        >
                          <Feather name="trash-2" size={20} color="#424242" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                <View style={styles.totalContainer}>
                  <Text style={styles.labelTotal}>Total de la compra:</Text>
                  <Text style={styles.valorTotal}>{formatearMoneda(calcularTotal())}</Text>
                </View>
              </>
            )}

            <View style={styles.buttonContainer}>
              {pasoActual === 2 && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setPasoActual(1)}
                >
                  <Text style={styles.secondaryButtonText}>← Volver</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {pasoActual === 1 ? 'Siguiente →' : 'Enviar'}
                </Text>
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
  separador: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  botonAgregarInsumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: '#424242',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  textoBotonAgregar: {
    marginLeft: 8,
    color: '#424242',
    fontWeight: '500',
  },
  insumoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#424242',
  },
  subtituloInsumo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  botonEliminarInsumo: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#424242',
  },
  labelTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
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
  primaryButton: {
    backgroundColor: '#424242',
    marginRight: 10,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#929292',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#929292',
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 15,
    color: 'white',
  },
  secondaryButtonText: {
    fontWeight: '500',
    fontSize: 15,
    color: 'black',
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

export default CrearCompra;