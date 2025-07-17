// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator, View } from "react-native";

/* Screens públicas */
import LoginScreen        from "../screens/login/LoginScreen";
import RegisterScreen     from "../screens/auth/RegisterScreen";
import VerifyEmailScreen  from "../screens/auth/VerifyEmailScreen";

/* Drawer Screens */
import DashboardScreen    from "../screens/dashboard/DashboardScreen";
import CustomDrawer       from "../components/CustomDrawer";
import { AuthContext }    from "../contexts/AuthContext";

/* Módulos (TODOS deben exportar **default** y estar bien importados) */
import ClientesScreen     from "../screens/clientes/ClientesScreen";
import BarberosScreen     from "../screens/barberos/BarberosScreen";
import RolesScreen        from "../screens/roles/RolesScreen";
import ComprasScreen      from "../screens/compras/ComprasScreen";
import ProveedoresScreen  from "../screens/proveedores/ProveedoresScreen";
import InsumosScreen      from "../screens/insumos/InsumosScreen";
/* ¡IMPORTANTE!  sin espacios “raros” en la ruta: */
import CategoriaInsumosScreen from "../screens/categoria insumos/CategoriaInsumosScreen";
import AgendaScreen       from "../screens/agenda/AgendaScreen";
import CitasScreen        from "../screens/citas/CitasScreen";
import ServiciosScreen    from "../screens/servicios/ServiciosScreen";
import MovimientosScreen  from "../screens/movimientos/MovimientosScreen";
import VentasScreen       from "../screens/ventas/VentasScreen";
/* Rutas privadas extra */
import ControlInsumos     from "../screens/insumos/ControlInsumos";

const Stack  = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* ------------------------------------------------------------------ */
/*  Helper: qué pantallas mostrar en el Drawer según el rol del usuario
/* ------------------------------------------------------------------ */
const renderDrawerScreens = (userRole) => {
  switch (userRole) {
    case "Cliente":
      return (
        <>
          <Drawer.Screen name="Agenda" component={AgendaScreen} />
          <Drawer.Screen name="Citas"  component={CitasScreen} />
        </>
      );

    case "Barbero":
      return (
        <>
          <Drawer.Screen name="Clientes"    component={ClientesScreen} />
          <Drawer.Screen name="Insumos"     component={InsumosScreen} />
          <Drawer.Screen name="Movimientos" component={MovimientosScreen} />
          <Drawer.Screen name="Agenda"      component={AgendaScreen} />
          <Drawer.Screen name="Citas"       component={CitasScreen} />
        </>
      );

    /* Rol Admin: muestra todo */
    default:
      return (
        <>
          <Drawer.Screen name="Dashboard"        component={DashboardScreen} />
          <Drawer.Screen name="Clientes"         component={ClientesScreen} />
          <Drawer.Screen name="Barberos"         component={BarberosScreen} />
          <Drawer.Screen name="Roles"            component={RolesScreen} />
          <Drawer.Screen name="Compras"          component={ComprasScreen} />
          <Drawer.Screen name="Proveedores"      component={ProveedoresScreen} />
          <Drawer.Screen name="Insumos"          component={InsumosScreen} />
          <Drawer.Screen name="CategoriaInsumos" component={CategoriaInsumosScreen} />
          <Drawer.Screen name="Agenda"           component={AgendaScreen} />
          <Drawer.Screen name="Citas"            component={CitasScreen} />
          <Drawer.Screen name="Servicios"        component={ServiciosScreen} />
          <Drawer.Screen name="Movimientos"      component={MovimientosScreen} />
          <Drawer.Screen name="Ventas"           component={VentasScreen} />
        </>
      );
  }
};

/* -------------------- Drawer principal ---------------------------- */
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

/* -------------------- Stack principal ----------------------------- */
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    /* Pantalla de carga mientras revisamos auth */
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      {/* --- Rutas públicas --- */}
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login"       component={LoginScreen} />
          <Stack.Screen name="Register"    component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      ) : (
        /* --- Rutas privadas --- */
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen
            name="ControlInsumos"
            component={ControlInsumos}
            options={{ headerShown: true, title: "Control de Insumos" }}
          />
          {/* Mantener VerifyEmail accesible tras login (si fuese necesario) */}
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
