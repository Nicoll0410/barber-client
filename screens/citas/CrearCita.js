import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Datos de ejemplo
const servicios = [
  { id: '1', nombre: 'Corte de cabello', precio: '$80.000', descripcion: 'Corte profesional con técnicas modernas' },
  { id: '2', nombre: 'Afeitado clásico', precio: '$120.000', descripcion: 'Afeitado con navaja y productos premium' },
  { id: '3', nombre: 'Corte y barba', precio: '$100.000', descripcion: 'Combo completo de corte y arreglo de barba' },
  { id: '4', nombre: 'Tinte para cabello', precio: '$180.000', descripcion: 'Tinte profesional con productos de calidad' },
  { id: '5', nombre: 'Tratamiento capilar', precio: '$150.000', descripcion: 'Tratamiento revitalizante para el cabello' },
];

const barberos = [
  { id: '1', nombre: 'Juan Martínez', avatar: require('../../assets/avatar.png') },
  { id: '2', nombre: 'Carlos Rodríguez', avatar: require('../../assets/avatar.png') },
  { id: '3', nombre: 'Andrés Gómez', avatar: require('../../assets/avatar.png') },
];

const clientes = [
  { id: '1', nombre: 'Santiago Pérez', avatar: require('../../assets/avatar.png') },
  { id: '2', nombre: 'Carolina López', avatar: require('../../assets/avatar.png') },
  { id: '3', nombre: 'María José García', avatar: require('../../assets/avatar.png') },
  { id: '4', nombre: 'Andrés Rodríguez', avatar: require('../../assets/avatar.png') },
];

const citasExistentes = [
  { barberoId: '1', fecha: '2025-05-30', hora: '15:00' },
  { barberoId: '1', fecha: '2025-05-30', hora: '16:30' },
  { barberoId: '2', fecha: '2025-05-30', hora: '14:00' },
];

