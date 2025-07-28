import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const permisosDisponibles = [
  { label: 'Insumos', icon: 'spray' },
  { label: 'Agenda', icon: 'calendar' },
  { label: 'Categoría de Insumos', icon: 'database-import-outline' },
  { label: 'Proveedores', icon: 'toolbox-outline' },
  { label: 'Servicios', icon: 'toolbox-outline' },
  { label: 'Clientes', icon: 'account-outline' },
  { label: 'Roles', icon: 'key-outline' },
  { label: 'Barberos', icon: 'content-cut' },
  { label: 'Compras', icon: 'cart-outline' },
  { label: 'Control de Insumos', icon: 'clipboard-text-clock-outline' },
  { label: 'Citas', icon: 'calendar-outline' },
  { label: 'Mis Citas', icon: 'calendar' },
  { label: 'Dashboard', icon: 'view-dashboard-outline' },
  { label: 'Movimientos', icon: 'swap-horizontal' },
  { label: 'Ventas', icon: 'cash-multiple' },
];

const CrearRol = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({
    nombre: '',
    permisos: ''
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768);
    };
    checkScreenSize();
    const sub = Dimensions.addEventListener('change', checkScreenSize);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    if (!visible) {
      setNombre('');
      setDescripcion('');
      setAvatar(null);
      setPermisosSeleccionados([]);
      setErrors({
        nombre: '',
        permisos: ''
      });
    }
  }, [visible]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      nombre: '',
      permisos: ''
    };

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre del rol es obligatorio';
      valid = false;
    } else if (nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      valid = false;
    } else if (nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
      valid = false;
    }

    if (permisosSeleccionados.length === 0) {
      newErrors.permisos = 'Debe seleccionar al menos un permiso';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const togglePermiso = permiso => {
    const newPermisos = permisosSeleccionados.includes(permiso)
      ? permisosSeleccionados.filter(p => p !== permiso)
      : [...permisosSeleccionados, permiso];
    
    setPermisosSeleccionados(newPermisos);
    
    // Clear error when selecting at least one permission
    if (newPermisos.length > 0 && errors.permisos) {
      setErrors(prev => ({...prev, permisos: ''}));
    }
  };

  const seleccionarTodosPermisos = () => {
    if (permisosSeleccionados.length === permisosDisponibles.length) {
      setPermisosSeleccionados([]);
      setErrors(prev => ({...prev, permisos: 'Debe seleccionar al menos un permiso'}));
    } else {
      setPermisosSeleccionados(permisosDisponibles.map(p => p.label));
      setErrors(prev => ({...prev, permisos: ''}));
    }
  };

  const seleccionarImagen = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!res.canceled) setAvatar(res.assets[0].uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleAceptar = () => {
    if (!validateForm()) return;
    
    onCreate({ 
      nombre: nombre.trim(), 
      descripcion: descripcion.trim(), 
      avatar, 
      permisosSeleccionados 
    });
  };

  const handleNombreChange = (text) => {
    setNombre(text);
    if (errors.nombre) {
      setErrors(prev => ({...prev, nombre: ''}));
    }
  };

  const PermisosGrid = mobile => (
    <View style={mobile ? styles.mobilePermisosContainer : styles.permisosContainer}>
      {permisosDisponibles.map(p => {
        const sel = permisosSeleccionados.includes(p.label);
        return (
          <TouchableOpacity
            key={p.label}
            style={[styles.permisoButton, sel && styles.permisoButtonSelected]}
            onPress={() => togglePermiso(p.label)}>
            <MaterialCommunityIcons
              name={p.icon}
              size={16}
              color={sel ? '#fff' : '#333'}
              style={{marginRight:6}}
            />
            <Text style={[styles.permisoText, sel && styles.permisoTextSelected]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {errors.permisos && (
        <Text style={styles.errorText}>{errors.permisos}</Text>
      )}
    </View>
  );

  const LeftColumn = () => (
    <View style={styles.leftContainer}>
      <Text style={styles.title}>Crear nuevo rol</Text>
      <Text style={styles.subtext}>Completa la información</Text>

      <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nombre && styles.inputError]}
        value={nombre}
        onChangeText={handleNombreChange}
        placeholder="Nombre del rol"
        placeholderTextColor="#929292"
        maxLength={50}
      />
      {errors.nombre && (
        <Text style={styles.errorText}>{errors.nombre}</Text>
      )}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción opcional"
        placeholderTextColor="#929292"
        maxLength={255}
        multiline
      />

      <Text style={styles.label}>Avatar</Text>
      <Text style={styles.subtextSmall}>
        Puedes usar íconos de{' '}
        <Text style={styles.linkText} onPress={() => Linking.openURL('https://flaticon.com')}>
          flaticon.com
        </Text>
      </Text>
      <View style={{alignItems:'center', width:'100%'}}>
        <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
          {avatar ? (
            <Image source={{uri: avatar}} style={styles.image} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={24} color="#999" />
              <Text style={styles.imagePickerText}>Selecciona una imagen</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const RightColumn = () => (
    <View style={styles.rightContainer}>
      <View style={styles.permisosHeader}>
        <Text style={styles.title}>Permisos <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.selectAllButton} onPress={seleccionarTodosPermisos}>
          <Text style={styles.selectAllButtonText}>
            {permisosSeleccionados.length === permisosDisponibles.length
              ? 'Deseleccionar todos'
              : 'Seleccionar todos'
            }
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtext}>Selecciona los permisos</Text>
      {PermisosGrid(false)}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        {isMobile ? (
          <ScrollView style={styles.mobileContainer}>
            {LeftColumn()}
            <View style={styles.permisosHeader}>
              <Text style={styles.title}>Permisos <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.selectAllButton} onPress={seleccionarTodosPermisos}>
                <Text style={styles.selectAllButtonText}>
                  {permisosSeleccionados.length === permisosDisponibles.length
                    ? 'Deseleccionar todos'
                    : 'Seleccionar todos'
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {PermisosGrid(true)}
            <View style={styles.mobileButtonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAceptar}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.container}>
            {LeftColumn()}
            {RightColumn()}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAceptar}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex:1, 
    backgroundColor:'#00000033', 
    justifyContent:'center', 
    alignItems:'center' 
  },
  container: { 
    flexDirection:'row', 
    width:'75%', 
    maxWidth:850, 
    height:'80%', 
    backgroundColor:'#fff', 
    borderRadius:12, 
    padding:20, 
    borderWidth:1, 
    borderColor:'#000' 
  },
  leftContainer: { 
    width:'50%', 
    paddingRight:15 
  },
  rightContainer: { 
    width:'50%', 
    paddingLeft:15, 
    borderLeftWidth:1, 
    borderLeftColor:'#e0e0e0' 
  },
  mobileContainer: { 
    width:'90%', 
    maxHeight:'90%', 
    backgroundColor:'#fff', 
    borderRadius:12, 
    padding:20, 
    borderWidth:1, 
    borderColor:'#000' 
  },
  mobileButtonRow: { 
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginTop:20, 
    paddingHorizontal:10, 
    marginBottom:10 
  },

  title: { 
    fontSize:20, 
    fontWeight:'bold', 
    marginBottom:4 
  },
  subtext: { 
    fontSize:14, 
    color:'#555', 
    marginBottom:16 
  },
  subtextSmall: { 
    fontSize:12, 
    color:'#777', 
    marginBottom:10 
  },
  label: { 
    fontWeight:'600', 
    marginBottom:6, 
    fontSize:14 
  },
  required: { 
    color:'red' 
  },
  input: { 
    borderWidth:1, 
    borderColor:'#ccc', 
    borderRadius:8, 
    paddingHorizontal:10, 
    paddingVertical:8, 
    marginBottom:16 
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10
  },

  imagePicker: { 
    height:90, 
    width:90, 
    borderWidth:2, 
    borderColor:'#ccc', 
    borderRadius:45, 
    justifyContent:'center', 
    alignItems:'center', 
    marginBottom:16, 
    overflow:'hidden' 
  },
  image: { 
    width:90, 
    height:90, 
    borderRadius:45 
  },
  imagePickerText: { 
    textAlign:'center', 
    fontSize:12, 
    color:'#555' 
  },

  buttonRow: { 
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection:'row', 
    justifyContent:'flex-end',
    gap: 10
  },
  acceptButton: { 
    backgroundColor:'#424242', 
    paddingHorizontal:20, 
    paddingVertical:10, 
    borderRadius:8 
  },
  cancelButton: { 
    backgroundColor:'#fff', 
    borderWidth:1, 
    borderColor:'#929292', 
    paddingHorizontal:20, 
    paddingVertical:10, 
    borderRadius:8 
  },
  buttonText: { 
    color:'#fff', 
    fontWeight:'bold' 
  },
  cancelButtonText: { 
    color:'#000', 
    fontWeight:'bold' 
  },

  permisosHeader: { 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center', 
    marginBottom:4 
  },
  selectAllButton: { 
    backgroundColor:'#f0f0f0', 
    paddingHorizontal:10, 
    paddingVertical:5, 
    borderRadius:5 
  },
  selectAllButtonText: { 
    fontSize:12, 
    color:'#424242', 
    fontWeight:'bold' 
  },

  permisosContainer: { 
    flexDirection:'row', 
    flexWrap:'wrap', 
    gap:10, 
    marginTop:16 
  },
  mobilePermisosContainer: { 
    flexDirection:'row', 
    flexWrap:'wrap', 
    justifyContent:'center', 
    gap:10, 
    marginTop:16 
  },

  permisoButton: { 
    borderWidth:1, 
    borderColor:'#929292', 
    borderRadius:6, 
    paddingHorizontal:12, 
    paddingVertical:8, 
    margin:5, 
    backgroundColor:'#fff', 
    flexDirection:'row', 
    alignItems:'center' 
  },
  permisoButtonSelected: { 
    backgroundColor:'#424242', 
    borderColor:'#424242' 
  },
  permisoText: { 
    fontSize:13, 
    color:'#000' 
  },
  permisoTextSelected: { 
    color:'#fff' 
  },

  linkText: { 
    color:'#6e3eff', 
    textDecorationLine:'underline' 
  },
});

export default CrearRol;