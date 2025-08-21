import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const CrearCita = ({
  visible,
  onClose,
  onCreate,
  barbero,
  fecha,
  slot,
  servicios,
  clientes,
}) => {
  const authContext = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [servicioSel, setServicioSel] = useState(null);
  const [clienteSel, setClienteSel] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [isTemporal, setIsTemporal] = useState(false);
  const [temporalNombre, setTemporalNombre] = useState("");
  const [temporalTelefono, setTemporalTelefono] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const reset = () => {
    setServicioSel(null);
    setClienteSel(null);
    setBusqueda("");
    setStep(1);
    setIsTemporal(false);
    setTemporalNombre("");
    setTemporalTelefono("");
    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const convertirHora24 = (horaStr) => {
    horaStr = horaStr.trim().toUpperCase();

    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaStr)) {
      return horaStr;
    }

    if (/^([0-9]|1[0-2]):[0-5][0-9] [AP]M$/.test(horaStr)) {
      const [time, period] = horaStr.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours, 10);
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }

    throw new Error("Formato de hora no válido");
  };

  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    const [hours, minutes] = horaInicio.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duracionMinutos;

    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const convertirDuracionAMinutos = (duracionStr) => {
    if (!duracionStr) return 60;

    const partes = duracionStr.split(":");
    if (partes.length >= 2) {
      return parseInt(partes[0]) * 60 + parseInt(partes[1]);
    }

    return parseInt(duracionStr) || 60;
  };

  const formatearHoraParaMostrar = (hora24) => {
    const [hours, minutes] = hora24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const obtenerUsuarioIdDelBarbero = async (token, barberoId) => {
    try {
      console.log("Buscando usuarioID del barbero...");
      
      const response = await axios.get(
        `http://localhost:8080/barberos/${barberoId}/usuario`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.success && response.data.usuarioID) {
        console.log("✅ UsuarioID del barbero encontrado:", response.data.usuarioID);
        return response.data.usuarioID;
      }
      
      console.log("❌ No se pudo obtener usuarioID del barbero");
      return null;
    } catch (error) {
      console.error("Error obteniendo usuarioID del barbero:", error);
      return null;
    }
  };

  const obtenerUsuarioActual = async (token) => {
    try {
      console.log("Obteniendo información del usuario actual...");
      
      const response = await axios.get(
        'http://localhost:8080/auth/user-info',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success && response.data.user?.id) {
        console.log("✅ UserId obtenido:", response.data.user.id);
        return response.data.user.id;
      }
      
      console.log("❌ No se pudo obtener userId del backend");
      return null;
    } catch (error) {
      console.error("Error obteniendo información del usuario:", error);
      return null;
    }
  };

  const crearNotificacion = async (token, notificacionData) => {
    try {
      console.log("Creando notificación:", notificacionData);
      
      const response = await axios.post(
        'http://localhost:8080/notifications',
        notificacionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Notificación creada:", response.data);
      return true;
    } catch (error) {
      console.error("Error creando notificación:", error);
      return false;
    }
  };

  const handleCrear = async () => {
    console.log("Iniciando creación de cita...");
    
    try {
      setIsLoading(true);

      if (!servicioSel || !barbero) {
        throw new Error("Falta información del servicio o barbero");
      }

      if (!isTemporal && !clienteSel) {
        throw new Error("Debes seleccionar un cliente");
      }
      if (isTemporal && !temporalNombre.trim()) {
        throw new Error("El nombre del cliente temporal es requerido");
      }

      const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${fecha.getDate().toString().padStart(2, "0")}`;

      let horaInicio24 = convertirHora24(slot.displayTime);
      if (!horaInicio24.includes(":")) {
        horaInicio24 = `${horaInicio24}:00`;
      } else if (horaInicio24.split(":").length === 2) {
        horaInicio24 = `${horaInicio24}:00`;
      }

      const duracionMinutos = convertirDuracionAMinutos(
        servicioSel.duracionMaxima
      );
      const horaFin24 = calcularHoraFin(horaInicio24, duracionMinutos);

      const citaData = {
        barberoID: barbero.id,
        servicioID: servicioSel.id,
        fecha: fechaFormateada,
        hora: horaInicio24,
        horaFin: `${horaFin24}:00`,
        direccion: "En barbería",
        estado: "Pendiente",
        duracionReal: servicioSel.duracionMaxima || "00:30:00",
        duracionRedondeada: `${Math.floor(duracionMinutos / 60)}:${(
          duracionMinutos % 60
        )
          .toString()
          .padStart(2, "0")}:00`,
      };

      if (isTemporal) {
        citaData.pacienteTemporalNombre = temporalNombre.trim();
        if (temporalTelefono.trim()) {
          citaData.pacienteTemporalTelefono = temporalTelefono.trim();
        }
      } else {
        // CORREGIDO: Enviar como pacienteID en lugar de clienteID
        citaData.pacienteID = clienteSel.id;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      console.log("Enviando datos al servidor:", JSON.stringify(citaData, null, 2));
      
      const response = await axios.post(
        "http://localhost:8080/citas",
        citaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.data && response.data.mensaje === 'Cita creada exitosamente') {
        Alert.alert('Éxito', 'Cita creada correctamente');
        
        // Crear notificaciones
        const citaId = response.data.cita.id;
        const clienteNombre = isTemporal ? temporalNombre : clienteSel?.nombre;
        
        // 1. Crear notificación para el barbero
        const usuarioIDBarbero = await obtenerUsuarioIdDelBarbero(token, barbero.id);
        if (usuarioIDBarbero) {
          await crearNotificacion(token, {
            usuarioID: usuarioIDBarbero,
            titulo: "📅 Nueva cita agendada",
            cuerpo: `El cliente ${clienteNombre} ha agendado una cita para el ${fecha.toLocaleDateString('es-ES')} a las ${slot.displayTime}`,
            tipo: "cita_creada",
            relacionId: citaId
          });
        }
        
        // 2. Crear notificación para el usuario actual
        const usuarioIDActual = await obtenerUsuarioActual(token);
        if (usuarioIDActual) {
          await crearNotificacion(token, {
            usuarioID: usuarioIDActual,
            titulo: "📅 Cita agendada",
            cuerpo: `Agendaste una cita para ${fecha.toLocaleDateString('es-ES')} a las ${slot.displayTime} con ${barbero.nombre}`,
            tipo: "cita_creada",
            relacionId: citaId
          });
        }
        
        // Forzar actualización de notificaciones
        if (authContext?.fetchNotifications) {
          console.log("Actualizando notificaciones...");
          await authContext.fetchNotifications();
        }
        
        // Reproducir sonido
        if (authContext?.playNotificationSound) {
          console.log("Reproduciendo sonido de notificación...");
          await authContext.playNotificationSound();
        }
        
        handleClose();
        if (onCreate) onCreate();
        return;
      }
      
      throw new Error(response.data?.mensaje || "Error al crear la cita");
    } catch (error) {
      console.error("Error completo al crear cita:", error);

      let mensajeError = "Error al crear la cita";
      if (error.response?.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.message) {
        mensajeError = error.message;
      }

      Alert.alert("Error", mensajeError);
    } finally {
      setIsLoading(false);
    }
  };

  const Paso1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>
        Selecciona el servicio que se realizará en la cita
      </Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.servicioItem,
              servicioSel?.id === item.id && styles.servicioSel,
            ]}
            onPress={() => setServicioSel(item)}
          >
            <View>
              <Text style={styles.servicioNombre}>{item.nombre}</Text>
              <Text style={styles.servicioDuracion}>
                Duración: {item.duracionMaxima || "1 hora"}
                (Bloquea todo el horario necesario)
              </Text>
            </View>
            <Text style={styles.servicioPrecio}>${item.precio || "0"}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.centeredBtn}>
        <TouchableOpacity
          style={[
            styles.btnPrimary,
            styles.btnWide,
            !servicioSel && styles.btnDisabled,
          ]}
          onPress={() => setStep(2)}
          disabled={!servicioSel}
        >
          <Text style={styles.btnPrimaryText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Paso2 = () => {
    const filtrados = clientes.filter((c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Selecciona el cliente</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={[
              styles.optionToggle,
              !isTemporal && styles.optionToggleActive,
            ]}
            onPress={() => {
              setIsTemporal(false);
              setClienteSel(null);
              setTemporalNombre("");
              setTemporalTelefono("");
            }}
          >
            <Text
              style={[
                styles.optionText,
                !isTemporal && styles.optionTextActive,
              ]}
            >
              Cliente existente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionToggle,
              isTemporal && styles.optionToggleActive,
              { marginLeft: 10 },
            ]}
            onPress={() => {
              setIsTemporal(true);
              setClienteSel(null);
              setBusqueda("");
            }}
          >
            <Text
              style={[styles.optionText, isTemporal && styles.optionTextActive]}
            >
              Cliente nuevo
            </Text>
          </TouchableOpacity>
        </View>

        {!isTemporal ? (
          <>
            <View style={styles.searchBox}>
              <MaterialIcons
                name="search"
                size={20}
                color="#666"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre"
                value={busqueda}
                onChangeText={setBusqueda}
              />
            </View>
            <FlatList
              data={filtrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.clienteItem,
                    clienteSel?.id === item.id && styles.clienteSel,
                  ]}
                  onPress={() => setClienteSel(item)}
                >
                  <Image source={item.avatar} style={styles.clienteAvatar} />
                  <Text style={styles.clienteNombre}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Nombre del cliente*</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Juan Pérez"
              value={temporalNombre}
              onChangeText={setTemporalNombre}
              maxLength={50}
            />
            <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 3001234567"
              value={temporalTelefono}
              keyboardType="phone-pad"
              onChangeText={setTemporalTelefono}
              maxLength={10}
            />
          </>
        )}

        <View style={styles.navBtns}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setStep(1)}
          >
            <Text style={styles.btnSecondaryText}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              !isTemporal && !clienteSel && styles.btnDisabled,
              isTemporal && !temporalNombre.trim() && styles.btnDisabled,
              { width: "45%" },
            ]}
            onPress={() => setStep(3)}
            disabled={
              (!isTemporal && !clienteSel) ||
              (isTemporal && !temporalNombre.trim())
            }
          >
            <Text style={styles.btnPrimaryText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const Paso3 = () => {
  const duracionMinutos = convertirDuracionAMinutos(
    servicioSel?.duracionMaxima || "01:00:00"
  );
  const horasCompletas = Math.floor(duracionMinutos / 60);
  const minutosRestantes = duracionMinutos % 60;
  const duracionFormateada = `${
    horasCompletas > 0
      ? `${horasCompletas} hora${horasCompletas > 1 ? "s" : ""}`
      : ""
  } ${minutosRestantes > 0 ? `${minutosRestantes} minutos` : ""}`.trim();

  const horaInicio24 = convertirHora24(slot.displayTime);
  const horaFin24 = calcularHoraFin(horaInicio24, duracionMinutos);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>Revisa y confirma la información</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Servicio</Text>
        <Text style={styles.infoText}>{servicioSel.nombre}</Text>

        <Text style={styles.infoLabel}>Barbero</Text>
        <Text style={styles.infoText}>{barbero.nombre}</Text>

        <Text style={styles.infoLabel}>Cliente</Text>
        <Text style={styles.infoText}>
          {isTemporal ? temporalNombre : clienteSel?.nombre}
          {isTemporal && " (Temporal)"}
        </Text>

        {isTemporal && (
          <>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoText}>
              {temporalTelefono || "No especificado"}
            </Text>
          </>
        )}

        <Text style={styles.infoLabel}>Fecha</Text>
        <Text style={styles.infoText}>
          {fecha.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Text style={styles.infoLabel}>Hora de inicio</Text>
        <Text style={styles.infoText}>
          {formatearHoraParaMostrar(horaInicio24)}
        </Text>

        <Text style={styles.infoLabel}>Hora de finalización</Text>
        <Text style={styles.infoText}>
          {formatearHoraParaMostrar(horaFin24)}
        </Text>

        <Text style={styles.infoLabel}>Duración total</Text>
        <Text style={styles.infoText}>{duracionFormateada}</Text>

        <Text style={[styles.infoLabel, { color: "#E53935", marginTop: 20 }]}>
          ¡Todo este horario será reservado!
        </Text>
      </View>

      <View style={styles.navBtns}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setStep(2)}
          disabled={isLoading}
        >
          <Text style={styles.btnSecondaryText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
          onPress={handleCrear}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Confirmar cita</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Paso1 />;
      case 2:
        return <Paso2 />;
      case 3:
        return <Paso3 />;
      default:
        return <Paso1 />;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {step === 1
                ? "Seleccionar servicio"
                : step === 2
                ? "Seleccionar cliente"
                : "Revisa y confirma"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {renderStep()}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "95%",
    maxWidth: 600,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  stepContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 16,
  },
  servicioItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "##FAFAFA",
  },
  servicioSel: {
    borderColor: "#424242",
    backgroundColor: "#D9D9D9",
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  servicioDuracion: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  servicioPrecio: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: "#333",
  },
  clienteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  clienteSel: {
    borderColor: "#424242",
    backgroundColor: "#D9D9D9",
  },
  clienteAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  infoBox: {
    marginTop: 10,
    marginBottom: 18,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
    color: "#222",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  navBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  btnPrimary: {
    backgroundColor: "#424242",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  btnSecondary: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  btnDisabled: {
    backgroundColor: "#bbb",
  },
  centeredBtn: {
    alignItems: "center",
    marginTop: 18,
  },
  btnWide: {
    width: "80%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  optionToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  optionToggleActive: {
    backgroundColor: "#424242",
    borderColor: "#424242",
  },
  optionText: {
    color: "#333",
  },
  optionTextActive: {
    color: "#fff",
  },
});

export default CrearCita;