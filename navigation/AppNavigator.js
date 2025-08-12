// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator, View, Image, useWindowDimensions } from "react-native";

/* Screens públicas */
import LoginScreen        from "../screens/login/LoginScreen";
import RegisterScreen     from "../screens/auth/RegisterScreen";
import VerifyEmailScreen  from "../screens/auth/VerifyEmailScreen";

/* Drawer Screens */
import DashboardScreen    from "../screens/dashboard/DashboardScreen";
import CustomDrawer       from "../components/CustomDrawer";
import { AuthContext }    from "../contexts/AuthContext";

/* Módulos */
import ClientesScreen     from "../screens/clientes/ClientesScreen";
import BarberosScreen     from "../screens/barberos/BarberosScreen";
import RolesScreen        from "../screens/roles/RolesScreen";
import ComprasScreen      from "../screens/compras/ComprasScreen";
import ProveedoresScreen  from "../screens/proveedores/ProveedoresScreen";
import InsumosScreen      from "../screens/insumos/InsumosScreen";
import CategoriaInsumosScreen from "../screens/categoria insumos/CategoriaInsumosScreen";
import AgendaScreen       from "../screens/agenda/AgendaScreen";
import CitasScreen        from "../screens/citas/CitasScreen";
import ServiciosScreen    from "../screens/servicios/ServiciosScreen";
import MovimientosScreen  from "../screens/movimientos/MovimientosScreen";
import VentasScreen       from "../screens/ventas/VentasScreen";

/* Rutas privadas extra */
import ControlInsumos     from "../screens/insumos/ControlInsumos";

/* Logo */
import LogoImg from "../assets/images/barberApp 1.png";

const Stack  = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* Componente del logo pequeño a la derecha */
const HeaderLogo = () => {
  const { width } = useWindowDimensions();

  // Definir tamaño dinámico: más grande en pantallas anchas (laptop/desktop)
  const isLargeScreen = width >= 1024; // 1024px suele ser punto de quiebre de desktop
  const logoSize = isLargeScreen ? 140 : 100;

  return (
    <Image
      source={LogoImg}
      style={{
        width: logoSize,
        height: logoSize,
        resizeMode: "contain",
        marginRight: 10
      }}
    />
  );
};

/* Helper para agregar headerRight excepto en Agenda */
const screenWithLogo = (Component, title) => ({
  headerTitle: title,
  headerRight: () => <HeaderLogo />
});

/* Helper: qué pantallas mostrar en el Drawer según el rol del usuario */
const renderDrawerScreens = (userRole) => {
  switch (userRole) {
    case "Cliente":
      return (
        <>
          <Drawer.Screen name="Agenda" component={AgendaScreen} />
          <Drawer.Screen name="Citas"  component={CitasScreen} options={screenWithLogo(CitasScreen, "Citas")} />
        </>
      );

    case "Barbero":
      return (
        <>
          <Drawer.Screen name="Clientes"    component={ClientesScreen} options={screenWithLogo(ClientesScreen, "Clientes")} />
          <Drawer.Screen name="Insumos"     component={InsumosScreen} options={screenWithLogo(InsumosScreen, "Insumos")} />
          <Drawer.Screen name="Movimientos" component={MovimientosScreen} options={screenWithLogo(MovimientosScreen, "Movimientos")} />
          <Drawer.Screen name="Agenda"      component={AgendaScreen} />
          <Drawer.Screen name="Citas"       component={CitasScreen} options={screenWithLogo(CitasScreen, "Citas")} />
        </>
      );

    /* Rol Admin: muestra todo */
    default:
      return (
        <>
          <Drawer.Screen name="Dashboard"        component={DashboardScreen} options={screenWithLogo(DashboardScreen, "Dashboard")} />
          <Drawer.Screen name="Clientes"         component={ClientesScreen} options={screenWithLogo(ClientesScreen, "Clientes")} />
          <Drawer.Screen name="Barberos"         component={BarberosScreen} options={screenWithLogo(BarberosScreen, "Barberos")} />
          <Drawer.Screen name="Roles"            component={RolesScreen} options={screenWithLogo(RolesScreen, "Roles")} />
          <Drawer.Screen name="Compras"          component={ComprasScreen} options={screenWithLogo(ComprasScreen, "Compras")} />
          <Drawer.Screen name="Proveedores"      component={ProveedoresScreen} options={screenWithLogo(ProveedoresScreen, "Proveedores")} />
          <Drawer.Screen name="Insumos"          component={InsumosScreen} options={screenWithLogo(InsumosScreen, "Insumos")} />
          <Drawer.Screen name="CategoriaInsumos" component={CategoriaInsumosScreen} options={screenWithLogo(CategoriaInsumosScreen, "Categoría de Insumos")} />
          <Drawer.Screen name="Agenda"           component={AgendaScreen} />
          <Drawer.Screen name="Citas"            component={CitasScreen} options={screenWithLogo(CitasScreen, "Citas")} />
          <Drawer.Screen name="Servicios"        component={ServiciosScreen} options={screenWithLogo(ServiciosScreen, "Servicios")} />
          <Drawer.Screen name="Movimientos"      component={MovimientosScreen} options={screenWithLogo(MovimientosScreen, "Movimientos")} />
          <Drawer.Screen name="Ventas"           component={VentasScreen} options={screenWithLogo(VentasScreen, "Ventas")} />
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
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login"       component={LoginScreen} />
          <Stack.Screen name="Register"    component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen
            name="ControlInsumos"
            component={ControlInsumos}
            options={{ headerShown: true, title: "Control de Insumos" }}
          />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
