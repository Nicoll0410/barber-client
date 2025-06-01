import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setLoginError('Por favor, ingresa correo y contraseña.');
            return;
        }

        setIsLoading(true);
        setLoginError('');

        try {
            const response = await axios.post('http://192.168.1.7:8080/auth/login', {
                email,
                password
            });

            const data = response.data;

            if (!data.success) {
                switch (data.reason) {
                case 'USER_NOT_FOUND':
                    setLoginError('Usuario no registrado.');
                    break;
                case 'INVALID_PASSWORD':
                    setLoginError('Contraseña incorrecta.');
                    break;
                case 'NOT_VERIFIED':
                    setLoginError('Tu cuenta aún no ha sido verificada.');
                    break;
                case 'UNAUTHORIZED_ROLE':
                    setLoginError('No tienes permiso para acceder a esta sección.');
                    break;
                default:
                    setLoginError('Error desconocido. Intenta nuevamente.');
                    break;
                }
                return;
            }

            // Login exitoso
            const { token } = data;
            login(token);

        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setLoginError('No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Accede a tu cuenta de trabajo</Text>
            <Text style={styles.subtitle}>Inicia sesión para gestionar y aprovechar todas las funcionalidades disponibles.</Text>

            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
                style={styles.input}
                placeholder="nombre@dominio.com"
                placeholderTextColor="#808080"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Contraseña *</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="●●●●●●●●"
                    placeholderTextColor="#808080"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={togglePasswordVisibility}
                >
                    <Ionicons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#808080" 
                    />
                </TouchableOpacity>
            </View>

            {loginError !== '' && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                    {loginError}
                </Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowRecoveryModal(true)}>
                <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showRecoveryModal}
                onRequestClose={() => setShowRecoveryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>¿Olvidaste tu contraseña?</Text>
                        <Text style={styles.modalSubtitle}>
                            Estamos aquí para ayudarte. Proporciona tu correo electrónico y le enviaremos un enlace de recuperación de contraseña
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="nombre@dominio.com"
                            placeholderTextColor="#808080"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.modalButton, styles.submitButton]}>
                                <Text style={[styles.modalButtonText, styles.submitButtonText]}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowRecoveryModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isLoading}
                transparent={true}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 10,
                    }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>Iniciando sesión...</Text>
                    </View>
                </View>
            </Modal>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: 'auto',
        maxWidth: 'auto',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        color: '#808080',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        fontWeight: '700',
    },
    input: {
        height: 50,
        fontSize: 18,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        height: 50,
        fontSize: 18,
        paddingHorizontal: 15,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPassword: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '50%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'left',
        marginBottom: 20,
    },
    modalInput: {
        height: 50,
        fontSize: 16,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
    },
    submitButton: {
        backgroundColor: '#000',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    submitButtonText: {
        color: '#fff',
    },
});

export default LoginForm;