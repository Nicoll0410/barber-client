import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { BlurView } from 'expo-blur';

const InfoModal = ({
  visible,
  title,
  message,
  buttonLabel = 'Aceptar',
  onClose,
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onClose}
  >
    <BlurView intensity={20} tint="dark" style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.okBtn} onPress={onClose}>
          <Text style={styles.okTxt}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  </Modal>
);

export default InfoModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modal: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#424242', marginBottom: 10 },
  message: { fontSize: 17, color: '#616161', marginBottom: 28 },
  okBtn: {
    backgroundColor: '#424242',
    paddingVertical: 10,
    borderRadius: 6,
  },
  okTxt: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
