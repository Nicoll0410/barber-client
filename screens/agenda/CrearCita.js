import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Datos de ejemplo
const servicios = [
  { id: '1', nombre: 'Corte de cabello', precio: '$80.000', descripcion: 'Corte profesional con técnicas modernas' },
  { id: '2', nombre: 'Afeitado clásico', precio: '$120.000', descripcion: 'Afeitado con navaja y productos premium' },
  { id: '3', nombre: 'Corte y barba', precio: '$100.000', descripcion: 'Combo completo de corte y arreglo de barba' },
  { id: '4', nombre: 'Tinte para cabello', precio: '$180.000', descripcion: 'Tinte profesional con productos de calidad' },
  { id: '5', nombre: 'Tratamiento capilar', precio: '$150.000', descripcion: 'Tratamiento revitalizante para el cabello' },
];

const clientes = [
  { id: '1', nombre: 'Santiago Pérez', avatar: require('../../assets/avatar.png') },
  { id: '2', nombre: 'Carolina López', avatar: require('../../assets/avatar.png') },
  { id: '3', nombre: 'María José García', avatar: require('../../assets/avatar.png') },
  { id: '4', nombre: 'Andrés Rodríguez', avatar: require('../../assets/avatar.png') },
];

const CrearCita = ({ visible, onClose, onCreate, barbero, fecha, hora }) => {
  const [paso, setPaso] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [busquedaCliente, setBusquedaCliente] = useState('');

  const resetForm = () => {
    setServicioSeleccionado(null);
    setClienteSeleccionado(null);
    setBusquedaCliente('');
    setPaso(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCrear = () => {
    onCreate({
      cliente: clienteSeleccionado.nombre,
      servicio: servicioSeleccionado.nombre,
      descripcion: servicioSeleccionado.descripcion,
      barbero: barbero.nombre,
      fecha: fecha.toLocaleDateString(),
      hora: hora
    });
    resetForm();
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  // Paso 1: Selección de servicio
  const Paso1 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, selecciona el servicio que se realizará en la cita</Text>
      
      <FlatList
        data={servicios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.servicioItem,
              servicioSeleccionado?.id === item.id && styles.servicioSeleccionado
            ]}
            onPress={() => setServicioSeleccionado(item)}
          >
            <Text style={styles.servicioNombre}>{item.nombre}</Text>
            <Text style={styles.servicioPrecio}>{item.precio}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.botonContainerCentrado}>
        <TouchableOpacity
          style={[styles.botonSiguiente, !servicioSeleccionado && styles.botonDisabled]}
          onPress={() => setPaso(2)}
          disabled={!servicioSeleccionado}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 2: Selección de cliente
  const Paso2 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, selecciona el paciente al que se realizará la cita</Text>
      
      <View style={styles.buscadorContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.buscadorIcono} />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar por nombre"
          value={busquedaCliente}
          onChangeText={setBusquedaCliente}
        />
      </View>
      
      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.clienteItem,
              clienteSeleccionado?.id === item.id && styles.clienteSeleccionado
            ]}
            onPress={() => setClienteSeleccionado(item)}
          >
            <Image source={item.avatar} style={styles.clienteAvatar} />
            <Text style={styles.clienteNombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(1)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botonSiguiente, !clienteSeleccionado && styles.botonDisabled]}
          onPress={() => setPaso(3)}
          disabled={!clienteSeleccionado}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 3: Confirmación
  const Paso3 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, revisa y asegúrate que la información de la cita es correcta</Text>
      
      <View style={styles.infoConfirmacion}>
        <Text style={styles.infoTitulo}>Servicio:</Text>
        <Text style={styles.infoTexto}>{servicioSeleccionado.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Descripción:</Text>
        <Text style={styles.infoTexto}>{servicioSeleccionado.descripcion}</Text>
        
        <Text style={styles.infoTitulo}>Barbero:</Text>
        <Text style={styles.infoTexto}>{barbero.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Cliente:</Text>
        <Text style={styles.infoTexto}>{clienteSeleccionado.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Fecha:</Text>
        <Text style={styles.infoTexto}>{fecha.toLocaleDateString()}</Text>
        
        <Text style={styles.infoTitulo}>Hora:</Text>
        <Text style={styles.infoTexto}>{hora}</Text>
      </View>
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(2)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.botonConfirmar}
          onPress={handleCrear}
        >
          <Text style={styles.botonTexto}>Confirmar cita</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaso = () => {
    switch(paso) {
      case 1: return <Paso1 />;
      case 2: return <Paso2 />;
      case 3: return <Paso3 />;
      default: return <Paso1 />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {paso === 1 && 'Seleccionar servicio'}
              {paso === 2 && 'Seleccionar cliente'}
              {paso === 3 && 'Revisa y confirma'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderPaso()}
          </ScrollView>
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
    width: '100%',
  },
  modalContent: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  pasoContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  servicioItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  servicioSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  servicioPrecio: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  buscadorIcono: {
    marginRight: 10,
  },
  buscadorInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: '#333',
  },
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  clienteSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  clienteAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  infoConfirmacion: {
    marginTop: 10,
    marginBottom: 18,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    color: '#222',
  },
  infoTexto: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  botonesNavegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  botonVolver: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  botonSiguiente: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  botonConfirmar: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  botonDisabled: {
    backgroundColor: '#bbb',
  },
  botonTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  botonTextoVolver: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  botonContainerCentrado: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default CrearCita;