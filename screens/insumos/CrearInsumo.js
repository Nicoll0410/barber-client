import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Picker, 
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import { BlurView } from 'expo-blur';

const CrearInsumo = ({ visible, onClose, onCreate, categoriasExistentes = [] }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      const isPortrait = height > width;
      
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      
      // Consideramos móvil si el ancho es menor a 768px (tablets pequeñas y móviles)
      setIsMobile(width < 768);
    };

    // Ejecutamos al montar y añadimos listener para cambios
    updateLayout();
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  }, []);

  const unidadesMedida = [
    { label: 'Kilogramos', value: 'kilogramos' },
    { label: 'Gramos', value: 'gramos' },
    { label: 'Litros', value: 'litros' },
    { label: 'Mililitros', value: 'mililitros' }
  ];

  const handleSubmit = () => {
    if (!nombre || !descripcion || !categoria || !unidadMedida) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    onCreate({
      nombre,
      descripcion,
      categoria,
      unidadMedida
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent, 
            isMobile ? styles.mobileModalContent : styles.desktopModalContent,
            orientation === 'landscape' && isMobile && styles.landscapeModalContent
          ]}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.headerContainer}>
                <Text style={styles.modalTitle}>Crear nuevo insumo</Text>
              </View>
              <Text style={styles.subtitle}>Por favor, proporciona la información del nuevo insumo</Text>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nombre*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mascarilla"
                    placeholderTextColor="#D9D9D9"
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Descripción*</Text>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Descripción de mascarilla"
                    placeholderTextColor="#D9D9D9"
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline={true}
                    numberOfLines={isMobile ? 3 : 2}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Categoría*</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={categoria}
                      style={styles.picker}
                      onValueChange={(itemValue) => setCategoria(itemValue)}
                      dropdownIconColor="#666"
                    >
                      <Picker.Item label="Seleccione categoría" value="" />
                      {categoriasExistentes.map((cat) => (
                        <Picker.Item key={cat.id} label={cat.nombre} value={cat.nombre} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Unidad de medida*</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={unidadMedida}
                      style={styles.picker}
                      onValueChange={(itemValue) => setUnidadMedida(itemValue)}
                      dropdownIconColor="#666"
                    >
                      <Picker.Item label="Seleccione unidad" value="" />
                      {unidadesMedida.map((unidad) => (
                        <Picker.Item key={unidad.value} label={unidad.label} value={unidad.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={[
                styles.buttonContainer,
                isMobile && styles.mobileButtonContainer
              ]}>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Aceptar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  // Estilo para desktop (se mantiene igual)
  desktopModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '40%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: '80%'
  },
  // Estilo para móviles
  mobileModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: '90%'
  },
  // Estilo adicional para móviles en landscape
  landscapeModalContent: {
    width: '70%',
    maxHeight: '80%'
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left'
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: 16,
    color: '#666',
    fontSize: 14
  },
  formContainer: {
    marginBottom: 12
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
    fontSize: 14
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9'
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9'
  },
  picker: {
    height: 46,
    width: '100%',
    fontSize: 15
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  mobileButtonContainer: {
    flexDirection: 'column',
    gap: 10
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#424242',
    alignItems: 'center',
    marginRight: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#929292'
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: '500'
  }
});

export default CrearInsumo;