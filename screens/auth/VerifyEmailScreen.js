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
  } from 'react-native';
  import { MaterialIcons } from '@expo/vector-icons';
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
          console.warn('URL inválida:', event.url);
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

    // Si tenemos email y código en los params, verificamos automáticamente
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
        const msg = error.response?.data?.mensaje || 'No se pudo verificar la cuenta';
        Alert.alert('Error', msg);
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verifica tu correo electrónico</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos que enviamos a:
        </Text>
        <Text style={styles.emailText}>{email || '...'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de verificación"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus={true}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verificar Cuenta</Text>
          )}
        </TouchableOpacity>

        {/* Modal de verificación exitosa */}
        <Modal visible={isVerified} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
              <Text style={styles.modalTitle}>¡Verificación exitosa!</Text>
              <Text style={styles.modalText}>
                Tu cuenta ha sido verificada correctamente.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsVerified(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.modalButtonText}>Ir a inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 22,
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
    },
    emailText: {
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 25,
      color: '#424242',
    },
    input: {
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
      backgroundColor: '#424242',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
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
      padding: 25,
      width: '85%',
      maxWidth: 350,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
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
    modalButton: {
      backgroundColor: '#424242',
      borderRadius: 8,
      padding: 12,
      paddingHorizontal: 30,
      width: '100%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  export default VerifyEmailScreen;