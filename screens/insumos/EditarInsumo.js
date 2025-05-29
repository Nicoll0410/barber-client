import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Picker, ScrollView } from 'react-native';

const EditarInsumo = ({ visible, onClose, insumo, categoriasExistentes = [], onUpdate }) => {
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

  // Inicializar estados con los valores del insumo
  useEffect(() => {
    if (insumo) {
      setNombre(insumo.nombre);
      setDescripcion(insumo.descripcion);
      setCategoria(insumo.categoria);
      setUnidadMedida(insumo.unidadMedida);
    }
  }, [insumo]);

  const handleSubmit = () => {
    if (!nombre || !descripcion || !categoria || !unidadMedida) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const insumoActualizado = {
      ...insumo,
      nombre,
      descripcion,
      categoria,
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actualizar insumo</Text>
          <Text style={styles.subtitle}>Por favor, proporciona la información para actualizar el insumo</Text>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre*</Text>
              <TextInput
                style={styles.input}
                placeholder="crema chocolate"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción*</Text>
              <TextInput
                style={styles.input}
                placeholder="crema actualizada"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cantidad disponible</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{insumo?.cantidad || 0}</Text>
              </View>
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
          </ScrollView>

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
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%', // Aumentado de 70% a 85%
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontSize: 15
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
    fontSize: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  quantityContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9'
  },
  quantityText: {
    fontSize: 16,
    color: '#333'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9'
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4a90e2',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 16
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16
  }
});

export default EditarInsumo;