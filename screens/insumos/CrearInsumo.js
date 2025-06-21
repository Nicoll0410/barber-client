import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Picker } from 'react-native';
import { BlurView } from 'expo-blur';

const CrearInsumo = ({ visible, onClose, onCreate, categoriasExistentes = [] }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');

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
          <View style={styles.modalContent}>
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
                  style={styles.input}
                  placeholder="Descripción de mascarilla"
                  placeholderTextColor="#D9D9D9"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline={true}
                  numberOfLines={2}
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

            <View style={styles.buttonContainer}>
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  modalContent: {
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
    borderColor: 'black'
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
  submitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#424242',
    alignItems: 'center',
    marginRight: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
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