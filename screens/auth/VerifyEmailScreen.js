import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

const VerifyEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState(route.params?.email || '');
  const [code, setCode] = useState(route.params?.code || '');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Redirigir después de verificación exitosa
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        setIsVerified(false);
        navigation.navigate('Login', { verifiedEmail: email });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigation, email]);

  // Manejo de deep linking
  useEffect(() => {
    const handleDeepLink = (event) => {
      try {
        const url = new URL(event.url);
        const params = Object.fromEntries(url.searchParams.entries());
        if (params.email && params.code) {
          setEmail(params.email);
          setCode(params.code);
        }
      } catch (error) {
        console.warn('Error procesando URL:', error);
      }
    };

    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink({ url });
    };

    const listener = Linking.addEventListener('url', handleDeepLink);
    getInitialUrl();

    return () => {
      listener.remove();
    };
  }, []);

  // Verificación automática si vienen parámetros
  useEffect(() => {
    if (email && code && code.length === 6) {
      handleVerify();
    }
  }, [email, code]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Por favor ingresa un código válido de 6 dígitos');
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
      } else {
        Alert.alert('Error', response.data.mensaje || 'Error al verificar la cuenta');
      }
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'No se pudo verificar la cuenta';
      
      if (errorData) {
        if (errorData.mensaje) {
          errorMessage = errorData.mensaje;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          
          <Text style={styles.emailText}>{email || 'correo@ejemplo.com'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Código de verificación"
            placeholderTextColor="#999"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus={true}
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
        </View>
      </ScrollView>

      {/* Modal de verificación exitosa */}
      <Modal visible={isVerified} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image 
              source={require('../../assets/images/newYorkBarber.jpeg')}
              style={styles.modalLogo}
              resizeMode="contain"
            />
            <Text style={styles.modalTitle}>¡Verificación exitosa!</Text>
            <Text style={styles.modalText}>
              Tu cuenta ha sido verificada correctamente.
            </Text>
            <ActivityIndicator size="small" color="#424242" style={styles.modalLoader} />
          </View>
        </View>
      </Modal>
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
  modalLogo: {
    width: 150,
    height: 75,
    marginBottom: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#424242',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalLoader: {
    marginTop: 10,
  },
});

export default VerifyEmailScreen;