// DetalleCompra.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const fFecha = (d) =>
  d
    ? new Date(d).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No especificada";

const fMoneda = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(v ?? 0);

export default function DetalleCompra({ visible, onClose, compra }) {
  if (!compra) return null;
  const detalles = compra.productos ?? [];

  useEffect(() => {
    if (visible) {
      console.log("🧾 Compra recibida:", compra);
      console.log("📦 Detalles detectados:", detalles);
    }
  }, [visible]);

  const nombre = (i) =>
    i?.nombre ?? i?.insumo?.nombre ?? i?.insumo_nombre ?? "—";
  const pu = (i) =>
    i?.precio_unitario ?? i?.precioUnitario ?? i?.insumo?.precio_unitario ?? 0;

  const renderItem = ({ item, index }) => {
    console.log(`🧩 Item #${index + 1}:`, item);
    return (
      <View style={st.detItem}>
        <View style={st.row}>
          <MaterialIcons name="bookmark" size={20} color="#4CAF50" />
          <Text style={st.lab}>Insumo:</Text>
          <Text style={st.val}>{nombre(item)}</Text>
        </View>
        <View style={st.row}>
          <MaterialIcons name="format-list-numbered" size={20} color="#2196F3" />
          <Text style={st.lab}>Cantidad:</Text>
          <Text style={st.val}>{item.cantidad}</Text>
        </View>
        <View style={st.row}>
          <MaterialIcons name="attach-money" size={20} color="#FF9800" />
          <Text style={st.lab}>Precio Unitario:</Text>
          <Text style={st.val}>{fMoneda(pu(item))}</Text>
        </View>
        <View style={st.row}>
          <MaterialIcons name="calculate" size={20} color="#9C27B0" />
          <Text style={st.lab}>Subtotal:</Text>
          <Text style={[st.val, st.subtotal]}>
            {fMoneda(item.subtotal ?? pu(item) * item.cantidad)}
          </Text>
        </View>
        <View style={st.sep} />
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <BlurView style={StyleSheet.absoluteFill} intensity={20} tint="default" />
        <View style={st.overlay}>
          <View style={st.modal}>
            <ScrollView contentContainerStyle={st.scroll}>
              <Text style={st.titulo}>Detalles de la compra</Text>

              <View style={st.info}>
                <View style={st.item}>
                  <Text style={st.label}>Fecha:</Text>
                  <Text style={st.value}>{fFecha(compra.fecha)}</Text>
                </View>
                <View style={st.item}>
                  <Text style={st.label}>Código:</Text>
                  <Text style={st.value}>{compra.id}</Text>
                </View>
                <View style={st.item}>
                  <Text style={st.label}>Total:</Text>
                  <Text style={[st.value, st.total]}>{fMoneda(compra.costo)}</Text>
                </View>
                <View style={st.item}>
                  <Text style={st.label}>Método:</Text>
                  <Text style={st.value}>{compra.metodo_pago}</Text>
                </View>
                <View style={st.item}>
                  <Text style={st.label}>Proveedor:</Text>
                  <Text style={st.value}>{compra.proveedor?.nombre}</Text>
                </View>
              </View>

              <View style={st.sepG} />
              <Text style={st.sub}>Insumos</Text>

              {detalles.length ? (
                <FlatList
                  data={detalles}
                  renderItem={renderItem}
                  keyExtractor={(_, i) => i.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={st.sin}>No hay insumos para esta compra</Text>
              )}

              <TouchableOpacity style={st.btn} onPress={onClose}>
                <Text style={st.txtBtn}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  modal: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "black",
    maxHeight: "90%",
  },
  scroll: { paddingBottom: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  info: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 15, marginBottom: 10 },
  item: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "bold", color: "#555" },
  value: { fontSize: 16 },
  total: { color: "#2e7d32", fontWeight: "bold", fontSize: 18 },
  sepG: { height: 1, backgroundColor: "#ddd", marginVertical: 15 },
  sub: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  detItem: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  lab: { marginLeft: 10, width: 120, fontWeight: "bold" },
  val: { flex: 1 },
  subtotal: { fontWeight: "bold", color: "#9C27B0" },
  sep: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  btn: { alignSelf: "center", marginTop: 20, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: "#424242", borderRadius: 15 },
  txtBtn: { color: "#fff", fontWeight: "bold" },
  sin: { textAlign: "center", color: "#777", marginVertical: 20, fontStyle: "italic" },
});
