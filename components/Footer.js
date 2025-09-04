import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FOOTER_HEIGHT = 50; // Altura aprox. del footer (usada también en el mainContent)

const Footer = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Tablet/móvil
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={[
        styles.container,
        isMobile ? styles.mobileContainer : styles.desktopContainer,
        isWeb && !isMobile && styles.webDesktopContainer
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>© 2025.</Text>

        <View style={[styles.authors, isMobile && styles.authorsMobile]}>
          <TouchableOpacity style={styles.authorLink}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={[styles.text, styles.highlight]}>
              {" "}Nicoll Andrea Giraldo Franco.
            </Text>
          </TouchableOpacity>

          {!isMobile && <Text style={styles.text}> | </Text>}

          <TouchableOpacity style={styles.authorLink}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={[styles.text, styles.highlight]}>
              {" "}Luis Miguel Chica Ruíz.
            </Text>
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
  desktopContainer: {
    position: 'relative',
  },
  webDesktopContainer: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mobileContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    zIndex: 100,
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

export { FOOTER_HEIGHT };
export default Footer;