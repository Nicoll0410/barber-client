import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/login/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CustomDrawer from '../components/CustomDrawer';

// Admin Screens
import ClientesScreen from '../screens/clientes/ClientesScreen';
import BarberosScreen from '../screens/barberos/BarberosScreen';
import RolesScreen from '../screens/roles/RolesScreen';
import ComprasScreen from '../screens/compras/ComprasScreen';
import ProveedoresScreen from '../screens/proveedores/ProveedoresScreen';
import InsumosScreen from '../screens/insumos/InsumosScreen';
import CategoriaInsumosScreen from '../screens/categoria insumos/CategoriaInsumosScreen';
import AgendaScreen from '../screens/agenda/AgendaScreen';
import CitasScreen from '../screens/citas/CitasScreen';
import ServiciosScreen from '../screens/servicios/ServiciosScreen';
import MovimientosScreen from '../screens/movimientos/MovimientosScreen';
import VentasScreen from '../screens/ventas/VentasScreen';
import ControlInsumos from '../screens/insumos/ControlInsumos';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer para Administrador
const AdminDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} role="admin" />}
    screenOptions={{ headerShown: true }}
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Clientes" component={ClientesScreen} />
    <Drawer.Screen name="Barberos" component={BarberosScreen} />
    <Drawer.Screen name="Roles" component={RolesScreen} />
    <Drawer.Screen name="Compras" component={ComprasScreen} />
    <Drawer.Screen name="Proveedores" component={ProveedoresScreen} />
    <Drawer.Screen name="Insumos" component={InsumosScreen} />
    <Drawer.Screen name="CategoriaInsumos" component={CategoriaInsumosScreen} />
    <Drawer.Screen name="Agenda" component={AgendaScreen} />
    <Drawer.Screen name="Citas" component={CitasScreen} />
    <Drawer.Screen name="Servicios" component={ServiciosScreen} />
    <Drawer.Screen name="Movimientos" component={MovimientosScreen} />
    <Drawer.Screen name="Ventas" component={VentasScreen} />
    <Drawer.Screen name="ControlInsumos" component={ControlInsumos} />
  </Drawer.Navigator>
);

// Drawer para Barberos (sin Dashboard)
const BarberDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} role="barber" />}
    screenOptions={{ headerShown: true }}
  >
    <Drawer.Screen name="Clientes" component={ClientesScreen} />
    <Drawer.Screen name="Agenda" component={AgendaScreen} />
    <Drawer.Screen name="Citas" component={CitasScreen} />
    <Drawer.Screen name="Movimientos" component={MovimientosScreen} />
    <Drawer.Screen name="Ventas" component={VentasScreen} />
  </Drawer.Navigator>
);

// Drawer para Clientes (sin Dashboard)
const ClientDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} role="client" />}
    screenOptions={{ headerShown: true }}
  >
    <Drawer.Screen name="Agenda" component={AgendaScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => {
  const { isLoading, userToken, userRole } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userToken ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {userRole === 'Administrador' && (
              <Stack.Screen name="Main" component={AdminDrawer} />
            )}
            {userRole === 'Barbero' && (
              <Stack.Screen name="Main" component={BarberDrawer} />
            )}
            {userRole === 'Cliente' && (
              <Stack.Screen name="Main" component={ClientDrawer} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;