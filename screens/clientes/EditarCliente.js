import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal,
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import moment from 'moment';

const { width } = Dimensions.get('window');

const EditarCliente = ({ visible, onClose, cliente, onUpdate }) => {
  const [formData, setFormData] = useState({
    telefono: cliente?.telefono || '',
    email: cliente?.email || '',
    avatar: cliente?.avatar || null
  });
  
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tus fotos para seleccionar un avatar');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setFormData({...formData, avatar: result.uri});
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = () => {
    if (formData.telefono && formData.email) {
      onUpdate({
        ...cliente,
        telefono: formData.telefono,
        email: formData.email,
        avatar: formData.avatar
      });
      onClose();
    } else {
      Alert.alert('Campos requeridos', 'Por favor complete todos los campos obligatorios');
    }
  };

  const formatFechaNacimiento = (fecha) => {
    return fecha ? moment(fecha).format('DD/MM/YYYY') : 'No especificada';
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
              <Text style={styles.title}>Editar cliente</Text>
              <Text style={styles.subtitle}>Por favor, proporciona la información para actualizar el paciente</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={cliente?.nombre || ''}
                editable={false}
              />
            </View>

            {/* Fila combinada para teléfono y fecha de nacimiento */}
            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, styles.flex1, styles.rightMargin]}>
                <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="3001234567"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={formatFechaNacimiento(cliente?.fechaNacimiento)}
                  editable={false}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="cliente@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Avatar (Opcional)</Text>
              <TouchableOpacity style={styles.avatarSelector} onPress={pickImage}>
                {formData.avatar ? (
                  <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons name="add-a-photo" size={24} color="#666" />
                    <Text style={styles.avatarText}>Seleccionar imagen</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.createButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
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
  // Nuevos estilos para la fila combinada
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  rightMargin: {
    marginRight: 10,
  },
  formGroup: {
    marginBottom: 15,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  avatarSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    marginTop: 5,
    color: '#666',
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(241, 241, 241, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(221, 221, 221, 0.5)',
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    marginRight: 10,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#fff',
  },
  cancelButtonText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#333',
  },
});

export default EditarCliente;