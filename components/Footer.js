import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>© 2025</Text>
        
        <View style={styles.authors}>
          <TouchableOpacity style={styles.authorLink}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={[styles.text, styles.highlight]}> Nicoll Andrea Giraldo Franco.</Text>
          </TouchableOpacity>
          
          <Text style={styles.text}> | </Text>
          
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  authors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    flexWrap: 'wrap',
  },
  authorLink: {
    flexDirection: 'row',
    alignItems: 'center',
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