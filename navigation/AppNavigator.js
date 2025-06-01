import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/login/LoginScreen';
import HomeScreen from '../screens/dashboard/DashboardScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CustomDrawer from '../components/CustomDrawer';
import { AuthContext } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// IMPORTAR PANTALLAS EXTRAS
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
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
  </Drawer.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          <Stack.Screen 
            name="ControlInsumos" 
            component={ControlInsumos}
            options={{ headerShown: true, title: 'Control de Insumos' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;