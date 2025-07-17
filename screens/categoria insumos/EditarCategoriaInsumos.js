import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

const EditarCategoriaInsumos = ({ visible, onClose, categoria, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState('https://i.postimg.cc/Tw9dbMG1/Mediamodifier-Design-Template.png');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setAvatar(categoria.avatar || 'https://i.postimg.cc/Tw9dbMG1/Mediamodifier-Design-Template.png');
      setErrors({});
      setImageError('');
    }
  }, [categoria]);

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        setImageError('Necesitamos acceso a tu galería para seleccionar una imagen');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setAvatar(pickerResult.assets[0].uri);
        setImageError('');
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      setImageError('Ocurrió un error al seleccionar la imagen');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (nombre.trim() === '') newErrors.nombre = 'Nombre es obligatorio';
    if (descripcion.trim() === '') newErrors.descripcion = 'Descripción es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await onUpdate({
        id: categoria.id,
        nombre,
        descripcion,
        avatar
      });
    } catch (error) {
      console.error('Error en handleUpdate:', error);
      setErrors({ submit: 'Error al actualizar la categoría' });
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
                <Text style={styles.modalTitle}>Editar categoría</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Actualiza la información de la categoría
              </Text>

              {errors.submit && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.submit}</Text>
                </View>
              )}

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Nombre*</Text>
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
                <Text style={styles.sectionTitle}>Descripción*</Text>
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

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Avatar</Text>
                <Text style={styles.avatarSubtitle}>
                  Te recomendamos usar íconos
                </Text>
                
                <TouchableOpacity 
                  style={[styles.avatarSelector, imageError && styles.inputError]} 
                  onPress={selectImage}
                  disabled={loading}
                >
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                  <View style={styles.avatarOverlay}>
                    <MaterialIcons name="edit" size={24} color="white" />
                  </View>
                </TouchableOpacity>
                {imageError && <Text style={styles.errorText}>{imageError}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.updateButton, (loading || !nombre || !descripcion) && styles.disabledButton]} 
                  onPress={handleUpdate}
                  disabled={loading || !nombre || !descripcion}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.updateButtonText}>Guardar</Text>
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
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    fontSize: 14,
  },
  avatarSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
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
  avatarSelector: {
    height: 100,
    borderWidth: 1.5,
    borderColor: '#424242',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  avatarOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  updateButton: {
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
  updateButtonText: {
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

export default EditarCategoriaInsumos;