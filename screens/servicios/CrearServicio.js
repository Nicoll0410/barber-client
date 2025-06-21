import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const CrearServicio = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [paso, setPaso] = useState(1);
  const [insumos, setInsumos] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState('');
  const [cantidad, setCantidad] = useState('0');

  // Obtener dimensiones de la pantalla
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768; // Consideramos móvil si el ancho es menor a 768px

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setDuracion('');
    setPrecio('');
    setInsumos([]);
    setPaso(1);
  };

  const handleCreate = () => {
    onCreate({
      nombre,
      descripcion,
      duracion,
      precio: `$ ${precio}`,
      insumos
    });
    resetForm();
  };

  const agregarInsumo = () => {
    if (nuevoInsumo && cantidad) {
      setInsumos([...insumos, { nombre: nuevoInsumo, cantidad }]);
      setNuevoInsumo('');
      setCantidad('0');
    }
  };

  const eliminarInsumo = (index) => {
    const nuevosInsumos = [...insumos];
    nuevosInsumos.splice(index, 1);
    setInsumos(nuevosInsumos);
  };

  // Estilos condicionales basados en el tamaño de pantalla
  const styles = StyleSheet.create({
    blurContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? 10 : 0,
    },
    modalView: {
      width: isMobile ? '100%' : '40%',
      maxHeight: isMobile ? '90%' : '85%',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: 'black',
    },
    scrollContainer: {
      flexGrow: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: '600',
      color: '#333',
    },
    subtitle: {
      color: '#666',
      marginBottom: 16,
      fontSize: isMobile ? 12 : 13,
    },
    formGroup: {
      marginBottom: 12,
    },
    formRow: {
      flexDirection: isMobile ? 'column' : 'row',
      marginBottom: 12,
    },
    label: {
      marginBottom: 4,
      fontSize: isMobile ? 12 : 13,
    },
    labelText: {
      fontWeight: '500',
      color: 'black',
    },
    required: {
      color: 'red',
    },
    input: {
      borderWidth: 1.5,
      borderColor: '#424242',
      borderRadius: 6,
      padding: isMobile ? 8 : 10,
      fontSize: isMobile ? 13 : 14,
      marginBottom: 8,
      backgroundColor: '#fafafa',
    },
    textArea: {
      height: 70,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      alignItems: 'center',
      marginTop: 12,
    },
    nextButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#424242',
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: isMobile ? '100%' : '60%',
    },
    disabledButton: {
      backgroundColor: '#D9D9D9',
    },
    nextButtonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: isMobile ? 13 : 14,
    },
    addButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 8,
    },
    disabledAddButton: {
      backgroundColor: '#D9D9D9',
    },
    activeAddButton: {
      backgroundColor: '#424242',
    },
    addButtonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: isMobile ? 13 : 14,
    },
    insumoForm: {
      marginBottom: 16,
      padding: isMobile ? 10 : 12,
      backgroundColor: '#f8f9fa',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    insumoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? 8 : 10,
      marginBottom: 8,
      backgroundColor: '#f8f9fa',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    insumoNombre: {
      fontWeight: '500',
      fontSize: isMobile ? 13 : 14,
      color: '#333',
    },
    insumoCantidad: {
      fontSize: isMobile ? 11 : 12,
      color: '#666',
    },
    deleteButton: {
      padding: 6,
    },
    footerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    backButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: '48%',
      alignItems: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#D9D9D9',
    },
    backButtonText: {
      color: 'black',
      fontWeight: '500',
      fontSize: isMobile ? 13 : 14,
    },
    submitButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: '48%',
      alignItems: 'center',
      backgroundColor: '#424242',
    },
    submitButtonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: isMobile ? 13 : 14,
    },
  });

  if (paso === 1) {
    return (
      <Modal visible={visible} animationType="fade" transparent={true}>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Crear nuevo servicio</Text>
                  <TouchableOpacity onPress={() => { onClose(); resetForm(); }}>
                    <Ionicons name="close" size={20} color="#777" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>Información del servicio</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Nombre </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ej: Masajes"
                    placeholderTextColor="#D9D9D9"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Descripción </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Descripción breve"
                    placeholderTextColor="#D9D9D9"
                    multiline
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, isMobile ? { marginBottom: 12 } : { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Duración </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={duracion}
                      onChangeText={setDuracion}
                      placeholder="HH:MM"
                      placeholderTextColor="#D9D9D9"
                    />
                  </View>
                  <View style={[styles.formGroup, isMobile ? {} : { flex: 1 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Precio </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={precio}
                      onChangeText={setPrecio}
                      placeholder="COP"
                      placeholderTextColor="#D9D9D9"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.nextButton, (!nombre || !descripcion || !duracion || !precio) && styles.disabledButton]} 
                    onPress={() => setPaso(2)}
                    disabled={!nombre || !descripcion || !duracion || !precio}
                  >
                    <Text style={styles.nextButtonText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Insumos del servicio</Text>
                <TouchableOpacity onPress={() => setPaso(1)}>
                  <Ionicons name="arrow-back" size={20} color="#777" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>Agrega los insumos requeridos</Text>

              <View style={styles.insumoForm}>
                <Text style={styles.label}>
                  <Text style={styles.labelText}>Nombre del insumo </Text>
                  <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={nuevoInsumo}
                  onChangeText={setNuevoInsumo}
                  placeholder="Ej: Toallas"
                  placeholderTextColor="#D9D9D9"
                />

                <Text style={styles.label}>
                  <Text style={styles.labelText}>Cantidad </Text>
                  <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={cantidad}
                  onChangeText={setCantidad}
                  placeholder="0"
                  placeholderTextColor="#D9D9D9"
                  keyboardType="numeric"
                />

                <TouchableOpacity 
                  style={[styles.addButton, (!nuevoInsumo || !cantidad) ? styles.disabledAddButton : styles.activeAddButton]}
                  onPress={agregarInsumo}
                  disabled={!nuevoInsumo || !cantidad}
                >
                  <Text style={styles.addButtonText}>Agregar insumo</Text>
                </TouchableOpacity>
              </View>

              {insumos.map((insumo, index) => (
                <View key={index} style={styles.insumoItem}>
                  <View>
                    <Text style={styles.insumoNombre}>{insumo.nombre}</Text>
                    <Text style={styles.insumoCantidad}>Cantidad: {insumo.cantidad}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => eliminarInsumo(index)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.footerButtons}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setPaso(1)}
                >
                  <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleCreate}
                >
                  <Text style={styles.submitButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CrearServicio;