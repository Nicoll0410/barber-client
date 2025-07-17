import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const EditarProveedor = ({ visible, onClose, proveedor, onUpdate }) => {
  const [tipoProveedor, setTipoProveedor] = useState('Persona');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nit, setNit] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [personaContacto, setPersonaContacto] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768);
    };

    checkScreenSize();
    const subscription = Dimensions.addEventListener('change', checkScreenSize);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (proveedor) {
      setTipoProveedor(proveedor.tipo || 'Persona');
      setTipoDocumento(proveedor.tipoDocumento || 'CC');
      
      if (proveedor.tipo === 'Persona') {
        setNumeroDocumento(proveedor.identificacion || '');
        setNombre(proveedor.nombre || '');
      } else {
        setNit(proveedor.identificacion || '');
        setNombreEmpresa(proveedor.nombre || '');
        setPersonaContacto(proveedor.nombreContacto || '');
      }
      
      setEmail(proveedor.email || '');
      setTelefono(proveedor.telefono || '');
    }
  }, [proveedor]);

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    if (tipoProveedor === 'Persona') {
      if (!numeroDocumento) {
        newErrors.numeroDocumento = 'El número de documento es obligatorio';
        isValid = false;
      } else if (!/^\d+$/.test(numeroDocumento)) {
        newErrors.numeroDocumento = 'Solo se permiten números';
        isValid = false;
      }

      if (!nombre) {
        newErrors.nombre = 'El nombre es obligatorio';
        isValid = false;
      }
    } else {
      if (!nit) {
        newErrors.nit = 'El NIT es obligatorio';
        isValid = false;
      } else if (!/^\d+$/.test(nit)) {
        newErrors.nit = 'Solo se permiten números';
        isValid = false;
      }

      if (!nombreEmpresa) {
        newErrors.nombreEmpresa = 'El nombre de la empresa es obligatorio';
        isValid = false;
      }

      if (!personaContacto) {
        newErrors.personaContacto = 'La persona de contacto es obligatoria';
        isValid = false;
      }
    }

    if (!email) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    if (!telefono) {
      newErrors.telefono = 'El teléfono es obligatorio';
      isValid = false;
    } else if (!/^\d+$/.test(telefono)) {
      newErrors.telefono = 'Solo se permiten números';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = () => {
    if (!validateFields()) return;

    const updatedProveedor = {
      ...proveedor,
      tipo: tipoProveedor,
      tipoDocumento: tipoProveedor === 'Persona' ? tipoDocumento : 'NIT',
      identificacion: tipoProveedor === 'Persona' ? numeroDocumento : nit,
      nombre: tipoProveedor === 'Persona' ? nombre : nombreEmpresa,
      nombreContacto: tipoProveedor === 'Persona' ? nombre : personaContacto,
      email: email,
      telefono: telefono
    };

    onUpdate(updatedProveedor);
  };

  const renderDesktopLayout = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Editar proveedor</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Edita la información del proveedor</Text>

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
                tipoProveedor === 'Persona' && styles.radioButtonSelected
              ]}
              onPress={() => setTipoProveedor('Persona')}
            >
              <Text style={[
                styles.radioButtonText,
                tipoProveedor === 'Persona' && styles.radioButtonTextSelected
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

        {tipoProveedor === 'Persona' ? (
          <>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Tipo de documento</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tipoDocumento}
                  onValueChange={(itemValue) => setTipoDocumento(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Cédula de ciudadanía" value="CC" />
                  <Picker.Item label="Cédula de extranjería" value="CE" />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Número de documento</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.numeroDocumento && styles.inputError]}
                value={numeroDocumento}
                onChangeText={(text) => {
                  setNumeroDocumento(text);
                  if (errors.numeroDocumento) setErrors({...errors, numeroDocumento: null});
                }}
                keyboardType="numeric"
                placeholder="Ej: 123456789"
                placeholderTextColor="#929292"
              />
              {errors.numeroDocumento && <Text style={styles.errorText}>{errors.numeroDocumento}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) setErrors({...errors, nombre: null});
                }}
                placeholder="Nombre completo"
                placeholderTextColor="#929292"
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>
          </>
        ) : (
          <>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>NIT</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nit && styles.inputError]}
                value={nit}
                onChangeText={(text) => {
                  setNit(text);
                  if (errors.nit) setErrors({...errors, nit: null});
                }}
                keyboardType="numeric"
                placeholder="Número de NIT"
                placeholderTextColor="#929292"
              />
              {errors.nit && <Text style={styles.errorText}>{errors.nit}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Nombre de la empresa</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nombreEmpresa && styles.inputError]}
                value={nombreEmpresa}
                onChangeText={(text) => {
                  setNombreEmpresa(text);
                  if (errors.nombreEmpresa) setErrors({...errors, nombreEmpresa: null});
                }}
                placeholder="Razón social"
                placeholderTextColor="#929292"
              />
              {errors.nombreEmpresa && <Text style={styles.errorText}>{errors.nombreEmpresa}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Persona de contacto</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.personaContacto && styles.inputError]}
                value={personaContacto}
                onChangeText={(text) => {
                  setPersonaContacto(text);
                  if (errors.personaContacto) setErrors({...errors, personaContacto: null});
                }}
                placeholder="Nombre del contacto"
                placeholderTextColor="#929292"
              />
              {errors.personaContacto && <Text style={styles.errorText}>{errors.personaContacto}</Text>}
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.requiredStar}>*</Text>
          </View>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({...errors, email: null});
            }}
            keyboardType="email-address"
            placeholder="Ej: nombre@dominio.com"
            placeholderTextColor="#929292"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.requiredStar}>*</Text>
          </View>
          <TextInput
            style={[styles.input, errors.telefono && styles.inputError]}
            value={telefono}
            onChangeText={(text) => {
              setTelefono(text);
              if (errors.telefono) setErrors({...errors, telefono: null});
            }}
            keyboardType="phone-pad"
            placeholder="Ej: 1234567890"
            placeholderTextColor="#929292"
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleUpdate}>
          <Text style={styles.acceptButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMobileLayout = () => (
    <View style={styles.mobileModalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Editar proveedor</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Edita la información del proveedor</Text>

      <ScrollView 
        style={styles.mobileScrollContainer}
        contentContainerStyle={styles.mobileScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de proveedor</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[
                styles.radioButton, 
                tipoProveedor === 'Persona' && styles.radioButtonSelected
              ]}
              onPress={() => setTipoProveedor('Persona')}
            >
              <Text style={[
                styles.radioButtonText,
                tipoProveedor === 'Persona' && styles.radioButtonTextSelected
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

        {tipoProveedor === 'Persona' ? (
          <>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Tipo de documento</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tipoDocumento}
                  onValueChange={(itemValue) => setTipoDocumento(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Cédula de ciudadanía" value="CC" />
                  <Picker.Item label="Cédula de extranjería" value="CE" />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Número de documento</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.numeroDocumento && styles.inputError]}
                value={numeroDocumento}
                onChangeText={(text) => {
                  setNumeroDocumento(text);
                  if (errors.numeroDocumento) setErrors({...errors, numeroDocumento: null});
                }}
                keyboardType="numeric"
                placeholder="Ej: 123456789"
                placeholderTextColor="#929292"
              />
              {errors.numeroDocumento && <Text style={styles.errorText}>{errors.numeroDocumento}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) setErrors({...errors, nombre: null});
                }}
                placeholder="Nombre completo"
                placeholderTextColor="#929292"
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>
          </>
        ) : (
          <>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>NIT</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nit && styles.inputError]}
                value={nit}
                onChangeText={(text) => {
                  setNit(text);
                  if (errors.nit) setErrors({...errors, nit: null});
                }}
                keyboardType="numeric"
                placeholder="Número de NIT"
                placeholderTextColor="#929292"
              />
              {errors.nit && <Text style={styles.errorText}>{errors.nit}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Nombre de la empresa</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.nombreEmpresa && styles.inputError]}
                value={nombreEmpresa}
                onChangeText={(text) => {
                  setNombreEmpresa(text);
                  if (errors.nombreEmpresa) setErrors({...errors, nombreEmpresa: null});
                }}
                placeholder="Razón social"
                placeholderTextColor="#929292"
              />
              {errors.nombreEmpresa && <Text style={styles.errorText}>{errors.nombreEmpresa}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Persona de contacto</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.personaContacto && styles.inputError]}
                value={personaContacto}
                onChangeText={(text) => {
                  setPersonaContacto(text);
                  if (errors.personaContacto) setErrors({...errors, personaContacto: null});
                }}
                placeholder="Nombre del contacto"
                placeholderTextColor="#929292"
              />
              {errors.personaContacto && <Text style={styles.errorText}>{errors.personaContacto}</Text>}
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.requiredStar}>*</Text>
          </View>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({...errors, email: null});
            }}
            keyboardType="email-address"
            placeholder="Ej: nombre@dominio.com"
            placeholderTextColor="#929292"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.requiredStar}>*</Text>
          </View>
          <TextInput
            style={[styles.input, errors.telefono && styles.inputError]}
            value={telefono}
            onChangeText={(text) => {
              setTelefono(text);
              if (errors.telefono) setErrors({...errors, telefono: null});
            }}
            keyboardType="phone-pad"
            placeholder="Ej: 1234567890"
            placeholderTextColor="#929292"
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
        </View>
      </ScrollView>

      <View style={styles.mobileButtonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleUpdate}>
          <Text style={styles.acceptButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <View style={isMobile ? styles.mobileModalContainer : styles.modalContainer}>
          {isMobile ? renderMobileLayout() : renderDesktopLayout()}
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  requiredStar: {
    color: 'red',
    marginLeft: 2,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  mobileModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  mobileModalContent: {
    width: '100%',
    maxHeight: '90%',
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
  mobileScrollContainer: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingBottom: 8,
  },
  mobileButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default EditarProveedor;