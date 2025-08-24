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

  /* datos provenientes del backend - NUEVA ESTRUCTURA */
  const cliente = venta.cliente_nombre || "No especificado";
  const profesional = venta.barbero_nombre || "No especificado";
  const servicioNom = venta.servicio_nombre || "Servicio no especificado";
  const precioServicio = venta.servicio_precio || 0;
  const descuento = venta.descuento || 0;
  const total = venta.total || 0;

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
                  >{`${formatFecha(venta.fecha_cita)} – ${formatoHora(
                    venta.hora_cita
                  )}`}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="event"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>
                    Fecha de venta: {new Date(venta.fecha_venta).toLocaleDateString("es-ES")}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="receipt"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>
                    ID de venta: {venta.id}
                  </Text>
                </View>

                {venta.cita_id && (
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="event-note"
                      size={isMobile ? 20 : 18}
                      color="#555"
                      style={styles.icono}
                    />
                    <Text style={[styles.value, isMobile && styles.valueMobile]}>
                      ID de cita: {venta.cita_id}
                    </Text>
                  </View>
                )}
              </View>

              {/* información financiera */}
              <View style={[styles.item, isMobile && styles.itemMobile]}>
                <Text style={[styles.label, isMobile && styles.labelMobile]}>
                  Información Financiera
                </Text>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="attach-money"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>
                    Precio servicio: ${precioServicio.toLocaleString("es-CO")}
                  </Text>
                </View>

                {descuento > 0 && (
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="money-off"
                      size={isMobile ? 20 : 18}
                      color="#E53935"
                      style={styles.icono}
                    />
                    <Text style={[styles.value, isMobile && styles.valueMobile, { color: '#E53935' }]}>
                      Descuento: -${descuento.toLocaleString("es-CO")}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="payments"
                    size={isMobile ? 20 : 18}
                    color="#4CAF50"
                    style={styles.icono}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile, { color: '#4CAF50', fontWeight: 'bold' }]}>
                    Total pagado: ${total.toLocaleString("es-CO")}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="assignment-turned-in"
                    size={isMobile ? 20 : 18}
                    color="#555"
                    style={styles.icono}
                  />
                  <Text style={[styles.value, isMobile && styles.valueMobile]}>
                    Estado: {venta.estado || "Completada"}
                  </Text>
                </View>
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
                    <View style={styles.participanteInfo}>
                      <Text style={styles.participanteTitulo}>Cliente</Text>
                      <Text style={styles.participanteNombre}>{cliente}</Text>
                    </View>
                  </View>

                  <View style={styles.participante}>
                    <View style={[styles.avatar, styles.avatarProfesional]}>
                      <Text style={styles.avatarText}>
                        {profesional.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.participanteInfo}>
                      <Text style={styles.participanteTitulo}>Barbero</Text>
                      <Text style={styles.participanteNombre}>{profesional}</Text>
                    </View>
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
    width: isMobile ? '100%' : '50%',
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
    padding: isMobile ? 16 : 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemMobile: {
    marginBottom: 18,
  },
  label: {
    fontSize: isMobile ? 16 : 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: isMobile ? 12 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  labelMobile: {
    fontSize: 17,
  },
  value: {
    fontSize: isMobile ? 16 : 15,
    color: '#222',
    fontWeight: '400',
    lineHeight: 20,
  },
  valueMobile: {
    fontSize: 17,
  },
  textoNegrita: {
    fontWeight: 'bold',
    fontSize: isMobile ? 17 : 16,
    marginBottom: 4,
  },
  textoDescripcion: {
    fontSize: isMobile ? 14 : 14,
    color: '#777',
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 10 : 8,
    paddingVertical: 4,
  },
  icono: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  participantesContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  participante: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 16 : 12,
    padding: isMobile ? 12 : 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  participanteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  participanteTitulo: {
    fontSize: isMobile ? 12 : 11,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  participanteNombre: {
    fontSize: isMobile ? 15 : 14,
    color: '#333',
    fontWeight: '500',
  },
  avatar: {
    width: isMobile ? 40 : 36,
    height: isMobile ? 40 : 36,
    borderRadius: isMobile ? 20 : 18,
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
    fontSize: isMobile ? 18 : 16,
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