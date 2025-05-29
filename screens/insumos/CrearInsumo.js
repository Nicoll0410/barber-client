import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Picker } from 'react-native';

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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear nuevo insumo</Text>
          <Text style={styles.subtitle}>Por favor, proporciona la información del nuevo insumo</Text>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre*</Text>
              <TextInput
                style={styles.input}
                placeholder="Mascarilla"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción*</Text>
              <TextInput
                style={styles.input}
                placeholder="Descripción de mascarilla"
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
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    fontSize: 14
  },
  formContainer: {
    marginBottom: 12
  },
  formGroup: {
    marginBottom: 12
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
    fontSize: 14
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    marginTop: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  submitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4a90e2',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '500'
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500'
  }
});

export default CrearInsumo;