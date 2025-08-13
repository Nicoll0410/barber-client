/* ───────────────────────────────────────────────────────────
   screens/agenda/CrearCita.js
   Wizard de 3 pasos para creación de cita (VERSIÓN FINAL CORREGIDA)
   Manejo seguro de clientes temporales y registrados
   ─────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CrearCita = ({
  visible,
  onClose,
  onCreate,
  barbero,
  fecha,
  slot,
  servicios,
  clientes,
}) => {
  const [step, setStep] = useState(1);
  const [servicioSel, setServicioSel] = useState(null);
  const [clienteSel, setClienteSel] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [isTemporal, setIsTemporal] = useState(false);
  const [temporalNombre, setTemporalNombre] = useState('');
  const [temporalTelefono, setTemporalTelefono] = useState('');

  const reset = () => {
    setServicioSel(null);
    setClienteSel(null);
    setBusqueda('');
    setStep(1);
    setIsTemporal(false);
    setTemporalNombre('');
    setTemporalTelefono('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

const handleCrear = async () => {
    try {
        const datosEnvio = {
            barberoID: barbero.id,
            servicioID: servicioSel.id,
            fecha: `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`,
            hora: slot.displayTime.toUpperCase(),
            direccion: "En barbería",
        };

        // Manejo de cliente temporal vs registrado
        if (isTemporal) {
            datosEnvio.pacienteTemporalNombre = temporalNombre.trim();
            if (temporalTelefono.trim()) {
                datosEnvio.pacienteTemporalTelefono = temporalTelefono.trim();
            }
        } else {
            datosEnvio.pacienteID = clienteSel.id;
        }

        console.log('Payload a enviar:', JSON.stringify(datosEnvio, null, 2));

        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await axios.post('http://localhost:8080/citas', datosEnvio, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data?.cita) {
            onCreate?.(response.data.cita);
            handleClose();
            Alert.alert('Éxito', 'Cita creada correctamente');
        } else {
            throw new Error('Respuesta inesperada del servidor');
        }
    } catch (err) {
        console.error('Error detallado:', {
            message: err.message,
            response: err.response?.data,
            request: err.request,
            config: err.config
        });

        let errorMessage = 'Error al crear la cita';
        if (err.response) {
            errorMessage = err.response.data?.mensaje || 
                          err.response.data?.error || 
                          `Error ${err.response.status}`;
        }

        Alert.alert('Error', errorMessage);
    }
};

  const Paso1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>
        Selecciona el servicio que se realizará en la cita
      </Text>

      <FlatList
        data={servicios}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.servicioItem,
              servicioSel?.id === item.id && styles.servicioSel,
            ]}
            onPress={() => setServicioSel(item)}>
            <Text style={styles.servicioNombre}>{item.nombre}</Text>
            <Text style={styles.servicioPrecio}>${item.precio}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.centeredBtn}>
        <TouchableOpacity
          style={[
            styles.btnPrimary,
            styles.btnWide,
            !servicioSel && styles.btnDisabled,
          ]}
          onPress={() => setStep(2)}
          disabled={!servicioSel}>
          <Text style={styles.btnPrimaryText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Paso2 = () => {
    const filtrados = clientes.filter(c =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Selecciona el cliente</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.optionToggle, !isTemporal && styles.optionToggleActive]}
            onPress={() => { setIsTemporal(false); setClienteSel(null); }}
          >
            <Text style={[styles.optionText, !isTemporal && styles.optionTextActive]}>Cliente existente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionToggle, isTemporal && styles.optionToggleActive, { marginLeft: 10 }]}
            onPress={() => { setIsTemporal(true); setClienteSel(null); }}
          >
            <Text style={[styles.optionText, isTemporal && styles.optionTextActive]}>Cliente nuevo</Text>
          </TouchableOpacity>
        </View>

        {!isTemporal ? (
          <>
            <View style={styles.searchBox}>
              <MaterialIcons
                name="search"
                size={20}
                color="#666"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre"
                value={busqueda}
                onChangeText={setBusqueda}
              />
            </View>

            <FlatList
              data={filtrados}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.clienteItem,
                    clienteSel?.id === item.id && styles.clienteSel,
                  ]}
                  onPress={() => setClienteSel(item)}>
                  <Image source={item.avatar} style={styles.clienteAvatar} />
                  <Text style={styles.clienteNombre}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Nombre del cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Juan Pérez"
              value={temporalNombre}
              onChangeText={setTemporalNombre}
            />
            <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 3001234567"
              value={temporalTelefono}
              keyboardType="phone-pad"
              onChangeText={setTemporalTelefono}
            />
          </>
        )}

        <View style={styles.navBtns}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setStep(1)}>
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnPrimary,
              (!isTemporal && !clienteSel) && styles.btnDisabled,
              (isTemporal && !temporalNombre.trim()) && styles.btnDisabled,
              { width: '45%' },
            ]}
            onPress={() => setStep(3)}
            disabled={(!isTemporal && !clienteSel) || (isTemporal && !temporalNombre.trim())}>
            <Text style={styles.btnPrimaryText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Paso3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>Revisa y confirma la información</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Servicio</Text>
        <Text style={styles.infoText}>{servicioSel.nombre}</Text>

        <Text style={styles.infoLabel}>Descripción</Text>
        <Text style={styles.infoText}>
          {servicioSel.descripcion || 'Sin descripción'}
        </Text>

        <Text style={styles.infoLabel}>Barbero</Text>
        <Text style={styles.infoText}>{barbero.nombre}</Text>

        <Text style={styles.infoLabel}>Cliente</Text>
        <Text style={styles.infoText}>
          {isTemporal ? temporalNombre : clienteSel?.nombre}
        </Text>

        {isTemporal && (
          <>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoText}>{temporalTelefono || 'No especificado'}</Text>
          </>
        )}

        <Text style={styles.infoLabel}>Fecha</Text>
        <Text style={styles.infoText}>
          {fecha.toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>

        <Text style={styles.infoLabel}>Hora</Text>
        <Text style={styles.infoText}>{slot.displayTime.toUpperCase()}</Text>
      </View>

      <View style={styles.navBtns}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setStep(2)}>
          <Text style={styles.btnSecondaryText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleCrear}>
          <Text style={styles.btnPrimaryText}>Confirmar cita</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return <Paso1 />;
      case 2: return <Paso2 />;
      case 3: return <Paso3 />;
      default: return <Paso1 />;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {step === 1 ? 'Seleccionar servicio' :
               step === 2 ? 'Seleccionar cliente' :
               'Revisa y confirma'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {renderStep()}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222'
  },
  stepContainer: {
    flexGrow: 1,
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16
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
    backgroundColor: '#fafafa'
  },
  servicioSel: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9'
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222'
  },
  servicioPrecio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: '#333'
  },
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  clienteSel: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9'
  },
  clienteAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222'
  },
  infoBox: {
    marginTop: 10,
    marginBottom: 18
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    color: '#222'
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6
  },
  navBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18
  },
  btnPrimary: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
  btnSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9'
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000'
  },
  btnDisabled: {
    backgroundColor: '#bbb'
  },
  centeredBtn: {
    alignItems: 'center',
    marginTop: 18
  },
  btnWide: {
    width: '80%'
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  optionToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  optionToggleActive: {
    backgroundColor: '#424242',
    borderColor: '#424242'
  },
  optionText: {
    color: '#333'
  },
  optionTextActive: {
    color: '#fff'
  }
});

export default CrearCita;