import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Footer = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Tablet/móvil
  const insets = useSafeAreaInsets(); // Para manejar áreas seguras en dispositivos

  return (
    <View style={[
      styles.container, 
      isMobile && styles.mobileContainer,
      isMobile && { paddingBottom: insets.bottom } // Añade padding para el área segura
    ]}>
      <View style={styles.content}>
        <Text style={styles.text}>© 2025.</Text>

        <View style={[styles.authors, isMobile && styles.authorsMobile]}>
          <TouchableOpacity style={styles.authorLink}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={[styles.text, styles.highlight]}> Nicoll Andrea Giraldo Franco.</Text>
          </TouchableOpacity>

          {!isMobile && <Text style={styles.text}> | </Text>}

          <TouchableOpacity style={styles.authorLink}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={[styles.text, styles.highlight]}> Luis Miguel Chica Ruíz.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileContainer: {
    position: 'fixed', // Cambiado de 'absolute' a 'fixed' para que se mantenga en su lugar
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Aumentado el zIndex para asegurar que esté por encima
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  authors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  authorsMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 4,
    marginTop: 2,
  },
  authorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  text: {
    fontSize: 13,
    color: '#6c757d',
  },
  highlight: {
    color: '#424242',
    fontWeight: '500',
  },
});

export default Footer;