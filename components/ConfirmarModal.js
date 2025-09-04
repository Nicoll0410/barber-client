import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const ConfirmarModal = ({
  visible,
  onCancel,
  onConfirm,
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que quieres realizar esta acción?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  tipo = "normal", // normal, peligro
  icono = "question" // question, danger, warning
}) => {
  const getIcon = () => {
    switch (icono) {
      case 'danger':
        return <MaterialIcons name="error-outline" size={32} color="#F44336" />;
      case 'warning':
        return <MaterialIcons name="warning" size={32} color="#FF9800" />;
      default:
        return <MaterialIcons name="help-outline" size={32} color="#2196F3" />;
    }
  };

  const getConfirmButtonStyle = () => {
    return tipo === 'peligro' 
      ? styles.confirmButtonDanger 
      : styles.confirmButtonNormal;
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Icono */}
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>

            {/* Título */}
            <Text style={styles.titulo}>{titulo}</Text>
            
            {/* Mensaje */}
            <Text style={styles.mensaje}>{mensaje}</Text>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <TouchableOpacity 
                style={[styles.boton, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{textoCancelar}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.boton, getConfirmButtonStyle()]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>{textoConfirmar}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  mensaje: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  confirmButtonNormal: {
    backgroundColor: '#424242',
  },
  confirmButtonDanger: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    color: '#424242',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ConfirmarModal;