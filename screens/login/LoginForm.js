import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

const LoginForm = () => {
    // Estados para el login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    
    // Estados para recuperación de contraseña
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryError, setRecoveryError] = useState('');
    const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
    const [showCodeVerificationModal, setShowCodeVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordResetError, setPasswordResetError] = useState('');

    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setLoginError('Por favor, ingresa correo y contraseña.');
            return;
        }

        setIsLoading(true);
        setLoginError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email,
                password
            });

            const data = response.data;

            if (!data.success) {
                console.log(data)
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

    const handlePasswordRecovery = async () => {
        if (!recoveryEmail) {
            setRecoveryError('Por favor, ingresa tu correo electrónico.');
            return;
        }

        setIsRecoveryLoading(true);
        setRecoveryError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/recover-password', {
                email: recoveryEmail
            });

            if (response.data.mensaje) {
                Alert.alert(
                    'Código enviado',
                    'Hemos enviado un código de verificación a tu correo electrónico.',
                    [
                        { text: 'OK', onPress: () => {
                            setShowRecoveryModal(false);
                            setShowCodeVerificationModal(true);
                        }}
                    ]
                );
            }
        } catch (error) {
            console.error('Error al solicitar recuperación:', error);
            setRecoveryError(error.response?.data?.mensaje || 'No se pudo enviar el código de recuperación.');
        } finally {
            setIsRecoveryLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!verificationCode || !newPassword || !confirmNewPassword) {
            setPasswordResetError('Todos los campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordResetError('Las contraseñas no coinciden.');
            return;
        }

        setIsRecoveryLoading(true);
        setPasswordResetError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/verify-recover-password', {
                email: recoveryEmail,
                codigo: verificationCode,
                password: newPassword
            });

            if (response.data.mensaje) {
                Alert.alert(
                    'Contraseña actualizada',
                    'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
                    [
                        { text: 'OK', onPress: () => {
                            setShowCodeVerificationModal(false);
                            setRecoveryEmail('');
                            setVerificationCode('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                        }}
                    ]
                );
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            setPasswordResetError(error.response?.data?.mensaje || 'No se pudo cambiar la contraseña. Verifica el código e intenta nuevamente.');
        } finally {
            setIsRecoveryLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
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
                    <Text style={styles.errorText}>
                        {loginError}
                    </Text>
                )}

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.forgotPasswordButton}
                    onPress={() => {
                        setRecoveryEmail('');
                        setRecoveryError('');
                        setShowRecoveryModal(true);
                    }}
                >
                    <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
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
                                Estamos aquí para ayudarte. Proporciona tu correo electrónico y te enviaremos un código de verificación.
                            </Text>

                            <Text style={styles.inputLabel}>Email *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="nombre@dominio.com"
                                placeholderTextColor="#808080"
                                value={recoveryEmail}
                                onChangeText={setRecoveryEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            {recoveryError !== '' && (
                                <Text style={styles.errorText}>
                                    {recoveryError}
                                </Text>
                            )}

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.submitButton]}
                                    onPress={handlePasswordRecovery}
                                    disabled={isRecoveryLoading}
                                >
                                    <Text style={[styles.modalButtonText, styles.submitButtonText]}>
                                        {isRecoveryLoading ? 'Enviando...' : 'Enviar código'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowRecoveryModal(false);
                                        setRecoveryError('');
                                    }}
                                    disabled={isRecoveryLoading}
                                >
                                    <Text style={styles.modalButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showCodeVerificationModal}
                    onRequestClose={() => setShowCodeVerificationModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Restablecer contraseña</Text>
                            <Text style={styles.modalSubtitle}>
                                Hemos enviado un código de verificación a {recoveryEmail}. Ingresa el código y tu nueva contraseña.
                            </Text>

                            <Text style={styles.inputLabel}>Código de verificación *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="123456"
                                placeholderTextColor="#808080"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                            />

                            <Text style={styles.inputLabel}>Nueva contraseña *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="●●●●●●●●"
                                placeholderTextColor="#808080"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={true}
                            />

                            <Text style={styles.inputLabel}>Confirmar nueva contraseña *</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="●●●●●●●●"
                                placeholderTextColor="#808080"
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                                secureTextEntry={true}
                            />

                            {passwordResetError !== '' && (
                                <Text style={styles.errorText}>
                                    {passwordResetError}
                                </Text>
                            )}

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.submitButton]}
                                    onPress={handlePasswordReset}
                                    disabled={isRecoveryLoading}
                                >
                                    <Text style={[styles.modalButtonText, styles.submitButtonText]}>
                                        {isRecoveryLoading ? 'Procesando...' : 'Cambiar contraseña'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowCodeVerificationModal(false);
                                        setPasswordResetError('');
                                    }}
                                    disabled={isRecoveryLoading}
                                >
                                    <Text style={styles.modalButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={isLoading || isRecoveryLoading}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.loadingModal}>
                        <View style={styles.loadingContent}>
                            <Text style={styles.loadingText}>
                                {isRecoveryLoading ? 'Procesando tu solicitud...' : 'Iniciando sesión...'}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
    formContainer: {
        width: isDesktop ? 400 : '90%',
        maxWidth: 400,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: isDesktop ? 28 : (isMobile ? 24 : 26),
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        color: '#808080',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    inputLabel: {
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        color: '#000',
        marginBottom: 8,
        fontWeight: '700',
    },
    input: {
        height: isDesktop ? 50 : (isMobile ? 45 : 48),
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        height: isDesktop ? 50 : (isMobile ? 45 : 48),
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        paddingHorizontal: 15,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        height: isDesktop ? 50 : (isMobile ? 45 : 48),
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: isDesktop ? 18 : (isMobile ? 16 : 17),
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        marginTop: 15,
    },
    forgotPassword: {
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        color: '#000',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    registerButton: {
        marginTop: 10,
    },
    registerText: {
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
        color: '#000',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red', 
        textAlign: 'center', 
        marginTop: 10,
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: isDesktop ? 20 : (isMobile ? 18 : 19),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: isDesktop ? 14 : (isMobile ? 13 : 14),
        color: '#808080',
        textAlign: 'left',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalInput: {
        height: isDesktop ? 50 : (isMobile ? 45 : 48),
        fontSize: isDesktop ? 16 : (isMobile ? 14 : 15),
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
    loadingModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loadingContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    loadingText: {
        fontSize: isDesktop ? 18 : (isMobile ? 16 : 17),
        marginBottom: 10
    },
});

export default LoginForm;