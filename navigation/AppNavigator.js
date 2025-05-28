// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomDrawer from '../components/CustomDrawer';

// IMPORTAR PANTALLAS EXTRAS
import ClientesScreen from '../screens/clientes/ClientesScreen';
import BarberosScreen from '../screens/barberos/BarberosScreen';
import RolesScreen from '../screens/roles/RolesScreen';
import ComprasScreen from '../screens/compras/ComprasScreen';

import ProveedoresScreen from '../screens/proveedores/ProveedoresScreen';
import InsumosScreen from '../screens/insumos/InsumosScreen';
import CategoriaInsumosScreen from '../screens/categoria insumos/CategoriaInsumosScreen';

import AgendaScreen from '../screens/AgendaScreen';
import CitasScreen from '../screens/citas/CitasScreen';
import ServiciosScreen from '../screens/servicios/ServiciosScreen';
import MovimientosScreen from '../screens/movimientos/MovimientosScreen';
import VentasScreen from '../screens/ventas/VentasScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{ headerShown: true }} // puedes ocultar si ya tienes headers personalizados
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    
    {/* Usuarios */}
    <Drawer.Screen name="Clientes" component={ClientesScreen} />
    <Drawer.Screen name="Barberos" component={BarberosScreen} />
    <Drawer.Screen name="Roles" component={RolesScreen} />
    {/* Compras */}
    <Drawer.Screen name="Compras" component={ComprasScreen} />
    <Drawer.Screen name="Proveedores" component={ProveedoresScreen} />
    <Drawer.Screen name="Insumos" component={InsumosScreen} />
    <Drawer.Screen name="CategoriaInsumos" component={CategoriaInsumosScreen} />
    {/* Ventas */}
    <Drawer.Screen name="Agenda" component={AgendaScreen} />
    <Drawer.Screen name="Citas" component={CitasScreen} />
    <Drawer.Screen name="Servicios" component={ServiciosScreen} />
    <Drawer.Screen name="Movimientos" component={MovimientosScreen} />
    <Drawer.Screen name="Ventas" component={VentasScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;