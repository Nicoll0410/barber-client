// navigation/CustomDrawerNavigator.js
import React, { useContext, useState, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Image, useWindowDimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../contexts/AuthContext";
import CustomDrawer from "../components/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";


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
  const logoSize = isLargeScreen ? 140 : 100;

  return (
    <Image
      source={LogoImg}
      style={{
        width: logoSize,
        height: logoSize,
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

  const toggleDrawer = () => {
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

  const screenWithLogo = (title) => ({
    headerTitle: title,
    headerRight: () => <HeaderLogo />,
  });

  const renderDrawerScreens = (userRole) => {
    const commonOptions = {
      headerLeft: () => (
        <TouchableOpacity onPress={toggleDrawer} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => <HeaderLogo />,
    };

    switch (userRole) {
      case "Cliente":
        return (
          <>
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={{
                ...commonOptions,
                headerTitle: "Agenda",
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                    <HeaderLogo />
                  </View>
                )
              }}
            />
            <Stack.Screen 
              name="Citas" 
              component={CitasScreen}
              options={screenWithLogo("Citas")}
            />
          </>
        );

      case "Barbero":
        return (
          <>
            <Stack.Screen name="Clientes" component={ClientesScreen} options={screenWithLogo("Clientes")} />
            {/* <Stack.Screen name="Insumos" component={InsumosScreen} options={screenWithLogo("Insumos")} /> */}
            {/* <Stack.Screen name="Movimientos" component={MovimientosScreen} options={screenWithLogo("Movimientos")} /> */}
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={{
                headerTitle: "Agenda",
                headerLeft: () => (
                  <TouchableOpacity onPress={toggleDrawer} style={{ marginLeft: 15 }}>
                    <Ionicons name="menu" size={24} color="black" />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                    <HeaderLogo />
                  </View>
                )
              }}
            />
            <Stack.Screen name="Citas" component={CitasScreen} options={screenWithLogo("Citas")} />
          </>
        );

      default:
        return (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={screenWithLogo("Dashboard")} />
            <Stack.Screen name="Clientes" component={ClientesScreen} options={screenWithLogo("Clientes")} />
            <Stack.Screen name="Barberos" component={BarberosScreen} options={screenWithLogo("Barberos")} />
            {/* <Stack.Screen name="Roles" component={RolesScreen} options={screenWithLogo("Roles")} /> */}
            {/* <Stack.Screen name="Compras" component={ComprasScreen} options={screenWithLogo("Compras")} /> */}
            {/* <Stack.Screen name="Proveedores" component={ProveedoresScreen} options={screenWithLogo("Proveedores")} /> */}
            {/* <Stack.Screen name="Insumos" component={InsumosScreen} options={screenWithLogo("Insumos")} /> */}
            {/* <Stack.Screen name="CategoriaInsumos" component={CategoriaInsumosScreen} options={screenWithLogo("Categoría de Insumos")} /> */}
            <Stack.Screen 
              name="Agenda" 
              component={AgendaScreen}
              options={{
                headerTitle: "Agenda",
                headerLeft: () => (
                  <TouchableOpacity onPress={toggleDrawer} style={{ marginLeft: 15 }}>
                    <Ionicons name="menu" size={24} color="black" />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationBell navigation={mainNavigation} />
                    <HeaderLogo />
                  </View>
                )
              }}
            />
            <Stack.Screen name="Citas" component={CitasScreen} options={screenWithLogo("Citas")} />
            <Stack.Screen name="Servicios" component={ServiciosScreen} options={screenWithLogo("Servicios")} />
            {/* <Stack.Screen name="Movimientos" component={MovimientosScreen} options={screenWithLogo("Movimientos")} /> */}
            <Stack.Screen name="Ventas" component={VentasScreen} options={screenWithLogo("Ventas")} />
            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} options={screenWithLogo("Notificaciones")} />
            {/* <Stack.Screen name="ControlInsumos" component={ControlInsumos} options={screenWithLogo("Control de Insumos")} /> */}
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer overlay */}
      {drawerOpen && (
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
          { transform: [{ translateX: drawerAnimation }] }
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
      <View style={styles.mainContent}>
        <Stack.Navigator>
          {renderDrawerScreens(userRole)}
        </Stack.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1000,
    elevation: 1000,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
});

export default CustomDrawerNavigator;