/* ───────────────────────────────────────────────────────────
   screens/servicios/CrearServicio.js
   Formulario completo – insumos ahora OPCIONALES
   ─────────────────────────────────────────────────────────── */
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Picker,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const CrearServicio = ({ visible, onClose, onCreate, insumosDisponibles }) => {
  /* ─────────────── Estados principales ─────────────── */
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracionMaxima, setDuracionMaxima] = useState("");
  const [precio, setPrecio] = useState("");
  const [paso, setPaso] = useState(1);

  /* ───── Insumos (ahora opcionales) ───── */
  const [insumos, setInsumos] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");

  /* ───── Errores ───── */
  const [errors, setErrors] = useState({
    nombre: false,
    descripcion: false,
    duracionMaxima: false,
    precio: false,
    precioInvalido: false,
    insumoSeleccionado: false,
    cantidad: false,
    cantidadInvalida: false,
    insumoExistente: false,
  });

  /* ───── Helpers ───── */
  const { width } = Dimensions.get("window");
  const isMobile = width < 768;

  const getCategoriaNombre = (insumo) => {
    if (insumo.categoriaProducto?.nombre) return insumo.categoriaProducto.nombre;
    if (insumo.categorias_insumo?.nombre) return insumo.categorias_insumo.nombre;
    if (insumo.categoria?.nombre) return insumo.categoria.nombre;
    if (insumo.categoriaNombre) return insumo.categoriaNombre;
    return "Sin categoría";
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setDuracionMaxima("");
    setPrecio("");
    setInsumos([]);
    setPaso(1);
    setInsumoSeleccionado("");
    setCantidad("");
    setErrors({
      nombre: false,
      descripcion: false,
      duracionMaxima: false,
      precio: false,
      precioInvalido: false,
      insumoSeleccionado: false,
      cantidad: false,
      cantidadInvalida: false,
      insumoExistente: false,
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    let formatted = "";
    if (hours > 0) formatted += `${hours} hora${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) {
      if (hours > 0) formatted += " y ";
      formatted += `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    }
    return formatted || "0 minutos";
  };

  /* ───── Validaciones paso 1 ───── */
  const validatePaso1 = () => {
    const newErrors = {
      nombre: !nombre,
      descripcion: !descripcion,
      duracionMaxima: !duracionMaxima,
      precio: !precio,
      precioInvalido: precio && (isNaN(precio) || parseInt(precio) <= 0),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const handleNext = () => {
    if (validatePaso1()) setPaso(2);
  };

  /* ───── Crear servicio (insumos opcionales) ───── */
  const handleCreate = () => {
    const duracionMaximaConvertido = formatTime(duracionMaxima);

    onCreate({
      nombre,
      descripcion,
      duracionMaxima,
      duracionMaximaConvertido,
      precio: parseInt(precio),
      insumos: insumos.map((insumo) => ({
        insumoID: insumo.id,
        unidades: parseInt(insumo.cantidad),
        categoria: insumo.categoria,
      })),
    });
    resetForm();
  };

  /* ───── Agregar insumo ───── */
  const agregarInsumo = () => {
    const newErrors = {
      insumoSeleccionado: !insumoSeleccionado,
      cantidad: !cantidad,
      cantidadInvalida: cantidad && (isNaN(cantidad) || parseInt(cantidad) <= 0),
      insumoExistente: insumos.find((i) => i.id === insumoSeleccionado) ? true : false,
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.values(newErrors).some((error) => error)) return;

    const insumo = insumosDisponibles.find((i) => i.id === insumoSeleccionado);
    if (!insumo) return;

    const categoriaNombre = getCategoriaNombre(insumo);
    setInsumos([
      ...insumos,
      {
        id: insumo.id,
        nombre: insumo.nombre,
        cantidad,
        categoria: categoriaNombre,
      },
    ]);

    setInsumoSeleccionado("");
    setCantidad("");
  };

  const eliminarInsumo = (id) => {
    setInsumos(insumos.filter((i) => i.id !== id));
  };

  /* ─────── Estilos ─────── */
  const styles = StyleSheet.create({
    blurContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    centeredView: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 10 : 0,
    },
    modalView: {
      width: isMobile ? "100%" : "40%",
      maxHeight: isMobile ? "90%" : "85%",
      backgroundColor: "white",
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: "black",
    },
    scrollContainer: {
      flexGrow: 1,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: "600",
      color: "#333",
    },
    subtitle: {
      color: "#666",
      marginBottom: 16,
      fontSize: isMobile ? 12 : 13,
    },
    formGroup: {
      marginBottom: 12,
    },
    formRow: {
      flexDirection: isMobile ? "column" : "row",
      marginBottom: 12,
    },
    label: {
      marginBottom: 4,
      fontSize: isMobile ? 12 : 13,
    },
    labelText: {
      fontWeight: "500",
      color: "black",
    },
    required: { color: "red" },
    input: {
      borderWidth: 1.5,
      borderColor: "#424242",
      borderRadius: 6,
      padding: isMobile ? 8 : 10,
      fontSize: isMobile ? 13 : 14,
      marginBottom: 8,
      backgroundColor: "#fafafa",
    },
    inputError: { borderColor: "red" },
    picker: {
      height: 50,
      width: "100%",
      borderWidth: 1,
      borderColor: "#424242",
      borderRadius: 6,
      marginBottom: 8,
      backgroundColor: "#fafafa",
    },
    pickerError: { borderColor: "red" },
    textArea: { height: 70, textAlignVertical: "top" },
    buttonContainer: { alignItems: "center", marginTop: 12 },
    nextButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#424242",
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: isMobile ? "100%" : "60%",
    },
    disabledButton: { backgroundColor: "#D9D9D9" },
    nextButtonText: { color: "white", fontWeight: "500", fontSize: isMobile ? 13 : 14 },
    addButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      alignItems: "center",
      marginTop: 8,
    },
    disabledAddButton: { backgroundColor: "#D9D9D9" },
    activeAddButton: { backgroundColor: "#424242" },
    addButtonText: { color: "white", fontWeight: "500", fontSize: isMobile ? 13 : 14 },
    insumoForm: {
      marginBottom: 16,
      padding: isMobile ? 10 : 12,
      backgroundColor: "#f8f9fa",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#e9ecef",
    },
    insumoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? 8 : 10,
      marginBottom: 8,
      backgroundColor: "#f8f9fa",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#e9ecef",
    },
    insumoNombre: { fontWeight: "500", fontSize: isMobile ? 13 : 14, color: "#333" },
    insumoCantidad: { fontSize: isMobile ? 11 : 12, color: "#666" },
    insumoCategoria: {
      fontSize: isMobile ? 11 : 12,
      color: "#666",
      fontStyle: "italic",
    },
    deleteButton: { padding: 6 },
    footerButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    backButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: "48%",
      alignItems: "center",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#D9D9D9",
    },
    backButtonText: { color: "black", fontWeight: "500", fontSize: isMobile ? 13 : 14 },
    submitButton: {
      padding: isMobile ? 8 : 10,
      borderRadius: 6,
      width: "48%",
      alignItems: "center",
      backgroundColor: "#424242",
    },
    submitButtonText: { color: "white", fontWeight: "500", fontSize: isMobile ? 13 : 14 },
    errorText: { color: "red", fontSize: isMobile ? 11 : 12, marginTop: -6, marginBottom: 8 },
  });

  /* ─────────────── Paso 1 ────────────── */
  if (paso === 1) {
    return (
      <Modal visible={visible} animationType="fade" transparent>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Crear nuevo servicio</Text>
                  <TouchableOpacity
                    onPress={() => {
                      onClose();
                      resetForm();
                    }}
                  >
                    <Ionicons name="close" size={20} color="#777" />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <Text style={styles.subtitle}>Información del servicio</Text>

                {(errors.nombre ||
                  errors.descripcion ||
                  errors.duracionMaxima ||
                  errors.precio ||
                  errors.precioInvalido) && (
                  <View style={[styles.errorBox, { backgroundColor: "#ffeeee", borderColor: "red" }]}>
                    <Text style={{ color: "red", fontSize: isMobile ? 12 : 13 }}>
                      Por favor complete todos los campos requeridos correctamente
                    </Text>
                  </View>
                )}

                {/* Nombre */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Nombre </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.nombre && styles.inputError]}
                    value={nombre}
                    onChangeText={(text) => {
                      setNombre(text);
                      setErrors((p) => ({ ...p, nombre: false }));
                    }}
                    placeholder="Ej: Corte de cabello"
                    placeholderTextColor="#D9D9D9"
                  />
                  {errors.nombre && <Text style={styles.errorText}>Este campo es requerido</Text>}
                </View>

                {/* Descripción */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Descripción </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea, errors.descripcion && styles.inputError]}
                    value={descripcion}
                    onChangeText={(text) => {
                      setDescripcion(text);
                      setErrors((p) => ({ ...p, descripcion: false }));
                    }}
                    placeholder="Descripción breve del servicio"
                    placeholderTextColor="#D9D9D9"
                    multiline
                  />
                  {errors.descripcion && <Text style={styles.errorText}>Este campo es requerido</Text>}
                </View>

                {/* Duración y Precio */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, isMobile ? { marginBottom: 12 } : { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Duración (HH:MM) </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, errors.duracionMaxima && styles.inputError]}
                      value={duracionMaxima}
                      onChangeText={(text) => {
                        setDuracionMaxima(text);
                        setErrors((p) => ({ ...p, duracionMaxima: false }));
                      }}
                      placeholder="00:30"
                      placeholderTextColor="#D9D9D9"
                    />
                    {errors.duracionMaxima && <Text style={styles.errorText}>Este campo es requerido</Text>}
                  </View>

                  <View style={[styles.formGroup, isMobile ? {} : { flex: 1 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Precio </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, (errors.precio || errors.precioInvalido) && styles.inputError]}
                      value={precio}
                      onChangeText={(text) => {
                        setPrecio(text);
                        setErrors((p) => ({ ...p, precio: false, precioInvalido: false }));
                      }}
                      placeholder="25000"
                      placeholderTextColor="#D9D9D9"
                      keyboardType="numeric"
                    />
                    {errors.precio && <Text style={styles.errorText}>Este campo es requerido</Text>}
                    {errors.precioInvalido && (
                      <Text style={styles.errorText}>El precio debe ser un número mayor a 0</Text>
                    )}
                  </View>
                </View>

                {/* Botón continuar */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.nextButton,
                      (!nombre || !descripcion || !duracionMaxima || !precio) && styles.disabledButton,
                    ]}
                    onPress={handleNext}
                    disabled={!nombre || !descripcion || !duracionMaxima || !precio}
                  >
                    <Text style={styles.nextButtonText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  }

  /* ─────────────── Paso 2 (insumos opcionales) ────────────── */
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Insumos del servicio (opcional)</Text>
                <TouchableOpacity onPress={() => setPaso(1)}>
                  <Ionicons name="arrow-back" size={20} color="#777" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Agrega los insumos requeridos (puedes dejarlo vacío si no aplica)
              </Text>

              {/* Formulario de insumo */}
              <View style={styles.insumoForm}>
                <Text style={styles.label}>
                  <Text style={styles.labelText}>Seleccionar insumo </Text>
                </Text>

                <Picker
                  selectedValue={insumoSeleccionado}
                  style={[styles.picker, errors.insumoSeleccionado && styles.pickerError]}
                  onValueChange={(itemValue) => {
                    setInsumoSeleccionado(itemValue);
                    setErrors((p) => ({ ...p, insumoSeleccionado: false, insumoExistente: false }));
                  }}
                >
                  <Picker.Item label="Seleccione un insumo..." value="" />
                  {insumosDisponibles.map((insumo) => (
                    <Picker.Item
                      key={insumo.id}
                      label={`${insumo.nombre} (${getCategoriaNombre(insumo)})`}
                      value={insumo.id}
                    />
                  ))}
                </Picker>
                {errors.insumoSeleccionado && <Text style={styles.errorText}>Debe seleccionar un insumo</Text>}
                {errors.insumoExistente && <Text style={styles.errorText}>Este insumo ya fue agregado</Text>}

                <Text style={styles.label}>
                  <Text style={styles.labelText}>Cantidad </Text>
                </Text>
                <TextInput
                  style={[styles.input, (errors.cantidad || errors.cantidadInvalida) && styles.inputError]}
                  value={cantidad}
                  onChangeText={(text) => {
                    setCantidad(text);
                    setErrors((p) => ({ ...p, cantidad: false, cantidadInvalida: false }));
                  }}
                  placeholder="Ej: 2"
                  placeholderTextColor="#D9D9D9"
                  keyboardType="numeric"
                />
                {errors.cantidad && <Text style={styles.errorText}>Este campo es requerido</Text>}
                {errors.cantidadInvalida && (
                  <Text style={styles.errorText}>La cantidad debe ser un número mayor a 0</Text>
                )}

                {/* Botón agregar insumo */}
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    (!insumoSeleccionado || !cantidad) ? styles.disabledAddButton : styles.activeAddButton,
                  ]}
                  onPress={agregarInsumo}
                  disabled={!insumoSeleccionado || !cantidad}
                >
                  <Text style={styles.addButtonText}>Agregar insumo</Text>
                </TouchableOpacity>
              </View>

              {/* Lista de insumos agregados */}
              {insumos.map((insumo) => (
                <View key={insumo.id} style={styles.insumoItem}>
                  <View>
                    <Text style={styles.insumoNombre}>{insumo.nombre}</Text>
                    <Text style={styles.insumoCantidad}>Cantidad: {insumo.cantidad}</Text>
                    <Text style={styles.insumoCategoria}>Categoría: {insumo.categoria}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarInsumo(insumo.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Botones finales */}
              <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.backButton} onPress={() => setPaso(1)}>
                  <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
                  <Text style={styles.submitButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CrearServicio;
