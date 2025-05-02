import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Paginacion = ({ paginaActual, totalPaginas, cambiarPagina }) => {
  return (
    <View style={styles.paginacion}>
      <TouchableOpacity 
        onPress={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        <Text style={[styles.botonPagina, paginaActual === 1 && styles.botonDeshabilitado]}>Anterior</Text>
      </TouchableOpacity>
      
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
        <TouchableOpacity key={num} onPress={() => cambiarPagina(num)}>
          <Text style={[styles.numeroPagina, paginaActual === num && styles.paginaActual]}>{num}</Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        onPress={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        <Text style={[styles.botonPagina, paginaActual === totalPaginas && styles.botonDeshabilitado]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginacion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  botonPagina: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  numeroPagina: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  paginaActual: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
  },
  botonDeshabilitado: {
    color: '#ccc',
  },
});

export default Paginacion;