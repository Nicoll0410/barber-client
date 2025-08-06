import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const CrearCategoriaInsumos = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (nombre.trim() === '') newErrors.nombre = 'Nombre es obligatorio';
    if (descripcion.trim() === '') newErrors.descripcion = 'Descripción es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await onCreate({
        nombre,
        descripcion
      });
      setNombre('');
      setDescripcion('');
      setErrors({});
    } catch (error) {
      console.error('Error en handleCreate:', error);
      setErrors({ submit: 'Error al crear la categoría' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Crear nueva categoría</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Proporciona la información de la nueva categoría
              </Text>

              {errors.submit && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.submit}</Text>
                </View>
              )}

              <View style={styles.formSection}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Nombre</Text>
                  <Text style={styles.requiredAsterisk}>*</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.nombre && styles.inputError]}
                  value={nombre}
                  onChangeText={(text) => {
                    setNombre(text);
                    if (errors.nombre) setErrors({...errors, nombre: ''});
                  }}
                  placeholder="Nombre de la categoría"
                  placeholderTextColor="#D9D9D9"
                />
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
              </View>

              <View style={styles.formSection}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Descripción</Text>
                  <Text style={styles.requiredAsterisk}>*</Text>
                </View>
                <TextInput
                  style={[styles.multilineInput, errors.descripcion && styles.inputError]}
                  value={descripcion}
                  onChangeText={(text) => {
                    setDescripcion(text);
                    if (errors.descripcion) setErrors({...errors, descripcion: ''});
                  }}
                  placeholder="Descripción de la categoría"
                  placeholderTextColor="#D9D9D9"
                  multiline
                  numberOfLines={3}
                />
                {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.createButton, (loading || !nombre || !descripcion) && styles.disabledButton]} 
                  onPress={handleCreate}
                  disabled={loading || !nombre || !descripcion}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.createButtonText}>Aceptar</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose}
                  disabled={loading}
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
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '100%',
    borderWidth: 1,
    borderColor: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 20,
    fontSize: 14,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 14,
  },
  requiredAsterisk: {
    color: '#EF4444',
    marginLeft: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#424242',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  multilineInput: {
    borderWidth: 1.5,
    borderColor: '#424242',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  createButton: {
    backgroundColor: '#424242',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#929292',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CrearCategoriaInsumos;