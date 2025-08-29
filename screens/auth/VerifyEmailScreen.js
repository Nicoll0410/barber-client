import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import InfoModal from '../components/InfoModal';

// Usar la variable de entorno para la URL base o una por defecto
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://barber-server-6kuo.onrender.com';

const VerifyEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState(route.params?.email || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info'); // 'info', 'success', 'error'

  // Manejar parámetros de URL para verificación automática
  useEffect(() => {
    const checkParams = async () => {
      const { params } = route;
      
      // Si llegamos con parámetros de éxito desde verificación por email
      if (params?.success === 'true' && params?.verified === 'true' && params?.email) {
        setIsVerified(true);
        setEmail(params.email);
        
        // Mostrar modal de éxito
        showModal('¡Éxito!', 'Tu cuenta ha sido verificada correctamente.', 'success');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigation.navigate('Login', { 
            verifiedEmail: params.email,
            message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' 
          });
        }, 3000);
      }
      
      // Si llegamos con error desde verificación por email
      if (params?.error && params?.email) {
        setEmail(params.email);
        const errorMessage = params.error === 'Codigo expirado' 
          ? 'El código ha expirado. Por favor solicita uno nuevo.' 
          : params.error;
        showModal('Error', errorMessage, 'error');
      }
      
      // Si llegamos con código desde el enlace de email
      if (params?.code) {
        setCode(params.code);
      }
    };

    checkParams();
  }, [route.params]);

  // Función para mostrar el modal
  const showModal = (title, message, type = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Redirigir después de verificación exitosa
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        navigation.navigate('Login', { 
          verifiedEmail: email,
          message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' 
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigation, email]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      showModal('Error', 'Por favor ingresa un código válido de 6 dígitos', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-account`, {
        email,
        codigo: code,
      });

      if (response.data.success) {
        setIsVerified(true);
        showModal('¡Éxito!', 'Tu cuenta ha sido verificada correctamente.', 'success');
      } else {
        showModal('Error', response.data.mensaje || 'Error al verificar la cuenta', 'error');
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      const errorMessage = error.response?.data?.mensaje || 
                          error.message || 
                          'No se pudo verificar la cuenta. Revisa tu conexión.';
      
      showModal('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      setResendLoading(true);
      const response = await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
      
      if (response.data.success) {
        showModal('Éxito', 'Se ha enviado un nuevo código de verificación a tu email.', 'success');
      } else {
        showModal('Error', response.data.mensaje || 'Error al reenviar el código', 'error');
      }
    } catch (error) {
      console.error('Error al reenviar código:', error);
      const errorMessage = error.response?.data?.mensaje || 
                          'No se pudo reenviar el código de verificación';
      
      showModal('Error', errorMessage, 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (isVerified) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image 
            source={require('../../assets/images/newYorkBarber.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>¡Verificación Exitosa!</Text>
          <Text style={styles.subtitle}>
            Tu cuenta ha sido verificada correctamente. Serás redirigido al login...
          </Text>
          <ActivityIndicator size="large" color="#424242" style={styles.loader} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image 
            source={require('../../assets/images/newYorkBarber.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Verifica tu correo electrónico</Text>
          
          <Text style={styles.subtitle}>
            Hemos enviado un código de 6 dígitos a:
          </Text>
          
          <Text style={styles.emailText}>{email}</Text>

          <TextInput
            style={styles.input}
            placeholder="Código de verificación"
            placeholderTextColor="#999"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, (loading || code.length !== 6) && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verificar Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resendButton, resendLoading && styles.buttonDisabled]}
            onPress={resendCode}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <ActivityIndicator color="#424242" />
            ) : (
              <Text style={styles.resendText}>¿No recibiste el código? Reenviar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Si tienes problemas con la verificación, contacta a soporte.
          </Text>
        </View>
      </ScrollView>

      {/* Modal de información */}
      <InfoModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={closeModal}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 25,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#424242',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#424242',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#424242',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    padding: 10,
    marginBottom: 10,
  },
  resendText: {
    color: '#424242',
    textDecorationLine: 'underline',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default VerifyEmailScreen;