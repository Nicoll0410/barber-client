import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const DetalleRol = ({ visible, onClose, rol }) => {
  if (!rol) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>Información del Rol</Text>
            
            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
            >
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Nombre</Text>
                <View style={styles.row}>
                  <Ionicons 
                    name="person-circle-outline" 
                    size={isMobile ? 20 : 18} 
                    color="#333" 
                    style={isMobile && { marginRight: 8 }}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>{rol.nombre}</Text>
                </View>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Descripción</Text>
                <Text style={[styles.value, styles.valueBold, isMobile && styles.valueMobile]}>
                  {rol.descripcion}
                </Text>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Usuarios Asociados</Text>
                <View style={[styles.badge, isMobile && styles.badgeMobile]}>
                  <Text style={[styles.badgeText, isMobile && styles.badgeTextMobile]}>
                    {rol.usuariosAsociados || 0}
                  </Text>
                </View>
              </View>

              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>Permisos</Text>
                <View style={[styles.permisosContainer, isMobile && styles.permisosContainerMobile]}>
                  {rol.permisos?.map((permiso, index) => (
                    <View key={index} style={[styles.permisoItem, isMobile && styles.permisoItemMobile]}>
                      <MaterialIcons 
                        name="lock-outline" 
                        size={isMobile ? 18 : 16} 
                        color="#fff" 
                      />
                      <Text style={[styles.permisoText, isMobile && styles.permisoTextMobile]}>
                        {permiso}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.cerrar, isMobile && styles.cerrarMobile]} 
              onPress={onClose}
            >
              <Text style={[styles.textoCerrar, isMobile && styles.textoCerrarMobile]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? 20 : 0,
  },
  modal: {
    width: isMobile ? '100%' : '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isMobile ? 24 : 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: isMobile ? '80%' : undefined,
  },
  modalMobile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  scrollContentMobile: {
    paddingBottom: 20,
  },
  titulo: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: 'bold',
    marginBottom: isMobile ? 16 : 20,
    textAlign: 'center',
    color: '#424242',
  },
  tituloMobile: {
    fontSize: 22,
  },
  item: {
    marginBottom: isMobile ? 16 : 14,
  },
  itemMobile: {
    marginBottom: 18,
  },
  label: {
    fontSize: isMobile ? 15 : 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: isMobile ? 6 : 4,
  },
  labelMobile: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: isMobile ? 16 : 16,
    color: '#222',
    fontWeight: isMobile ? '500' : '400',
    paddingLeft: isMobile ? 8 : 0,
  },
  valueMobile: {
    fontSize: 17,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  valueBold: {
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: isMobile ? 12 : 10,
    paddingVertical: isMobile ? 6 : 4,
  },
  badgeMobile: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: isMobile ? 15 : 14,
  },
  badgeTextMobile: {
    fontSize: 16,
  },
  permisosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isMobile ? 10 : 8,
    marginTop: isMobile ? 8 : 6,
  },
  permisosContainerMobile: {
    gap: 12,
  },
  permisoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: isMobile ? 8 : 6,
    paddingHorizontal: isMobile ? 16 : 15,
    borderRadius: 15,
  },
  permisoItemMobile: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  permisoText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: isMobile ? 14 : 13,
  },
  permisoTextMobile: {
    fontSize: 15,
  },
  cerrar: {
    marginTop: isMobile ? 24 : 20,
    alignSelf: 'center',
    paddingHorizontal: isMobile ? 40 : 30,
    paddingVertical: isMobile ? 12 : 10,
    backgroundColor: '#424242',
    borderRadius: 15,
    width: isMobile ? '60%' : undefined,
    alignItems: 'center',
  },
  cerrarMobile: {
    marginTop: 20,
  },
  textoCerrar: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: isMobile ? 16 : 14,
  },
  textoCerrarMobile: {
    fontSize: 16,
  },
});

export default DetalleRol;