/* ───────────────────────────────────────────────────────────
   screens/ventas/DetalleVenta.js
   Modal con la información de una venta
   ─────────────────────────────────────────────────────────── */
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");
const isMobile = width < 768;

const DetalleVenta = ({ visible, onClose, venta }) => {
  if (!visible || !venta) return null;

  /* helpers */
  const formatFecha = (yymmdd) => {
    if (!yymmdd) return "Fecha no disponible";
    const fecha = new Date(yymmdd);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const formatoHora = (hhmmss) => (hhmmss ? hhmmss.slice(0, 5) : "--:--");

  /* datos provenientes del backend */
  const cliente     = venta.cliente?.nombre     || "No especificado";
  const profesional = venta.barbero?.nombre     || "No especificado";
  const servicioNom = venta.servicio?.nombre    || "Servicio no especificado";
  const precio      = venta.servicio?.precio ?? venta.total ?? 0;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <View style={[styles.modal, isMobile && styles.modalMobile]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>
              Detalle de la Venta
            </Text>

            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={[
                styles.scrollContent,
                isMobile && styles.scrollContentMobile,
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* información general */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Información General
                </Text>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="date-range"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text
                    style={[styles.value, isMobile && styles.valueMobile]}
                  >{`${formatFecha(venta.fecha)} – ${formatoHora(
                    venta.hora
                  )}`}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="attach-money"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text
                    style={[styles.value, isMobile && styles.valueMobile]}
                  >{`Total: $${precio.toLocaleString("es-CO")}`}</Text>
                </View>

                {venta.descuento && (
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="money-off"
                      size={isMobile ? 20 : 18}
                      color="#555"
                      style={styles.icono}
                    />
                    <Text
                      style={[styles.value, isMobile && styles.valueMobile]}
                    >{`Descuento: ${venta.descuento}`}</Text>
                  </View>
                )}
              </View>

              {/* servicio */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Servicio
                </Text>
                <Text
                  style={[
                    styles.value,
                    styles.textoNegrita,
                    isMobile && styles.valueMobile,
                  ]}
                >
                  {servicioNom}
                </Text>
                <Text
                  style={[
                    styles.value,
                    styles.textoDescripcion,
                    isMobile && styles.valueMobile,
                  ]}
                >
                  {venta.comentarios || "Sin comentarios adicionales"}
                </Text>
              </View>

              {/* participantes */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Participantes
                </Text>

                <View style={styles.participantesContainer}>
                  <View style={styles.participante}>
                    <View style={[styles.avatar, styles.avatarCliente]}>
                      <Text style={styles.avatarText}>
                        {cliente.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.participanteNombre}>
                      Cliente: {cliente}
                    </Text>
                  </View>

                  <View style={styles.participante}>
                    <View style={[styles.avatar, styles.avatarProfesional]}>
                      <Text style={styles.avatarText}>
                        {profesional.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.participanteNombre}>
                      Barbero: {profesional}
                    </Text>
                  </View>
                </View>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? 20 : 0,
  },
  modal: {
    width: isMobile ? '100%' : '40%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isMobile ? 24 : 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'black',
    maxHeight: isMobile ? height * 0.8 : '80%',
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
  value: {
    fontSize: isMobile ? 16 : 16,
    color: '#222',
    fontWeight: isMobile ? '500' : '400',
    paddingLeft: isMobile ? 8 : 0,
    lineHeight: 20,
  },
  valueMobile: {
    fontSize: 17,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textoNegrita: {
    fontWeight: 'bold',
  },
  textoDescripcion: {
    fontSize: isMobile ? 14 : 14,
    color: '#777',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 10 : 8,
  },
  icono: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  precioContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  precio: {
    fontSize: isMobile ? 16 : 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  participantesContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  participante: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 12 : 10,
    justifyContent: 'space-between',
  },
  participanteNombre: {
    fontSize: isMobile ? 15 : 14,
    color: '#333',
    marginHorizontal: 8,
    flex: 1,
  },
  avatar: {
    width: isMobile ? 36 : 30,
    height: isMobile ? 36 : 30,
    borderRadius: isMobile ? 18 : 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCliente: {
    backgroundColor: '#2196F3',
  },
  avatarProfesional: {
    backgroundColor: '#FF9800',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: isMobile ? 16 : 14,
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
});

export default DetalleVenta;