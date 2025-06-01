import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {
            const isValid = await checkTokenValidity();
            setIsLoggedIn(isValid);
            setIsLoading(false);
        };
        checkLogin();
    }, []);

    const login = async (newToken) => {
        await AsyncStorage.setItem('token', newToken);
        setToken(newToken);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
    };

    const checkTokenValidity = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return false;

        try {
            const { exp } = jwtDecode(token)
            const now = Math.floor(Date.now() / 1000);
            return exp && exp > now;
        } catch (error) {
            console.warn('Token Invalido', error)
            return false
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
