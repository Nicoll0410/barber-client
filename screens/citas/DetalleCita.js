/* ───────────────────────────────────────────────────────────
   screens/citas/DetalleCita.js
   Versión sin botón de cancelar (solo visualización)
   ─────────────────────────────────────────────────────────── */
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

/* Helper de estilos de estado */
const getStatusStyles = (status) => {
  if (!status) return { backgroundColor: "rgba(0,0,0,0.1)", color: "#000" };
  switch (status.toLowerCase()) {
    case "pendiente":
      return { backgroundColor: "rgba(206,209,0,0.2)", color: "#ced100" };
    case "confirmada":
      return { backgroundColor: "rgba(0,123,255,0.2)", color: "#007BFF" };
    case "expirada":
      return { backgroundColor: "rgba(130,23,23,0.2)", color: "#821717" };
    case "cancelada":
      return { backgroundColor: "rgba(234,22,1,0.2)", color: "#EA1601" };
    case "completa":
      return { backgroundColor: "rgba(3,155,23,0.2)", color: "#039B17" };
    default:
      return { backgroundColor: "rgba(0,0,0,0.1)", color: "#000" };
  }
};

const DetalleCita = ({
  visible,
  onClose,
  cita,
}) => {
  if (!cita) return null;

  const status = getStatusStyles(cita.estado);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Detalle de la Cita</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Servicio + Estado */}
          <Text style={styles.service}>{cita.servicio?.nombre}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: status.backgroundColor },
            ]}
          >
            <Text style={[styles.badgeText, { color: status.color }]}>
              {cita.estado}
            </Text>
          </View>

          {/* Fecha / hora / duración */}
          <View style={styles.row}>
            <Feather name="calendar" size={18} color="#555" />
            <Text style={styles.rowText}>{cita.fechaFormateada}</Text>
          </View>
          <View style={styles.row}>
            <Feather name="clock" size={18} color="#555" />
            <Text style={styles.rowText}>
              {cita.hora.slice(0,5)} – {cita.horaFin.slice(0,5)}
            </Text>
          </View>
          <View style={styles.row}>
            <Feather name="watch" size={18} color="#555" />
            <Text style={styles.rowText}>
              {cita.servicio?.duracionMaxima || "—"}
            </Text>
          </View>

          {/* Participantes */}
          <View style={[styles.rowBetween, { marginTop: 16 }]}>
            <View style={styles.personBox}>
              <Text style={styles.person}>{cita.barbero?.nombre}</Text>
              <Text style={styles.personRole}>Barbero</Text>
            </View>
            <View style={styles.personBox}>
              <Text style={styles.person}>
                {cita.cliente?.nombre || cita.pacienteTemporalNombre || "Cliente no especificado"}
              </Text>
              <Text style={styles.personRole}>Cliente</Text>
            </View>
          </View>

          {/* Información adicional si existe */}
          {cita.pacienteTemporalTelefono && (
            <View style={styles.row}>
              <Feather name="phone" size={18} color="#555" />
              <Text style={styles.rowText}>{cita.pacienteTemporalTelefono}</Text>
            </View>
          )}

          {cita.direccion && cita.direccion !== "En barbería" && (
            <View style={styles.row}>
              <Feather name="map-pin" size={18} color="#555" />
              <Text style={styles.rowText}>{cita.direccion}</Text>
            </View>
          )}

          {/* Solo botón de cerrar */}
          <TouchableOpacity
            style={[styles.btn, styles.closeBtn]}
            onPress={onClose}
          >
            <Text style={[styles.btnText, styles.closeBtnText]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

/* ──────────────────── ESTILOS ────────────────────────── */
const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "700"
  },
  service: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 12
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  rowText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  personBox: {
    alignItems: "center",
    flex: 1
  },
  person: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333"
  },
  personRole: {
    fontSize: 12,
    color: "#555"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 14
  },
  closeBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#424242"
  },
  btnText: {
    color: "#424242",
    fontWeight: "700",
    textAlign: "center"
  },
  closeBtnText: {
    color: "#424242"
  }
});

export default DetalleCita;