import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Modal } from 'react-native';
import { BlurView } from 'expo-blur';

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onCancel,
  onConfirm,
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
  >
    {/* ---------- Fondo con blur ---------- */}
    <BlurView
      intensity={20}
      tint="dark"
      style={styles.overlay}
    >
      {/* ---------- Caja ---------- */}
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelTxt}>{cancelLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmTxt}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  </Modal>
);

export default ConfirmModal;

const styles = StyleSheet.create({
  /* ---------- overlay ---------- */
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---------- caja ---------- */
  modal: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },

  /* ---------- textos ---------- */
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 10,
  },
  message: {
    fontSize: 17,
    color: '#616161',
    marginBottom: 28,
  },

  /* ---------- botones ---------- */
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#424242',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  cancelTxt: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
  },
  confirmTxt: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
