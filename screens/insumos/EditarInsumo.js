import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Picker, 
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { BlurView } from 'expo-blur';

const EditarInsumo = ({ visible, onClose, insumo, categoriasExistentes = [], onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [errores, setErrores] = useState({});

  const unidadesMedida = [
    { label: 'Kilogramos', value: 'Kg' },
    { label: 'Gramos', value: 'Gr' },
    { label: 'Litros', value: 'Lt' },
    { label: 'Mililitros', value: 'Ml' }
  ];

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      const isPortrait = height > width;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      setIsMobile(width < 768);
    };

    updateLayout();
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  }, []);

  useEffect(() => {
    if (insumo) {
      setNombre(insumo.nombre);
      setDescripcion(insumo.descripcion);
      setCategoriaID(insumo.categoriaID);
      setUnidadMedida(insumo.unidadMedida);
      setErrores({});
    }
  }, [insumo]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!descripcion.trim()) nuevosErrores.descripcion = 'La descripción es requerida';
    if (!categoriaID) nuevosErrores.categoria = 'Debe seleccionar una categoría';
    if (!unidadMedida) nuevosErrores.unidadMedida = 'Debe seleccionar una unidad de medida';
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validarFormulario()) return;

    const insumoActualizado = {
      ...insumo,
      nombre,
      descripcion,
      categoriaID,
      unidadMedida
    };

    onUpdate(insumoActualizado);
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
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Actualizar insumo</Text>
              <Text style={styles.subtitle}>Por favor, proporciona la información para actualizar el insumo</Text>
            </View>

            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre*</Text>
                <TextInput
                  style={[styles.input, errores.nombre && styles.inputError]}
                  placeholder="Ej: Crema de afeitar"
                  placeholderTextColor="#D9D9D9"
                  value={nombre}
                  onChangeText={(text) => {
                    setNombre(text);
                    if (errores.nombre) setErrores({...errores, nombre: null});
                  }}
                />
                {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción*</Text>
                <TextInput
                  style={[
                    styles.input, 
                    styles.multilineInput, 
                    errores.descripcion && styles.inputError
                  ]}
                  placeholder="Descripción detallada del insumo"
                  placeholderTextColor="#D9D9D9"
                  value={descripcion}
                  onChangeText={(text) => {
                    setDescripcion(text);
                    if (errores.descripcion) setErrores({...errores, descripcion: null});
                  }}
                  multiline={true}
                  numberOfLines={isMobile ? 4 : 3}
                />
                {errores.descripcion && <Text style={styles.errorText}>{errores.descripcion}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cantidad disponible</Text>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityText}>{insumo?.cantidad || 0}</Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoría*</Text>
                <View style={[styles.pickerContainer, errores.categoria && styles.inputError]}>
                  <Picker
                    selectedValue={categoriaID}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setCategoriaID(itemValue);
                      if (errores.categoria) setErrores({...errores, categoria: null});
                    }}
                    dropdownIconColor="#666"
                  >
                    <Picker.Item label="Seleccione categoría" value="" />
                    {categoriasExistentes.map((cat) => (
                      <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
                    ))}
                  </Picker>
                </View>
                {errores.categoria && <Text style={styles.errorText}>{errores.categoria}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Unidad de medida*</Text>
                <View style={[styles.pickerContainer, errores.unidadMedida && styles.inputError]}>
                  <Picker
                    selectedValue={unidadMedida}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setUnidadMedida(itemValue);
                      if (errores.unidadMedida) setErrores({...errores, unidadMedida: null});
                    }}
                    dropdownIconColor="#666"
                  >
                    <Picker.Item label="Seleccione unidad" value="" />
                    {unidadesMedida.map((unidad) => (
                      <Picker.Item key={unidad.value} label={unidad.label} value={unidad.value} />
                    ))}
                  </Picker>
                </View>
                {errores.unidadMedida && <Text style={styles.errorText}>{errores.unidadMedida}</Text>}
              </View>
            </ScrollView>

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
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

// Estilos (similares a CrearInsumo.js)
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
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
    maxHeight: '85%'
  },
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
  landscapeModalContent: {
    width: '70%',
    maxHeight: '80%'
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
  scrollContainer: {
    flex: 1,
    marginBottom: 10
  },
  scrollContent: {
    paddingBottom: 10
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
  inputError: {
    borderColor: '#d32f2f'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  quantityContainer: {
    borderWidth: 1.5,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  quantityText: {
    fontSize: 15,
    color: '#333'
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

export default EditarInsumo;