import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const EditarCategoriaInsumos = ({ visible, onClose, categoria, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setAvatar(categoria.avatar || null);
    }
  }, [categoria]);

  const handleUpdate = () => {
    if (nombre.trim() === '' || descripcion.trim() === '') {
      return;
    }
    
    onUpdate({
      ...categoria,
      nombre,
      descripcion,
      avatar,
      fechaActualizacion: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    onClose();
  };

  const selectImage = () => {
    console.log("Seleccionar imagen");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar categoría</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Actualiza la información de la categoría
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Nombre*</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nuevo nombre"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Descripción*</Text>
            <TextInput
              style={styles.multilineInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Nueva descripción"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Avatar</Text>
            <Text style={styles.avatarSubtitle}>
              Recomendamos usar íconos
            </Text>
            
            <TouchableOpacity style={styles.avatarSelector} onPress={selectImage}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="add-photo-alternate" size={36} color="#9CA3AF" />
                  <Text style={styles.avatarPlaceholderText}>Seleccionar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.updateButton, (!nombre || !descripcion) && styles.disabledButton]} 
              onPress={handleUpdate}
              disabled={!nombre || !descripcion}
            >
              <Text style={styles.updateButtonText}>Guardar</Text>
            </TouchableOpacity>
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
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
  closeIcon: {
    padding: 4,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 16,
    fontSize: 14,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 8,
  },
  avatarSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  avatarSelector: {
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    color: '#9CA3AF',
    marginTop: 6,
    fontSize: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EditarCategoriaInsumos;