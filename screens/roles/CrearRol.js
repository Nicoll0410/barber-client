import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const CrearRol = ({ visible, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

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

  const togglePermiso = (permiso) => {
    if (permisosSeleccionados.includes(permiso)) {
      setPermisosSeleccionados(permisosSeleccionados.filter(p => p !== permiso));
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, permiso]);
    }
  };

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setAvatar(resultado.assets[0].uri);
    }
  };

  const handleAceptar = () => {
    console.log({ nombre, descripcion, avatar, permisosSeleccionados });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          {/* Contenedor izquierdo */}
          <View style={styles.leftContainer}>
            <Text style={styles.title}>Crear nuevo rol</Text>
            <Text style={styles.subtext}>Por favor, proporciona la información del nuevo rol</Text>

            <Text style={styles.label}>
              Nombre <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingrese el nombre del rol"
              placeholderTextColor="#929292"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción opcional"
              placeholderTextColor="#929292"
            />

            <Text style={styles.label}>Avatar</Text>
            <Text style={styles.subtextSmall}>
              Te recomendamos usar íconos. Puedes encontrarlos <Text style={{ color: '#6e3eff' }}>aquí</Text>
            </Text>

            <View style={{ alignItems: 'center', width: '100%' }}>
              <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.image} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={24} color="#999" />
                    <Text style={styles.imagePickerText}>Selecciona una imagen</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAceptar}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contenedor derecho */}
          <View style={styles.rightContainer}>
            <Text style={styles.title}>Asociar permisos al rol</Text>
            <Text style={styles.subtext}>
              Para terminar, asocia los permisos que quieres que tenga acceso este rol
            </Text>
            <View style={styles.permisosContainer}>
              {permisosDisponibles.map((permiso) => {
                const isSelected = permisosSeleccionados.includes(permiso.label);
                return (
                  <TouchableOpacity
                    key={permiso.label}
                    style={[
                      styles.permisoButton,
                      isSelected && styles.permisoButtonSelected,
                    ]}
                    onPress={() => togglePermiso(permiso.label)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons
                        name={permiso.icon}
                        size={16}
                        color={isSelected ? '#fff' : '#333'}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.permisoText,
                          isSelected && styles.permisoTextSelected,
                        ]}
                      >
                        {permiso.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    width: '75%',
    maxWidth: 850,
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  leftContainer: {
    width: '50%',
    paddingRight: 15,
  },
  rightContainer: {
    width: '50%',
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  subtextSmall: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  imagePicker: {
    height: 90,
    width: 90,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePickerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: '#424242',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929292',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  permisosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  permisoButton: {
    borderWidth: 1,
    borderColor: '#929292',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
    backgroundColor: '#fff',
  },
  permisoButtonSelected: {
    backgroundColor: '#424242',
    borderColor: '#424242',
  },
  permisoText: {
    fontSize: 13,
    color: '#000',
  },
  permisoTextSelected: {
    color: '#fff',
  },
});

export default CrearRol;