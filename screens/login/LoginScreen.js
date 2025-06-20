// LoginScreen.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import LoginForm from './LoginForm';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mobileContent}>
            <Image 
              source={require('../../assets/images/newYorkBarber.jpeg')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <LoginForm />
          </View>
          <View style={styles.footerContainer}>
            <Footer />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.desktopContainer}>
          <View style={styles.desktopContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/newYorkBarber.jpeg')} 
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>
            <LoginForm />
          </View>
          <View style={styles.desktopFooter}>
            <Footer />
          </View>
        </View>
      )}
    </View>
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
  mobileContent: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  desktopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  desktopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1200, // Aumenté el ancho máximo para más espacio
    flex: 1,
  },
  logoContainer: {
    marginRight: isDesktop ? 120 : 80, // Aumenté estos valores para mover más a la derecha
    marginLeft: isDesktop ? 80 : 40,   // Aumenté el margen izquierdo
    width: isDesktop ? 300 : 200,      // Ajusté el ancho del contenedor
  },
  logo: {
    width: '100%',
    height: isDesktop ? 300 : 200,
    marginBottom: isMobile ? 20 : 0,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  desktopFooter: {
    width: '100%',
    maxWidth: 1200,
    paddingBottom: 40,
    alignSelf: 'center',
  }
});

export default LoginScreen;