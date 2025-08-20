// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  ActivityIndicator,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificacionesScreen from "../screens/agenda/NotificacionesScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPasswordScreen";

/* Screens públicas */
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";

/* Drawer Screens */
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import CustomDrawer from "../components/CustomDrawer";
import { AuthContext } from "../contexts/AuthContext";

/* Módulos */
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

/* Rutas privadas extra */
import ControlInsumos from "../screens/insumos/ControlInsumos";

/* Logo */
import LogoImg from "../assets/images/barberApp 1.png";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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

/* Helper para agregar headerRight excepto en Agenda */
const screenWithLogo = (Component, title) => ({
  headerTitle: title,
  headerRight: () => <HeaderLogo />,
});

/* Drawer dinámico */
const renderDrawerScreens = (userRole) => {
  switch (userRole) {
    case "Cliente":
      return (
        <>
          <Drawer.Screen
            name="Agenda"
            component={AgendaScreen}
            options={({ navigation }) => ({
              headerTitle: "Agenda",
              headerRight: () => <NotificationBell navigation={navigation} />,
            })}
          />
          <Drawer.Screen
            name="Citas"
            component={CitasScreen}
            options={screenWithLogo(CitasScreen, "Citas")}
          />
        </>
      );

    case "Barbero":
      return (
        <>
          <Drawer.Screen
            name="Clientes"
            component={ClientesScreen}
            options={screenWithLogo(ClientesScreen, "Clientes")}
          />
          <Drawer.Screen
            name="Insumos"
            component={InsumosScreen}
            options={screenWithLogo(InsumosScreen, "Insumos")}
          />
          <Drawer.Screen
            name="Movimientos"
            component={MovimientosScreen}
            options={screenWithLogo(MovimientosScreen, "Movimientos")}
          />
          <Drawer.Screen
            name="Agenda"
            component={AgendaScreen}
            options={({ navigation }) => ({
              headerTitle: "Agenda",
              headerRight: () => <NotificationBell navigation={navigation} />,
            })}
          />
          <Drawer.Screen
            name="Citas"
            component={CitasScreen}
            options={screenWithLogo(CitasScreen, "Citas")}
          />
        </>
      );

    default:
      return (
        <>
          <Drawer.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={screenWithLogo(DashboardScreen, "Dashboard")}
          />
          <Drawer.Screen
            name="Clientes"
            component={ClientesScreen}
            options={screenWithLogo(ClientesScreen, "Clientes")}
          />
          <Drawer.Screen
            name="Barberos"
            component={BarberosScreen}
            options={screenWithLogo(BarberosScreen, "Barberos")}
          />
          <Drawer.Screen
            name="Roles"
            component={RolesScreen}
            options={screenWithLogo(RolesScreen, "Roles")}
          />
          <Drawer.Screen
            name="Compras"
            component={ComprasScreen}
            options={screenWithLogo(ComprasScreen, "Compras")}
          />
          <Drawer.Screen
            name="Proveedores"
            component={ProveedoresScreen}
            options={screenWithLogo(ProveedoresScreen, "Proveedores")}
          />
          <Drawer.Screen
            name="Insumos"
            component={InsumosScreen}
            options={screenWithLogo(InsumosScreen, "Insumos")}
          />
          <Drawer.Screen
            name="CategoriaInsumos"
            component={CategoriaInsumosScreen}
            options={screenWithLogo(
              CategoriaInsumosScreen,
              "Categoría de Insumos"
            )}
          />
          <Drawer.Screen
            name="Agenda"
            component={AgendaScreen}
            options={({ navigation }) => ({
              headerTitle: "Agenda",
              headerRight: () => <NotificationBell navigation={navigation} />,
            })}
          />
          <Drawer.Screen
            name="Citas"
            component={CitasScreen}
            options={screenWithLogo(CitasScreen, "Citas")}
          />
          <Drawer.Screen
            name="Servicios"
            component={ServiciosScreen}
            options={screenWithLogo(ServiciosScreen, "Servicios")}
          />
          <Drawer.Screen
            name="Movimientos"
            component={MovimientosScreen}
            options={screenWithLogo(MovimientosScreen, "Movimientos")}
          />
          <Drawer.Screen
            name="Ventas"
            component={VentasScreen}
            options={screenWithLogo(VentasScreen, "Ventas")}
          />
        </>
      );
  }
};

/* Drawer principal */
const DrawerNavigator = () => {
  const { userRole } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: true }}
    >
      {renderDrawerScreens(userRole)}
    </Drawer.Navigator>
  );
};

<Drawer.Screen
  name="Notificaciones"
  component={NotificacionesScreen}
  options={{ drawerLabel: "Notificaciones" }}
/>;

/* Stack principal */
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen
            name="ControlInsumos"
            component={ControlInsumos}
            options={{ headerShown: true, title: "Control de Insumos" }}
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmailScreen}
            options={{
              title: "Verificar Email",
              headerShown: true, // Mostrar header para poder navegar back
            }}
          />
          <Stack.Screen
            name="Notificaciones"
            component={NotificacionesScreen}
            options={{ headerShown: true, title: "Notificaciones" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
