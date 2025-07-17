/* ───────────────────────────────────────────────────────────
   screens/servicios/EditarServicio.js
   Insumos ahora OPCIONALES al editar un servicio
   ─────────────────────────────────────────────────────────── */
import React, { useState, useEffect } from "react";
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

const EditarServicio = ({
  visible,
  onClose,
  servicio,
  onUpdate,
  insumosDisponibles,
}) => {
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
  const [errores, setErrores] = useState({});
  const [mostrarError, setMostrarError] = useState(false);

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

  /* ───── Cargar datos del servicio ───── */
  useEffect(() => {
    if (servicio) {
      setNombre(servicio.nombre);
      setDescripcion(servicio.descripcion);
      setDuracionMaxima(servicio.duracionMaxima);
      setPrecio(servicio.precio.toString());

      if (servicio.insumos) {
        setInsumos(
          servicio.insumos.map((insumo) => {
            const insumoCompleto =
              insumosDisponibles.find((i) => i.id === insumo.id) || {};
            return {
              id: insumo.id,
              nombre: insumo.nombre || insumoCompleto.nombre,
              cantidad: (insumo.cantidad || insumo.unidades)?.toString(),
              categoria:
                getCategoriaNombre(insumoCompleto) ||
                insumo.categoria ||
                "Sin categoría",
            };
          })
        );
      }
    }
  }, [servicio, insumosDisponibles]);

  const resetForm = () => {
    setPaso(1);
    setInsumoSeleccionado("");
    setCantidad("");
    setErrores({});
    setMostrarError(false);
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

  /* ───── Validaciones paso 1 ───── */
  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombre) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!descripcion) nuevosErrores.descripcion = "La descripción es obligatoria";
    if (!duracionMaxima) nuevosErrores.duracionMaxima = "La duración es obligatoria";
    if (!precio) nuevosErrores.precio = "El precio es obligatorio";
    else if (isNaN(precio)) nuevosErrores.precio = "El precio debe ser un número";
    else if (parseInt(precio) <= 0) nuevosErrores.precio = "El precio debe ser mayor a 0";
    return nuevosErrores;
  };

  /* ───── Validaciones al agregar un insumo ───── */
  const validarInsumos = () => {
    const nuevosErrores = {};
    if (!insumoSeleccionado) nuevosErrores.insumo = "Debe seleccionar un insumo";
    if (!cantidad) nuevosErrores.cantidad = "La cantidad es obligatoria";
    else if (isNaN(cantidad)) nuevosErrores.cantidad = "La cantidad debe ser un número";
    else if (parseInt(cantidad) <= 0)
      nuevosErrores.cantidad = "La cantidad debe ser mayor a 0";
    if (insumos.find((i) => i.id === insumoSeleccionado))
      nuevosErrores.insumo = "Este insumo ya fue agregado";
    return nuevosErrores;
  };

  /* ───── Guardar cambios ───── */
  const handleUpdate = () => {
    const erroresValidacion = validarCampos();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      setMostrarError(true);
      setPaso(1);
      return;
    }

    const duracionMaximaConvertido = formatTime(duracionMaxima);

    onUpdate({
      id: servicio.id,
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
    onClose();
  };

  /* ───── Agregar insumo ───── */
  const agregarInsumo = () => {
    const erroresInsumo = validarInsumos();
    if (Object.keys(erroresInsumo).length > 0) {
      setErrores(erroresInsumo);
      setMostrarError(true);
      return;
    }

    const insumo = insumosDisponibles.find((i) => i.id === insumoSeleccionado);
    if (!insumo) {
      setErrores({ insumo: "Insumo no encontrado" });
      setMostrarError(true);
      return;
    }

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
    setErrores({});
    setMostrarError(false);
  };

  const eliminarInsumo = (id) => {
    setInsumos(insumos.filter((i) => i.id !== id));
  };

  /* ─────── Estilos ────── */
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
      width: isMobile ? "95%" : "40%",
      maxHeight: isMobile ? "90%" : "85%",
      backgroundColor: "white",
      borderRadius: 12,
      padding: isMobile ? 12 : 16,
      borderWidth: 1,
      borderColor: "black",
    },
    scrollContainer: { flexGrow: 1 },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isMobile ? 10 : 12,
    },
    modalTitle: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: "600",
      color: "#333",
    },
    subtitle: {
      color: "#666",
      marginBottom: isMobile ? 14 : 16,
      fontSize: isMobile ? 12 : 13,
    },
    formGroup: { marginBottom: isMobile ? 10 : 12 },
    formRow: { flexDirection: isMobile ? "column" : "row", marginBottom: isMobile ? 10 : 12 },
    label: { marginBottom: 4, fontSize: isMobile ? 12 : 13 },
    labelText: { fontWeight: "500", color: "black" },
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
    picker: {
      height: 50,
      width: "100%",
      borderWidth: 1,
      borderColor: "#424242",
      borderRadius: 6,
      marginBottom: 8,
      backgroundColor: "#fafafa",
    },
    textArea: { height: 70, textAlignVertical: "top" },
    buttonContainer: { alignItems: "center", marginTop: isMobile ? 10 : 12 },
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
      marginBottom: isMobile ? 14 : 16,
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
    insumoCategoria: { fontSize: isMobile ? 11 : 12, color: "#666", fontStyle: "italic" },
    deleteButton: { padding: 6 },
    footerButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: isMobile ? 14 : 16 },
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
    errorText: { color: "red", fontSize: isMobile ? 11 : 12, marginBottom: 8 },
    errorBox: {
      backgroundColor: "#ffebee",
      borderLeftWidth: 4,
      borderLeftColor: "red",
      padding: 10,
      marginBottom: 15,
    },
    errorTitle: { color: "red", fontWeight: "bold", marginBottom: 5 },
  });

  if (!servicio) return null;

  /* ─────────────── Paso 1 ────────────── */
  if (paso === 1) {
    return (
      <Modal visible={visible} animationType="fade" transparent>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Editar servicio</Text>
                  <TouchableOpacity
                    onPress={() => {
                      onClose();
                      resetForm();
                    }}
                  >
                    <Ionicons name="close" size={20} color="#777" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>Edita la información del servicio</Text>

                {mostrarError &&
                  (errores.nombre ||
                    errores.descripcion ||
                    errores.duracionMaxima ||
                    errores.precio) && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorTitle}>Corrige los siguientes errores:</Text>
                      {errores.nombre && <Text style={styles.errorText}>• {errores.nombre}</Text>}
                      {errores.descripcion && <Text style={styles.errorText}>• {errores.descripcion}</Text>}
                      {errores.duracionMaxima && (
                        <Text style={styles.errorText}>• {errores.duracionMaxima}</Text>
                      )}
                      {errores.precio && <Text style={styles.errorText}>• {errores.precio}</Text>}
                    </View>
                  )}

                {/* Nombre */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Nombre </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errores.nombre && { borderColor: "red" }]}
                    value={nombre}
                    onChangeText={(text) => {
                      setNombre(text);
                      if (errores.nombre) setErrores({ ...errores, nombre: "" });
                    }}
                    placeholder="Ej: Corte de cabello"
                    placeholderTextColor="#D9D9D9"
                  />
                </View>

                {/* Descripción */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelText}>Descripción </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea, errores.descripcion && { borderColor: "red" }]}
                    value={descripcion}
                    onChangeText={(text) => {
                      setDescripcion(text);
                      if (errores.descripcion) setErrores({ ...errores, descripcion: "" });
                    }}
                    placeholder="Descripción del servicio"
                    placeholderTextColor="#D9D9D9"
                    multiline
                  />
                </View>

                {/* Duración y Precio */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, isMobile ? { marginBottom: 12 } : { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Duración (HH:MM) </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, errores.duracionMaxima && { borderColor: "red" }]}
                      value={duracionMaxima}
                      onChangeText={(text) => {
                        setDuracionMaxima(text);
                        if (errores.duracionMaxima) setErrores({ ...errores, duracionMaxima: "" });
                      }}
                      placeholder="00:30"
                      placeholderTextColor="#D9D9D9"
                    />
                  </View>

                  <View style={[styles.formGroup, isMobile ? {} : { flex: 1 }]}>
                    <Text style={styles.label}>
                      <Text style={styles.labelText}>Precio </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, errores.precio && { borderColor: "red" }]}
                      value={precio}
                      onChangeText={(text) => {
                        setPrecio(text);
                        if (errores.precio) setErrores({ ...errores, precio: "" });
                      }}
                      placeholder="25000"
                      placeholderTextColor="#D9D9D9"
                      keyboardType="numeric"
                    />
                    {errores.precio && <Text style={styles.errorText}>{errores.precio}</Text>}
                  </View>
                </View>

                {/* Botón continuar */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.nextButton,
                      (!nombre || !descripcion || !duracionMaxima || !precio) && styles.disabledButton,
                    ]}
                    onPress={() => setPaso(2)}
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

  /* ─────────────── Paso 2 – Insumos OPCIONALES ────────────── */
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Insumos del servicio (opcional)</Text>
                <TouchableOpacity onPress={() => setPaso(1)}>
                  <Ionicons name="arrow-back" size={20} color="#777" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Agrega, edita o elimina insumos si lo consideras necesario
              </Text>

              {mostrarError &&
                (errores.insumo || errores.cantidad) && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorTitle}>Corrige los siguientes errores:</Text>
                    {errores.insumo && <Text style={styles.errorText}>• {errores.insumo}</Text>}
                    {errores.cantidad && <Text style={styles.errorText}>• {errores.cantidad}</Text>}
                  </View>
                )}

              {/* Formulario de insumo */}
              <View style={styles.insumoForm}>
                <Text style={styles.label}>
                  <Text style={styles.labelText}>Seleccionar insumo </Text>
                </Text>

                <Picker
                  selectedValue={insumoSeleccionado}
                  style={[styles.picker, errores.insumo && { borderColor: "red" }]}
                  onValueChange={(itemValue) => {
                    setInsumoSeleccionado(itemValue);
                    if (errores.insumo) setErrores({ ...errores, insumo: "" });
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
                {errores.insumo && <Text style={styles.errorText}>{errores.insumo}</Text>}

                <Text style={styles.label}>
                  <Text style={styles.labelText}>Cantidad </Text>
                </Text>
                <TextInput
                  style={[styles.input, errores.cantidad && { borderColor: "red" }]}
                  value={cantidad}
                  onChangeText={(text) => {
                    setCantidad(text);
                    if (errores.cantidad) setErrores({ ...errores, cantidad: "" });
                  }}
                  placeholder="Ej: 2"
                  placeholderTextColor="#D9D9D9"
                  keyboardType="numeric"
                />
                {errores.cantidad && <Text style={styles.errorText}>{errores.cantidad}</Text>}

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

              {/* Lista de insumos */}
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

                <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                  <Text style={styles.submitButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default EditarServicio;
