import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const CrearCategoriaInsumos = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleCreate = () => {
    if (nombre.trim() === '' || descripcion.trim() === '') {
      return;
    }
    
    onCreate({
      nombre,
      descripcion,
      avatar
    });
    setNombre('');
    setDescripcion('');
    setAvatar(null);
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear nueva categoría</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Proporciona la información de la nueva categoría
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Nombre*</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre de la categoría"
                placeholderTextColor="#D9D9D9"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Descripción*</Text>
              <TextInput
                style={styles.multilineInput}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Descripción de la categoría"
                placeholderTextColor="#D9D9D9"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Avatar</Text>
              <Text style={styles.avatarSubtitle}>
                Te recomendamos usar íconos
              </Text>
              
              <TouchableOpacity style={styles.avatarSelector} onPress={selectImage}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons name="add-photo-alternate" size={40} color="#9CA3AF" />
                    <Text style={styles.avatarPlaceholderText}>Selecciona una imagen</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.createButton} 
                onPress={handleCreate}
                disabled={!nombre || !descripcion}
              >
                <Text style={styles.createButtonText}>Aceptar</Text>
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
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    width: '85%',
    maxWidth: 400,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
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
    borderWidth: 1.5,  // Aumentado el grosor del borde
    borderColor: '#424242',  // Cambiado a color más oscuro
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  multilineInput: {
    borderWidth: 1.5,  // Aumentado el grosor del borde
    borderColor: '#424242',  // Cambiado a color más oscuro
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 8,
  },
  avatarSelector: {
    height: 100,
    borderWidth: 1.5,  // Aumentado el grosor del borde
    borderColor: '#424242',  // Cambiado a color más oscuro
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
});

export default CrearCategoriaInsumos;