import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Buscador from "../../components/Buscador";
import DetalleVenta from "./DetalleVenta";
import Footer from "../../components/Footer";
import InfoModal from "../../components/InfoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Paginacion from "../../components/Paginacion";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

const VentasScreen = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const porPagina = 4;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:8080/ventas",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVentas(data.ventas || []);
      setVentasFiltradas(data.ventas || []);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
      showModal(
        "Error 🚨",
        "No se pudieron cargar las ventas. Por favor, inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchVentas();
    }, [])
  );

  useEffect(() => {
    if (!busqueda.trim()) {
      setVentasFiltradas(ventas);
    } else {
      const term = busqueda.toLowerCase();
      const filtradas = ventas.filter((v) => {
        const cliente = v.cliente?.nombre?.toLowerCase() || "";
        const servicio = v.servicio?.nombre?.toLowerCase() || "";
        const barbero = v.barbero?.nombre?.toLowerCase() || "";
        const fecha = v.fecha?.toLowerCase() || "";
        return (
          cliente.includes(term) ||
          servicio.includes(term) ||
          barbero.includes(term) ||
          fecha.includes(term)
        );
      });
      setVentasFiltradas(filtradas);
    }
    setPagina(1); // Resetear a primera página al buscar
  }, [busqueda, ventas]);

  // Cálculos para paginación
  const idxStart = (pagina - 1) * porPagina;
  const ventasPaginadas = isMobile ? ventasFiltradas : ventasFiltradas.slice(idxStart, idxStart + porPagina);
  const totalPags = Math.max(1, Math.ceil(ventasFiltradas.length / porPagina));

  const formatFecha = (yymmdd) => {
    if (!yymmdd) return "Fecha no disponible";
    const fecha = new Date(yymmdd);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatoHora = (hhmmss) => (hhmmss ? hhmmss.slice(0, 5) : "--:--");

  const verVenta = (venta) => {
    setVentaSeleccionada(venta);
    setModalDetalleVisible(true);
  };

  const renderMobileItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>
            {item.cliente?.nombre || "Cliente sin nombre"}
          </Text>
          <Text style={styles.cardSubtitle}>
            {formatFecha(item.fecha)} – {formatoHora(item.hora)}
          </Text>
        </View>
        <View style={styles.precioContainer}>
          <Text style={styles.textoPrecio}>
            $
            {(item.servicio?.precio ?? item.total ?? 0).toLocaleString("es-CO")}
          </Text>
        </View>
      </View>

      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Servicio:</Text>
        <Text style={styles.cardValue}>
          {item.servicio?.nombre || "—"}
        </Text>
      </View>

      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>Profesional:</Text>
        <Text style={styles.cardValue}>
          {item.barbero?.nombre || "—"}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => verVenta(item)}
          style={styles.actionButton}
        >
          <FontAwesome name="eye" size={20} color="#424242" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDesktopItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={[styles.celda, styles.columnaFecha]}>
        <Text style={styles.textoNombre}>{formatFecha(item.fecha)}</Text>
      </View>
      <View style={[styles.celda, styles.columnaHora]}>
        <Text style={styles.textoNombre}>{formatoHora(item.hora)}</Text>
      </View>
      <View style={[styles.celda, styles.columnaCliente]}>
        <Text style={styles.textoNombre}>
          {item.cliente?.nombre || "—"}
        </Text>
      </View>
      <View style={[styles.celda, styles.columnaServicio]}>
        <Text style={styles.textoServicio}>
          {item.servicio?.nombre || "—"}
        </Text>
      </View>
      <View style={[styles.celda, styles.columnaPrecio]}>
        <View style={styles.precioContainer}>
          <Text style={styles.textoPrecio}>
            $
            {(item.servicio?.precio ?? item.total ?? 0).toLocaleString("es-CO")}
          </Text>
        </View>
      </View>
      <View style={[styles.celda, styles.columnaAcciones]}>
        <TouchableOpacity
          onPress={() => verVenta(item)}
          style={styles.botonAccion}
        >
          <FontAwesome name="eye" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Ventas ✂️</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>{ventasFiltradas.length}</Text>
          </View>
        </View>
      </View>

      <Buscador
        placeholder="🔍 Buscar ventas (cliente, servicio, profesional, fecha)"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando ventas...</Text>
        </View>
      ) : ventasFiltradas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No se encontraron ventas 😕</Text>
          {busqueda.trim() && (
            <Text style={styles.emptySubText}>
              Intenta con otros términos de búsqueda
            </Text>
          )}
        </View>
      ) : isMobile ? (
        <FlatList
          data={ventasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMobileItem}
          contentContainerStyle={styles.listContainer}
          style={styles.mobileList}
        />
      ) : (
        <>
          <View style={styles.tabla}>
            <View style={styles.filaEncabezado}>
              <View style={[styles.celdaEncabezado, styles.columnaFecha]}>
                <Text style={styles.encabezado}>📅 Fecha</Text>
              </View>
              <View style={[styles.celdaEncabezado, styles.columnaHora]}>
                <Text style={styles.encabezado}>⏰ Hora</Text>
              </View>
              <View style={[styles.celdaEncabezado, styles.columnaCliente]}>
                <Text style={styles.encabezado}>👤 Cliente</Text>
              </View>
              <View style={[styles.celdaEncabezado, styles.columnaServicio]}>
                <Text style={styles.encabezado}>💈 Servicio</Text>
              </View>
              <View style={[styles.celdaEncabezado, styles.columnaPrecio]}>
                <Text style={styles.encabezado}>💰 Total</Text>
              </View>
              <View style={[styles.celdaEncabezado, styles.columnaAcciones]}>
                <Text style={styles.encabezado}>⚙️</Text>
              </View>
            </View>
            <FlatList
              data={ventasPaginadas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderDesktopItem}
            />
          </View>

          <View style={styles.paginacionContainer}>
            <Paginacion
              paginaActual={pagina}
              totalPaginas={totalPags}
              cambiarPagina={setPagina}
            />
          </View>
        </>
      )}

      <DetalleVenta
        visible={modalDetalleVisible}
        onClose={() => setModalDetalleVisible(false)}
        venta={ventaSeleccionada}
      />

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mobileList: {
    flex: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contadorContainer: {
    backgroundColor: '#D9D9D9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  // Estilos para móvil (tarjetas)
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#424242',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 16,
  },
  precioContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoPrecio: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Estilos para desktop (tabla)
  tabla: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
    flex: 1,
  },
  filaEncabezado: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  celdaEncabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  fila: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  celda: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  columnaFecha: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  columnaHora: {
    flex: 1,
    alignItems: 'center',
  },
  columnaCliente: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  columnaServicio: {
    flex: 2,
    alignItems: 'flex-start',
  },
  columnaPrecio: {
    flex: 1.5,
    alignItems: 'center',
  },
  columnaAcciones: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  textoNombre: {
    fontWeight: '500',
  },
  textoServicio: {
    color: '#000',
    fontWeight: '500',
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  botonAccion: {
    marginHorizontal: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  encabezado: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  paginacionContainer: {
    marginBottom: 35,
  },
});

export default VentasScreen;