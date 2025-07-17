import React, { createContext, useState, useEffect, useCallback } from "react";
import { Platform, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8080' 
  : 'http://localhost:8080';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    token: null,
    user: null,
    userRole: null,
    clientData: null,
    barberData: null
  });

  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;
    return rawRole === "Paciente" ? "Cliente" : rawRole;
  };

  const checkTokenValidity = useCallback(async (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        return { valid: true, decoded };
      }
      return { valid: false };
    } catch (err) {
      console.warn("Token inválido:", err);
      return { valid: false };
    }
  }, []);

  const loadUserData = useCallback(async (userId, userRole) => {
    try {
      if (userRole === 'Cliente') {
        const { data } = await axios.get(`${BASE_URL}/clientes/usuario/${userId}`);
        return { clientData: data };
      } else if (userRole === 'Barbero') {
        const { data } = await axios.get(`${BASE_URL}/barberos/usuario/${userId}`);
        return { barberData: data };
      }
      return {};
    } catch (error) {
      console.error("Error cargando datos adicionales:", error);
      return {};
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (!savedToken) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { valid, decoded } = await checkTokenValidity(savedToken);
      if (!valid) {
        await AsyncStorage.removeItem("token");
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const userRole = normalizeRole(decoded?.rol?.nombre);
      const additionalData = await loadUserData(decoded.userId, userRole);

      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        token: savedToken,
        user: decoded,
        userRole,
        ...additionalData
      });
    } catch (err) {
      console.error("Error inicializando auth:", err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [checkTokenValidity, loadUserData]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (token, additionalData = {}) => {
    try {
      const { decoded } = await checkTokenValidity(token);
      if (!decoded) throw new Error("Token inválido");

      await AsyncStorage.setItem("token", token);
      const userRole = normalizeRole(decoded?.rol?.nombre);
      const userData = await loadUserData(decoded.userId, userRole);

      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        token,
        user: decoded,
        userRole,
        ...userData,
        ...additionalData
      });

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setAuthState({
        isLoading: false,
        isLoggedIn: false,
        token: null,
        user: null,
        userRole: null,
        clientData: null,
        barberData: null
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const verifyAccount = async (email, code) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-account`, {
        email,
        codigo: code
      });

      if (response.data.token) {
        // Guardamos el token en AsyncStorage
        await AsyncStorage.setItem("token", response.data.token);
        
        // Decodificamos el token para obtener la información del usuario
        const decoded = jwtDecode(response.data.token);
        const userRole = normalizeRole(decoded?.rol?.nombre);
        
        // Actualizamos el estado de autenticación
        setAuthState({
          isLoading: false,
          isLoggedIn: true,
          token: response.data.token,
          user: decoded,
          userRole,
          clientData: response.data.cliente || null,
          barberData: response.data.barbero || null
        });

        return { 
          success: true,
          message: 'Cuenta verificada exitosamente',
          rol: userRole
        };
      }
      return { success: false, message: 'No se recibió token' };
    } catch (error) {
      console.error("Error en verifyAccount:", error);
      return { 
        success: false, 
        message: error.response?.data?.mensaje || 'Error al verificar la cuenta' 
      };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
      return response.data;
    } catch (error) {
      console.error("Error en resendVerificationCode:", error);
      throw new Error(error.response?.data?.mensaje || 'Error al reenviar el código');
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    verifyAccount,
    resendVerificationCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};