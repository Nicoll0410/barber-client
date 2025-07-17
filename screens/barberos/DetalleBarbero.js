import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const DetalleBarbero = ({ visible, onClose, barbero }) => {
  if (!barbero) return null;

  const EstadoVerificacion = ({ verificado }) => (
    <View
      style={[
        styles.estadoContainer,
        verificado ? styles.verificado : styles.noVerificado
      ]}
    >
      {verificado ? (
        <>
          <MaterialIcons
            name="verified"
            size={isMobile ? 18 : 20}
            color="#2e7d32"
          />
          <Text style={[styles.estadoTexto, styles.textoVerificado]}>
            Verificado
          </Text>
        </>
      ) : (
        <>
          <MaterialIcons
            name="warning"
            size={isMobile ? 18 : 20}
            color="#d32f2f"
          />
          <Text style={[styles.estadoTexto, styles.textoNoVerificado]}>
            No verificado
          </Text>
        </>
      )}
    </View>
  );

  const RolBadge = ({ rol }) => (
    <View
      style={[
        styles.rolBadge,
        rol === 'ADMIN' ? styles.rolAdmin : styles.rolBarbero
      ]}
    >
      <Text style={styles.rolBadgeText}>
        {rol === 'ADMIN' ? 'Administrador' : 'Barbero'}
      </Text>
    </View>
  );

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return 'Fecha inválida';
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>
              Información del Barbero
            </Text>

            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={[
                styles.scrollContent,
                isMobile && styles.scrollContentMobile
              ]}
            >
              {barbero.avatar && (
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: barbero.avatar }}
                    style={styles.avatarImage}
                  />
                </View>
              )}

              {/* nombre */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Nombre
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {barbero.nombre}
                </Text>
              </View>

              {/* cedula */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Cédula
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {barbero.cedula}
                </Text>
              </View>

              {/* rol */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Rol
                </Text>
                <RolBadge rol={barbero.rol} />
              </View>

              {/* telefono */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Teléfono
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {barbero.telefono}
                </Text>
              </View>

              {/* fechas */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Fecha de nacimiento
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {formatDate(barbero.fechaNacimiento)}
                </Text>
              </View>
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Fecha de contratación
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {formatDate(barbero.fechaContratacion)}
                </Text>
              </View>

              {/* email */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Email
                </Text>
                <Text style={[styles.value, isMobile && styles.valueMobile]}>
                  {barbero.email}
                </Text>
              </View>

              {/* verificado */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Verificación
                </Text>
                <EstadoVerificacion verificado={barbero.estaVerificado} />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.cerrar, isMobile && styles.cerrarMobile]}
              onPress={onClose}
            >
              <Text style={styles.textoCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

/* ---- estilos ---- */
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: isMobile ? 20 : 0 },
  modal: { width: isMobile ? '100%' : '30%', backgroundColor: '#fff', borderRadius: 12, padding: isMobile ? 24 : 20, elevation: 10, borderWidth: 1, borderColor: 'black', maxHeight: isMobile ? height * 0.8 : '80%' },
  modalMobile: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#424242' },
  scrollContainer: { flexGrow: 1 },
  scrollContent: { paddingBottom: 10 },
  scrollContentMobile: { paddingBottom: 20 },
  titulo: { fontSize: isMobile ? 20 : 22, fontWeight: 'bold', marginBottom: isMobile ? 16 : 20, textAlign: 'center', color: '#424242' },
  tituloMobile: { fontSize: 22 },
  item: { marginBottom: isMobile ? 16 : 14 },
  itemMobile: { marginBottom: 18 },
  label: { fontSize: isMobile ? 15 : 14, fontWeight: '600', color: '#555', marginBottom: isMobile ? 6 : 4 },
  labelMobile: { fontSize: 16 },
  value: { fontSize: isMobile ? 16 : 16, color: '#222', fontWeight: isMobile ? '500' : '400', paddingLeft: isMobile ? 8 : 0 },
  valueMobile: { fontSize: 17, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  cerrar: { marginTop: isMobile ? 24 : 20, alignSelf: 'center', paddingHorizontal: isMobile ? 40 : 30, paddingVertical: isMobile ? 12 : 10, backgroundColor: '#424242', borderRadius: 15, width: isMobile ? '60%' : undefined, alignItems: 'center' },
  cerrarMobile: { marginTop: 20 },
  textoCerrar: { fontWeight: 'bold', color: 'white', fontSize: isMobile ? 16 : 14 },
  /* badges */
  estadoContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: isMobile ? 6 : 4, paddingHorizontal: isMobile ? 10 : 8, borderRadius: 12, alignSelf: 'flex-start', marginTop: isMobile ? 6 : 4 },
  verificado: { backgroundColor: '#e8f5e9' },
  noVerificado: { backgroundColor: '#ffebee' },
  estadoTexto: { marginLeft: 6, fontWeight: '500', fontSize: isMobile ? 15 : 14 },
  textoVerificado: { color: '#2e7d32' },
  textoNoVerificado: { color: '#d32f2f' },
  rolBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, alignSelf: 'flex-start', marginTop: isMobile ? 6 : 4 },
  rolAdmin: { backgroundColor: '#E3F2FD' },
  rolBarbero: { backgroundColor: '#E8F5E9' },
  rolBadgeText: { fontWeight: '500', fontSize: isMobile ? 15 : 14 }
});

export default DetalleBarbero;
