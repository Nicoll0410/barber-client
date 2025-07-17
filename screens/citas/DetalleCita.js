/* ───────────────────────────────────────────────────────────
   screens/citas/DetalleCita.js
   Igual que Agenda/DetalleCita pero con acciones confirm / expire
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

/* Re‑usa mismo helper de estilos de estado */
const getStatusStyles = (status) => {
  if (!status) return { backgroundColor: "rgba(0,0,0,0.1)", color: "#000" };
  switch (status.toLowerCase()) {
    case "pendiente":
      return { backgroundColor: "rgba(206,209,0,0.2)", color: "#ced100" };
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
  puedeConfirmar = false,
  onConfirm,
  onExpire,
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
              <Text style={styles.person}>{cita.cliente?.nombre}</Text>
              <Text style={styles.personRole}>Cliente</Text>
            </View>
          </View>

          {/* Botones acción */}
          {puedeConfirmar && cita.estado === "Pendiente" && (
            <TouchableOpacity style={styles.btn} onPress={onConfirm}>
              <Text style={styles.btnText}>Confirmar (Completa)</Text>
            </TouchableOpacity>
          )}
          {puedeConfirmar && cita.estado === "Pendiente" && (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#aaa" }]}
              onPress={onExpire}
            >
              <Text style={styles.btnText}>Marcar Expirada</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#fff", borderWidth: 1 }]}
            onPress={onClose}
          >
            <Text style={[styles.btnText, { color: "#000" }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

/* ──────────────────── ESTILOS ────────────────────────── */
const styles = StyleSheet.create({
  blur:{flex:1,justifyContent:"center",alignItems:"center"},
  modal:{width:"90%",maxWidth:400,backgroundColor:"#fff",borderRadius:15,
         padding:20,elevation:5,borderWidth:1,borderColor:"#000"},
  header:{flexDirection:"row",justifyContent:"space-between",
          alignItems:"center",marginBottom:10},
  title:{fontSize:20,fontWeight:"700"},
  service:{fontSize:18,fontWeight:"600",marginBottom:4},
  badge:{alignSelf:"flex-start",paddingHorizontal:10,paddingVertical:4,
         borderRadius:20,marginBottom:12},
  badgeText:{fontWeight:"700",fontSize:12},
  row:{flexDirection:"row",alignItems:"center",marginBottom:8},
  rowText:{marginLeft:8,fontSize:16,color:"#333"},
  rowBetween:{flexDirection:"row",justifyContent:"space-between"},
  personBox:{alignItems:"center",flex:1},
  person:{fontSize:15,fontWeight:"600",color:"#333"},
  personRole:{fontSize:12,color:"#555"},
  btn:{backgroundColor:"#424242",padding:14,borderRadius:10,marginTop:14},
  btnText:{color:"#fff",fontWeight:"700",textAlign:"center"},
});

export default DetalleCita;
