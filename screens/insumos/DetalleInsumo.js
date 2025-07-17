import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

/* ---------- Utilidad para obtener nombre de categoría ---------- */
const getCategoriaNombre = (item = {}, categorias = []) => {
  if (!item) return 'Sin categoría';

  // 1) Viene anidada desde backend
  if (item.categorias_insumo?.nombre) return item.categorias_insumo.nombre;

  // 2) Otras posibles llaves
  if (item.categoria?.nombre) return item.categoria.nombre;
  if (item.categorium?.nombre) return item.categorium.nombre;
  if (item.categoriaNombre) return item.categoriaNombre;

  // 3) Buscar por ID
  const possibleId =
    item.categoriaID ??
    item.categoriaId ??
    item.idCategoria ??
    item.categoria_id ??
    null;

  const encontrada = categorias.find((c) => c.id === possibleId);
  return encontrada ? encontrada.nombre : 'Sin categoría';
};

const DetalleInsumo = ({
  visible,
  onClose,
  insumo,
  categoriasExistentes = [],
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const categoria = getCategoriaNombre(insumo, categoriasExistentes);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <BlurView style={styles.absolute} intensity={20} tint="dark" />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalles del Insumo</Text>

          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{insumo?.nombre || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Descripción</Text>
              <Text style={styles.value}>{insumo?.descripcion || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Cantidad</Text>
              <Text style={styles.value}>{insumo?.cantidad ?? '0'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Categoría</Text>
              <Text style={styles.value}>{categoria}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Unidad De Medida</Text>
              <Text style={styles.value}>{insumo?.unidadMedida || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha De Creación</Text>
              <Text style={styles.value}>{formatDate(insumo?.createdAt)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha De Actualización</Text>
              <Text style={styles.value}>{formatDate(insumo?.updatedAt)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailContainer: {
    paddingHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontWeight: '500',
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  closeButton: {
    backgroundColor: '#424242',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    width: '30%',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
});

export default DetalleInsumo;