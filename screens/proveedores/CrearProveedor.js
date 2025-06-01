import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const CrearProveedor = ({ visible, onClose, onCreate }) => {
  const [tipoProveedor, setTipoProveedor] = useState('Persona natural');
  const [tipoDocumento, setTipoDocumento] = useState('Cédula de ciudadanía');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nit, setNit] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [personaContacto, setPersonaContacto] = useState('');

  const handleCreate = () => {
    const newProveedor = {
      tipo: tipoProveedor,
      ...(tipoProveedor === 'Persona natural' ? {
        tipoDocumento,
        identificacion: numeroDocumento,
        nombre,
        email,
        telefono
      } : {
        identificacion: nit,
        nombre: nombreEmpresa,
        personaContacto,
        email,
        telefono
      })
    };
    onCreate(newProveedor);
    resetForm();
  };

  const resetForm = () => {
    setTipoProveedor('Persona natural');
    setTipoDocumento('Cédula de ciudadanía');
    setNumeroDocumento('');
    setNombre('');
    setEmail('');
    setTelefono('');
    setNit('');
    setNombreEmpresa('');
    setPersonaContacto('');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear nuevo proveedor</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={18} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Proporciona la información del proveedor</Text>

            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tipo de proveedor</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={[
                      styles.radioButton, 
                      tipoProveedor === 'Persona natural' && styles.radioButtonSelected
                    ]}
                    onPress={() => setTipoProveedor('Persona natural')}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      tipoProveedor === 'Persona natural' && styles.radioButtonTextSelected
                    ]}>
                      Persona
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.radioButton, 
                      tipoProveedor === 'Empresa' && styles.radioButtonSelected
                    ]}
                    onPress={() => setTipoProveedor('Empresa')}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      tipoProveedor === 'Empresa' && styles.radioButtonTextSelected
                    ]}>
                      Empresa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {tipoProveedor === 'Persona natural' ? (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Tipo de documento*</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={tipoDocumento}
                        onValueChange={(itemValue) => setTipoDocumento(itemValue)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Cédula de ciudadanía" value="Cédula de ciudadanía" />
                        <Picker.Item label="Cédula de extranjería" value="Cédula de extranjería" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Número de documento*</Text>
                    <TextInput
                      style={styles.input}
                      value={numeroDocumento}
                      onChangeText={setNumeroDocumento}
                      keyboardType="numeric"
                      placeholder="Ej: 123456789"
                      placeholderTextColor="#929292"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre*</Text>
                    <TextInput
                      style={styles.input}
                      value={nombre}
                      onChangeText={setNombre}
                      placeholder="Nombre completo"
                      placeholderTextColor="#929292"
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>NIT*</Text>
                    <TextInput
                      style={styles.input}
                      value={nit}
                      onChangeText={setNit}
                      keyboardType="numeric"
                      placeholder="Número de NIT"
                      placeholderTextColor="#929292"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre de la empresa*</Text>
                    <TextInput
                      style={styles.input}
                      value={nombreEmpresa}
                      onChangeText={setNombreEmpresa}
                      placeholder="Razón social"
                      placeholderTextColor="#929292"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Persona de contacto*</Text>
                    <TextInput
                      style={styles.input}
                      value={personaContacto}
                      onChangeText={setPersonaContacto}
                      placeholder="Nombre del contacto"
                      placeholderTextColor="#929292"
                    />
                  </View>
                </>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email*</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="Ej: nombre@dominio.com"
                  placeholderTextColor="#929292"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono*</Text>
                <TextInput
                  style={styles.input}
                  value={telefono}
                  onChangeText={setTelefono}
                  keyboardType="phone-pad"
                  placeholder="Ej: 1234567890"
                  placeholderTextColor="#929292"
                />
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleCreate}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
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
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    width: '50%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'black',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  radioButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#929292',
    borderRadius: 6,
    marginRight: 6,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioButtonSelected: {
    borderColor: '#424242',
    backgroundColor: '#424242',
  },
  radioButtonText: {
    fontSize: 12,
    color: 'black',
  },
  radioButtonTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#929292',
    alignItems: 'center',
    minWidth: 80,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 13,
    color: 'black',
    fontWeight: '500',
  },
  acceptButton: {
    padding: 8,
    backgroundColor: '#424242',
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  acceptButtonText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
});

export default CrearProveedor;