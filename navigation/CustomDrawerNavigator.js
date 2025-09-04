// navigation/CustomDrawerNavigator.js
import React, { useContext, useState, useRef } from "react";
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Image, 
  useWindowDimensions,
  Platform,
  SafeAreaView
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../contexts/AuthContext";
import CustomDrawer from "../components/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import Footer from '../../components/Footer';
// Importa TODAS tus pantallas
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ClientesScreen from "../screens/clientes/ClientesScreen";
import BarberosScreen from "../screens/barberos/BarberosScreen";
import RolesScreen from "../screens/roles/RolesScreen";
import ComprasScreen from "../screens/compras/ComprasScreen";
import ProveedoresScreen from "../screens/proveedores/ProveedoresScreen";
import InsumosScreen from "../screens/insumos/InsumosScreen";
import CategoriaInsumosScreen from "../screens/categoria insumos/CategoriaInsumosScreen";
import AgendaScreen from "../screens/agenda/AgendaScreen";
import CitasScreen from "../screens/citas/CitasScreen";
import ServiciosScreen from "../screens/servicios/ServiciosScreen";
import MovimientosScreen from "../screens/movimientos/MovimientosScreen";
import VentasScreen from "../screens/ventas/VentasScreen";
import NotificacionesScreen from "../screens/agenda/NotificacionesScreen";
import ControlInsumos from "../screens/insumos/ControlInsumos";

const Stack = createStackNavigator();

/* Logo */
import LogoImg from "../assets/images/barberApp 1.png";

/* Icono campana con badge */
const NotificationBell = ({ navigation }) => {
  const { unreadCount } = useContext(AuthContext);

  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate("Notificaciones")}
    >
      <Ionicons name="notifications-outline" size={26} color="black" />
      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: 5,
            top: -2,
            backgroundColor: "red",
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/* Logo a la derecha */
const HeaderLogo = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const logoWidth = isLargeScreen ? 180 : 120;
  const logoHeight = isLargeScreen ? 40 : 30;

  return (
    <Image
      source={LogoImg}
      style={{
        width: logoWidth,
        height: logoHeight,
        resizeMode: "contain",
        marginRight: 10,
      }}
    />
  );
};

const CustomDrawerNavigator = ({ navigation: mainNavigation }) => {
  const { userRole } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-300)).current;
  const { width, height } = useWindowDimensions();
  
  // Determinar si es web
  const isWeb = Platform.OS === 'web';
  // Para web, mostramos el drawer siempre visible en pantallas grandes
  const isLargeScreen = width >= 1024;

  const toggleDrawer = () => {
    // En web con pantalla grande, el drawer siempre está visible
    if (isWeb && isLargeScreen) return;
    
    if (drawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeDrawer = () => {
    // En web con pantalla grande, el drawer siempre está visible
    if (isWeb && isLargeScreen) return;
    
    Animated.timing(drawerAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const navigateAndClose = (screen) => {
    closeDrawer();
    mainNavigation.navigate(screen);
  };

  // OPCIONES COMUNES para TODAS las pantallas - CON BOTÓN DE HAMBURGUESA
  // SOLO en móvil/pantallas pequeñas
  const commonOptions = ({ navigation }) => ({
    headerLeft: () => {
      // No mostrar el ícono de menú en pantallas grandes de web
      if (isWeb && isLargeScreen) return null;
      
      return (
        <TouchableOpacity onPress={toggleDrawer} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      );
    },
    headerRight: () => <HeaderLogo />,
  });

  const renderDrawerScreens = (userRole) => {
    switch (userRole) {
      case "Cliente":
        return (
          <>
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Agenda",
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                  </View>
                )
              })}
            />
            <Stack.Screen 
              name="Citas" 
              component={CitasScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Citas"
              })}
            />
          </>
        );

      case "Barbero":
        return (
          <>
            <Stack.Screen 
              name="Clientes" 
              component={ClientesScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Clientes"
              })}
            />
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Agenda",
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                  </View>
                )
              })}
            />
            <Stack.Screen 
              name="Citas" 
              component={CitasScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Citas"
              })}
            />
          </>
        );

      default:
        return (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Dashboard"
              })}
            />
            <Stack.Screen 
              name="Clientes" 
              component={ClientesScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Clientes"
              })}
            />
            <Stack.Screen 
              name="Barberos" 
              component={BarberosScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Barberos"
              })}
            />
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Agenda",
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                  </View>
                )
              })}
            />
            <Stack.Screen 
              name="Citas" 
              component={CitasScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Citas"
              })}
            />
            <Stack.Screen 
              name="Servicios" 
              component={ServiciosScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Servicios"
              })}
            />
            <Stack.Screen 
              name="Ventas" 
              component={VentasScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Ventas"
              })}
            />
            <Stack.Screen 
              name="Notificaciones" 
              component={NotificacionesScreen}
              options={({ navigation }) => ({
                ...commonOptions({ navigation }),
                headerTitle: "Notificaciones"
              })}
            />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Drawer overlay - Solo mostrar en móvil o cuando el drawer está abierto */}
        {(drawerOpen && !(isWeb && isLargeScreen)) && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        )}

        {/* Drawer content */}
        <Animated.View 
          style={[
            styles.drawer, 
            { 
              transform: [
                // En web con pantalla grande, siempre visible (translateX: 0)
                isWeb && isLargeScreen 
                  ? { translateX: 0 } 
                  : { translateX: drawerAnimation }
              ]
            }
          ]}
        >
          <CustomDrawer 
            navigation={{ 
              navigate: navigateAndClose,
              closeDrawer: closeDrawer
            }} 
          />
        </Animated.View>

        {/* Main content */}
        <View style={[
          styles.mainContent,
          // En web con pantalla grande, agregamos margen para el drawer fijo
          isWeb && isLargeScreen && { marginLeft: 300 }
        ]}>
          <Stack.Navigator
            screenOptions={{
              // Asegurar que el contenido se ajuste correctamente
              cardStyle: { flex: 1 }
            }}
          >
            {renderDrawerScreens(userRole)}
          </Stack.Navigator>
            {/* 👇 Footer siempre dentro de mainContent */}
  <View style={styles.footerWrapper}>
    <Footer />
  </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  footerWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  drawer: {
    width: 300,
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1000,
    elevation: 1000,
    // Para web: drawer fijo en pantallas grandes
    ...(Platform.OS === 'web' ? {
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    } : {}),
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    // Para web: permitir scroll solo en este contenedor
    ...(Platform.OS === 'web' ? {
      overflowY: 'auto',
      height: '100vh',
    } : {}),
  },
});

export default CustomDrawerNavigator;