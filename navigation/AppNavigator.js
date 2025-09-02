// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

/* Custom Drawer Navigator */
import CustomDrawerNavigator from "./CustomDrawerNavigator";
import { AuthContext } from "../contexts/AuthContext";

/* Rutas privadas extra */
import ControlInsumos from "../screens/insumos/ControlInsumos";

/* Logo */
import LogoImg from "../assets/images/barberApp 1.png";

const Stack = createNativeStackNavigator();

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
  const logoSize = isLargeScreen ? 180 : 140;

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
          <Stack.Screen name="MainDrawer" component={CustomDrawerNavigator} />
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
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Notificaciones"
            component={NotificacionesScreen}
            options={{ 
              headerShown: true, 
              title: "Notificaciones",
              headerRight: () => <HeaderLogo />
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;