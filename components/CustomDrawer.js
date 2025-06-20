import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome5, MaterialIcons, Feather, Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

const CustomDrawer = (props) => {
  const { role } = props;
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [purchasesExpanded, setPurchasesExpanded] = useState(false);
  const [salesExpanded, setSalesExpanded] = useState(false);
  const { logout, userInfo } = useContext(AuthContext);

  const renderSubItem = (label, screen, IconComponent, iconName) => (
    <TouchableOpacity
      style={styles.subItem}
      onPress={() => props.navigation.navigate(screen)}
    >
      <IconComponent name={iconName} size={16} color="#fff" />
      <Text style={styles.subItemText}>{label}</Text>
    </TouchableOpacity>
  );

  // Renderizar menú basado en el rol
  const renderMenuItems = () => {
    switch(role) {
      case 'Administrador':
        return (
          <>
            {/* Dashboard solo para admin */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => props.navigation.navigate('Dashboard')}
            >
              <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="white" />
              <Text style={styles.menuText}>Dashboard</Text>
            </TouchableOpacity>

            {/* Menú Usuarios */}
            <TouchableOpacity
              style={styles.expandableItem}
              onPress={() => setUsersExpanded(!usersExpanded)}
            >
              <View style={styles.menuRow}>
                <Feather name="users" size={24} color="white" />
                <Text style={styles.menuText}>Usuarios</Text>
              </View>
              <Feather name={usersExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
            </TouchableOpacity>
            {usersExpanded && (
              <>
                {renderSubItem('Clientes', 'Clientes', Feather, 'user')}
                {renderSubItem('Barberos', 'Barberos', Ionicons, 'cut-outline')}
                {renderSubItem('Roles', 'Roles', Ionicons, 'key-outline')}
              </>
            )}

            {/* Menú Compras */}
            <TouchableOpacity
              style={styles.expandableItem}
              onPress={() => setPurchasesExpanded(!purchasesExpanded)}
            >
              <View style={styles.menuRow}>
                <AntDesign name="shoppingcart" size={24} color="white" />
                <Text style={styles.menuText}>Compras</Text>
              </View>
              <Feather name={purchasesExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
            </TouchableOpacity>
            {purchasesExpanded && (
              <>
                {renderSubItem('Compras', 'Compras', AntDesign, 'shoppingcart')}
                {renderSubItem('Proveedores', 'Proveedores', MaterialCommunityIcons, 'toolbox-outline')}
                {renderSubItem('Insumos', 'Insumos', MaterialCommunityIcons, 'spray')}
                {renderSubItem('Categoría Insumos', 'CategoriaInsumos', MaterialCommunityIcons, 'database-arrow-left-outline')}
              </>
            )}

            {/* Menú Ventas */}
            <TouchableOpacity
              style={styles.expandableItem}
              onPress={() => setSalesExpanded(!salesExpanded)}
            >
              <View style={styles.menuRow}>
                <MaterialCommunityIcons name="account-cash-outline" size={24} color="white" />
                <Text style={styles.menuText}>Ventas</Text>
              </View>
              <Feather name={salesExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
            </TouchableOpacity>
            {salesExpanded && (
              <>
                {renderSubItem('Agenda', 'Agenda', MaterialIcons, 'event')}
                {renderSubItem('Citas', 'Citas', Ionicons, 'calendar-outline')}
                {renderSubItem('Servicios', 'Servicios', MaterialCommunityIcons, 'toolbox-outline')}
                {renderSubItem('Movimientos', 'Movimientos', FontAwesome5, 'exchange-alt')}
                {renderSubItem('Ventas', 'Ventas', Ionicons, 'cash-outline')}
                {renderSubItem('Control Insumos', 'ControlInsumos', MaterialCommunityIcons, 'clipboard-check-outline')}
              </>
            )}
          </>
        );
      
      case 'Barbero':
        return (
          <>
            {/* Menú principal para barberos */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => props.navigation.navigate('Clientes')}
            >
              <Feather name="users" size={24} color="white" />
              <Text style={styles.menuText}>Clientes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.expandableItem}
              onPress={() => setSalesExpanded(!salesExpanded)}
            >
              <View style={styles.menuRow}>
                <MaterialCommunityIcons name="account-cash-outline" size={24} color="white" />
                <Text style={styles.menuText}>Operaciones</Text>
              </View>
              <Feather name={salesExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
            </TouchableOpacity>
            {salesExpanded && (
              <>
                {renderSubItem('Agenda', 'Agenda', MaterialIcons, 'event')}
                {renderSubItem('Citas', 'Citas', Ionicons, 'calendar-outline')}
                {renderSubItem('Movimientos', 'Movimientos', FontAwesome5, 'exchange-alt')}
                {renderSubItem('Ventas', 'Ventas', Ionicons, 'cash-outline')}
              </>
            )}
          </>
        );
      
      case 'Cliente':
        return (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Agenda')}
          >
            <MaterialIcons name="event" size={24} color="white" />
            <Text style={styles.menuText}>Agenda</Text>
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/newYorkBarber.jpeg')} style={styles.logo} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.sectionTitle}>Menú</Text>
        
        {renderMenuItems()}
      </DrawerContentScrollView>

      {/* PERFIL */}
      <View style={styles.profileContainer}>
        <Text style={styles.profileTitle}>Perfil</Text>
        <View style={styles.profileInfo}>
          <Image 
            source={userInfo?.avatar ? { uri: userInfo.avatar } : require('../assets/avatar.png')} 
            style={styles.avatar} 
          />
          <View style={styles.profileDetails}>
            <Text style={styles.role}>{role}</Text>
            <Text style={styles.email}>{userInfo?.email || 'usuario@email.com'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Feather name="log-out" size={18} color="black" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#222',
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#fff',
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingVertical: 8,
  },
  subItemText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#fff',
  },
  profileContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#222',
    backgroundColor: '#000',
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileDetails: {
    flex: 1,
  },
  role: {
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    color: '#fff',
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'flex-start',
    width: '100%',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'black',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  expandableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomDrawer;