import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const now = Math.floor(Date.now() / 1000);
                    
                    if (decoded.exp && decoded.exp > now) {
                        setUserToken(token);
                        await fetchUserInfo(token);
                    } else {
                        await logout();
                    }
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get('http://localhost:8080/auth/verify-token', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                const { email } = jwtDecode(token);
                const userResponse = await axios.get(`http://localhost:8080/usuarios?email=${email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setUserInfo(userResponse.data);
                setUserRole(userResponse.data.rol);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            await logout();
        }
    };

    const login = async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
            setUserToken(token);
            await fetchUserInfo(token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setUserToken(null);
            setUserInfo(null);
            setUserRole(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

// AuthContext.js
const register = async (email, password, userData) => {
    try {
        const response = await axios.post('http://localhost:8080/auth/register', {
            email,
            password,
            ...userData
        });
        
        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Error al registrarse';
        
        // Manejo de errores específicos
        if (error.response) {
            if (error.response.data.message === "El correo ya está registrado") {
                errorMessage = "Este correo ya está registrado";
            } else if (error.response.data.message.includes("Rol Cliente no configurado")) {
                errorMessage = "Error en la configuración del sistema";
            }
        }
        
        throw new Error(errorMessage);
    }
};

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                userInfo,
                userRole,
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};