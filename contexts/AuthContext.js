import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {
            const savedToken = await AsyncStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
                setIsLoggedIn(true);
            }
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

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
