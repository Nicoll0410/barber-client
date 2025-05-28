import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Paginacion = ({ paginaActual, totalPaginas, cambiarPagina }) => {
  const mostrarNumeros = totalPaginas > 1;
  const numerosPaginas = [];

  // Mostrar máximo 3 números de página centrados en la página actual
  if (mostrarNumeros) {
    let inicio = Math.max(1, paginaActual - 1);
    let fin = Math.min(totalPaginas, paginaActual + 1);

    if (paginaActual === 1) {
      fin = Math.min(totalPaginas, 3);
    } else if (paginaActual === totalPaginas) {
      inicio = Math.max(1, totalPaginas - 2);
    }

    for (let i = inicio; i <= fin; i++) {
      numerosPaginas.push(i);
    }
  }

  return (
    <View style={styles.contenedor}>
      <TouchableOpacity 
        onPress={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        style={[styles.botonNavegacion, styles.botonAnterior]}
      >
        <Ionicons name="chevron-back" size={18} color="white" />
        <Text style={styles.textoBoton}>Anterior</Text>
      </TouchableOpacity>
      
      {mostrarNumeros && (
        <View style={styles.contenedorNumeros}>
          {numerosPaginas.map(num => (
            <TouchableOpacity 
              key={num} 
              onPress={() => cambiarPagina(num)}
              style={[styles.numeroPagina, paginaActual === num && styles.paginaActual]}
            >
              <Text style={[styles.textoNumero, paginaActual === num && styles.textoPaginaActual]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        onPress={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        style={[styles.botonNavegacion, styles.botonSiguiente]}
      >
        <Text style={styles.textoBoton}>Siguiente</Text>
        <Ionicons name="chevron-forward" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  botonNavegacion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botonAnterior: {
    marginRight: 8,
  },
  botonSiguiente: {
    marginLeft: 8,
  },
  textoBoton: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  contenedorNumeros: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  numeroPagina: {
    backgroundColor: '#D9D9D9',
    width: 36,
    height: 36,
    borderRadius: 10, // Cambiado de 18 (redondo) a 10 (cuadrado con bordes redondeados)
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  textoNumero: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  paginaActual: {
    backgroundColor: '#424242', // Cambiado de #2196F3 (azul) a #424242 (gris oscuro)
    borderColor: '#424242',
  },
  textoPaginaActual: {
    color: 'white',
  },
});

export default Paginacion;