const CrearCita = ({ visible, onClose, onCreate }) => {
  const [paso, setPaso] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaBarbero, setBusquedaBarbero] = useState('');
  const [mesActual, setMesActual] = useState(new Date());
  const [diasMes, setDiasMes] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Inicializar fechas y horas
  useEffect(() => {
    if (paso === 4) {
      generarDiasMes();
    }
  }, [paso, mesActual]);

  useEffect(() => {
    if (fechaSeleccionada && barberoSeleccionado && paso === 4) {
      generarHorasDisponibles();
    }
  }, [fechaSeleccionada, barberoSeleccionado]);

  const resetForm = () => {
    setServicioSeleccionado(null);
    setBarberoSeleccionado(null);
    setClienteSeleccionado(null);
    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
    setBusquedaCliente('');
    setBusquedaBarbero('');
    setPaso(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCrear = () => {
    onCreate({
      cliente: clienteSeleccionado.nombre,
      servicio: servicioSeleccionado.nombre,
      descripcion: servicioSeleccionado.descripcion,
      barbero: barberoSeleccionado.nombre,
      fecha: fechaSeleccionada,
      hora: horaSeleccionada
    });
    resetForm();
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const barberosFiltrados = barberos.filter(barbero =>
    barbero.nombre.toLowerCase().includes(busquedaBarbero.toLowerCase())
  );

  const generarDiasMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDiaMes = new Date(año, mes, 1);
    const ultimoDiaMes = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDiaMes.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    const dias = [];
    
    // Agregar días vacíos para alinear el primer día del mes
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }
    
    // Agregar los días del mes
    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      dias.push(new Date(año, mes, dia));
    }
    
    // Calcular días vacíos para completar la última semana (6 semanas)
    const totalCeldas = 42; // 6 semanas * 7 días
    while (dias.length < totalCeldas) {
      dias.push(null);
    }
    
    setDiasMes(dias);
  };

  const generarHorasDisponibles = () => {
    const horas = [];
    const [año, mes, dia] = fechaSeleccionada.split('-').map(Number);
    const fecha = new Date(año, mes - 1, dia);
    const diaSemana = fecha.getDay();
    
    let horaInicio, horaFin;
    if (diaSemana >= 1 && diaSemana <= 3) {
      horaInicio = 11;
      horaFin = 21;
    } else {
      horaInicio = 9;
      horaFin = 22.5;
    }
    
    const hoy = new Date();
    if (fecha.toDateString() === hoy.toDateString()) {
      const horaActual = hoy.getHours() + (hoy.getMinutes() / 60);
      horaInicio = Math.max(horaInicio, Math.ceil(horaActual + 0.5));
    }
    
    for (let hora = horaInicio; hora < horaFin; hora += 0.5) {
      const horaFormato = Math.floor(hora);
      const minutosFormato = hora % 1 === 0 ? '00' : '30';
      const horaStr = `${horaFormato.toString().padStart(2, '0')}:${minutosFormato}`;
      
      const citaOcupada = citasExistentes.some(cita => 
        cita.barberoId === barberoSeleccionado.id && 
        cita.fecha === fechaSeleccionada && 
        cita.hora === horaStr
      );
      
      if (!citaOcupada) {
        horas.push(horaStr);
      }
    }
    
    setHorasDisponibles(horas);
    if (horas.length === 0) {
      setHoraSeleccionada(null);
    }
  };

  const cambiarMes = (incremento) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + incremento);
    setMesActual(nuevoMes);
    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
  };

  const formatearFecha = (fecha) => {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const esFechaPasada = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);
    return fechaComparar < hoy;
  };

  // Paso 1: Selección de servicio
  const Paso1 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, selecciona el servicio que se realizará en la cita</Text>
      
      <FlatList
        data={servicios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.servicioItem,
              servicioSeleccionado?.id === item.id && styles.servicioSeleccionado
            ]}
            onPress={() => setServicioSeleccionado(item)}
          >
            <Text style={styles.servicioNombre}>{item.nombre}</Text>
            <Text style={styles.servicioPrecio}>{item.precio}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.botonContainerCentrado}>
        <TouchableOpacity
          style={[styles.botonSiguiente, !servicioSeleccionado && styles.botonDisabled]}
          onPress={() => setPaso(2)}
          disabled={!servicioSeleccionado}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 2: Selección de barbero
  const Paso2 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, selecciona el barbero para la cita</Text>
      
      <View style={styles.buscadorContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.buscadorIcono} />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar barbero por nombre"
          value={busquedaBarbero}
          onChangeText={setBusquedaBarbero}
        />
      </View>
      
      <FlatList
        data={barberosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.barberoItem,
              barberoSeleccionado?.id === item.id && styles.barberoSeleccionado
            ]}
            onPress={() => setBarberoSeleccionado(item)}
          >
            <Image source={item.avatar} style={styles.barberoAvatar} />
            <Text style={styles.barberoNombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(1)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botonSiguiente, !barberoSeleccionado && styles.botonDisabled]}
          onPress={() => setPaso(3)}
          disabled={!barberoSeleccionado}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 3: Selección de cliente
  const Paso3 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, selecciona el paciente al que se realizará la cita</Text>
      
      <View style={styles.buscadorContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.buscadorIcono} />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar por nombre"
          value={busquedaCliente}
          onChangeText={setBusquedaCliente}
        />
      </View>
      
      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.clienteItem,
              clienteSeleccionado?.id === item.id && styles.clienteSeleccionado
            ]}
            onPress={() => setClienteSeleccionado(item)}
          >
            <Image source={item.avatar} style={styles.clienteAvatar} />
            <Text style={styles.clienteNombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(2)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botonSiguiente, !clienteSeleccionado && styles.botonDisabled]}
          onPress={() => setPaso(4)}
          disabled={!clienteSeleccionado}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 4: Selección de fecha y hora (versión corregida)
  const Paso4 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Elige la fecha y el horario deseados para tu tratamiento</Text>
      
      <View style={styles.calendarioHeader}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <MaterialIcons name="chevron-left" size={24} color="#424242" />
        </TouchableOpacity>
        
        <Text style={styles.mesActual}>
          {mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <MaterialIcons name="chevron-right" size={24} color="#424242" />
        </TouchableOpacity>
      </View>
      
      {/* Días de la semana - ahora correctamente alineados */}
      <View style={styles.diasSemanaContainer}>
        {diasSemana.map((dia, index) => (
          <View key={index} style={styles.diaSemanaItem}>
            <Text style={styles.diaSemanaTexto}>{dia}</Text>
          </View>
        ))}
      </View>
      
      {/* Días del mes - ahora con 6 filas completas */}
      <View style={styles.diasMesContainer}>
        {Array.from({ length: 6 }).map((_, semanaIndex) => (
          <View key={semanaIndex} style={styles.semanaContainer}>
            {diasSemana.map((_, diaSemanaIndex) => {
              const index = semanaIndex * 7 + diaSemanaIndex;
              const dia = diasMes[index];
              
              if (!dia) {
                return <View key={index} style={styles.diaVacio} />;
              }
              
              const fechaFormateada = formatearFecha(dia);
              const esSeleccionado = fechaFormateada === fechaSeleccionada;
              const esHoy = dia.toDateString() === new Date().toDateString();
              const esPasada = esFechaPasada(dia);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.diaItem,
                    esHoy && styles.diaHoy,
                    esSeleccionado && styles.diaSeleccionado,
                    esPasada && styles.diaPasado
                  ]}
                  onPress={() => !esPasada && setFechaSeleccionada(fechaFormateada)}
                  disabled={esPasada}
                >
                  <Text style={[
                    styles.diaNumero,
                    esSeleccionado && styles.diaNumeroSeleccionado,
                    esHoy && styles.diaNumeroHoy,
                    esPasada && styles.diaNumeroPasado
                  ]}>
                    {dia.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      
      {fechaSeleccionada && (
        <View style={styles.horasContainer}>
          <Text style={styles.horasTitulo}>Horarios disponibles:</Text>
          
          {horasDisponibles.length > 0 ? (
            <View style={styles.horasGrid}>
              {horasDisponibles.map((hora, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.horaButton,
                    hora === horaSeleccionada && styles.horaSeleccionada
                  ]}
                  onPress={() => setHoraSeleccionada(hora)}
                >
                  <Text style={[
                    styles.horaTexto,
                    hora === horaSeleccionada && styles.horaTextoSeleccionado
                  ]}>
                    {hora}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.sinDisponibilidad}>
              <Text style={styles.sinDisponibilidadTitulo}>Sin citas disponibles para esta fecha</Text>
              <Text style={styles.sinDisponibilidadTexto}>Encuentra una fecha y hora disponibles para crear la reserva</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(3)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botonSiguiente, (!fechaSeleccionada || !horaSeleccionada) && styles.botonDisabled]}
          onPress={() => setPaso(5)}
          disabled={!fechaSeleccionada || !horaSeleccionada}
        >
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Paso 5: Confirmación
  const Paso5 = () => (
    <View style={styles.pasoContainer}>
      <Text style={styles.subtitulo}>Por favor, revisa y asegúrate que la información de la cita es correcta</Text>
      
      <View style={styles.infoConfirmacion}>
        <Text style={styles.infoTitulo}>Servicio:</Text>
        <Text style={styles.infoTexto}>{servicioSeleccionado.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Descripción:</Text>
        <Text style={styles.infoTexto}>{servicioSeleccionado.descripcion}</Text>
        
        <Text style={styles.infoTitulo}>Barbero:</Text>
        <Text style={styles.infoTexto}>{barberoSeleccionado.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Cliente:</Text>
        <Text style={styles.infoTexto}>{clienteSeleccionado.nombre}</Text>
        
        <Text style={styles.infoTitulo}>Fecha:</Text>
        <Text style={styles.infoTexto}>
          {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        
        <Text style={styles.infoTitulo}>Hora:</Text>
        <Text style={styles.infoTexto}>{horaSeleccionada}</Text>
      </View>
      
      <View style={styles.botonesNavegacion}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => setPaso(4)}
        >
          <Text style={styles.botonTextoVolver}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.botonConfirmar}
          onPress={handleCrear}
        >
          <Text style={styles.botonTexto}>Confirmar cita</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaso = () => {
    switch(paso) {
      case 1: return <Paso1 />;
      case 2: return <Paso2 />;
      case 3: return <Paso3 />;
      case 4: return <Paso4 />;
      case 5: return <Paso5 />;
      default: return <Paso1 />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {paso === 1 && 'Seleccionar servicio'}
              {paso === 2 && 'Seleccionar barbero'}
              {paso === 3 && 'Seleccionar cliente'}
              {paso === 4 && 'Seleccionar fecha y hora'}
              {paso === 5 && 'Revisa y confirma'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderPaso()}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  pasoContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  servicioItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  servicioSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  servicioPrecio: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  buscadorIcono: {
    marginRight: 10,
  },
  buscadorInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: '#333',
  },
  barberoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  barberoSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  barberoAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
  },
  barberoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  clienteSeleccionado: {
    borderColor: '#424242',
    backgroundColor: '#D9D9D9',
  },
  clienteAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  calendarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mesActual: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
  },
  diasSemanaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  diaSemanaItem: {
    width: 40,
    alignItems: 'center',
  },
  diaSemanaTexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  diasMesContainer: {
    marginBottom: 20,
  },
  semanaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  diaVacio: {
    width: 40,
    height: 40,
  },
  diaItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  diaHoy: {
    borderWidth: 1,
    borderColor: '#424242',
  },
  diaSeleccionado: {
    backgroundColor: '#424242',
  },
  diaPasado: {
    opacity: 0.5,
  },
  diaNumero: {
    fontSize: 16,
    color: '#333',
  },
  diaNumeroHoy: {
    fontWeight: 'bold',
  },
  diaNumeroSeleccionado: {
    color: '#fff',
  },
  diaNumeroPasado: {
    color: '#999',
  },
  horasContainer: {
    marginTop: 10,
  },
  horasTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#424242',
  },
  horasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  horaButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  horaSeleccionada: {
    borderColor: '#424242',
    backgroundColor: '#424242',
  },
  horaTexto: {
    fontSize: 14,
    color: '#333',
  },
  horaTextoSeleccionado: {
    color: '#fff',
  },
  sinDisponibilidad: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  sinDisponibilidadTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 5,
    textAlign: 'center',
  },
  sinDisponibilidadTexto: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoConfirmacion: {
    marginTop: 10,
    marginBottom: 18,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    color: '#222',
  },
  infoTexto: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  botonesNavegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  botonVolver: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  botonSiguiente: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  botonConfirmar: {
    backgroundColor: '#424242',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  botonDisabled: {
    backgroundColor: '#bbb',
  },
  botonTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  botonTextoVolver: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  botonContainerCentrado: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default CrearCita;