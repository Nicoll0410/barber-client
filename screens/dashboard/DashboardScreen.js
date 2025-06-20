import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Footer from '../../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState({
    ventas: [
      { mes: 'Sept', total: 28 },
      { mes: 'Oct', total: 20 },
      { mes: 'Nov', total: 15 },
      { mes: 'Dec', total: 10 },
      { mes: 'Ene', total: 5 },
      { mes: 'Feb', total: 0 }
    ],
    compras: [
      { mes: 'Sept', total: 20 },
      { mes: 'Oct', total: 18 },
      { mes: 'Nov', total: 12 },
      { mes: 'Dec', total: 7 },
      { mes: 'Ene', total: 3 },
      { mes: 'Feb', total: 0 }
    ],
    ganancias: [
      { mes: 'Enero', total: 5 },
      { mes: 'Febrero', total: 10 },
      { mes: 'Marzo', total: 6 },
      { mes: 'Abril', total: 8 }
    ],
    resumen: {
      ventasMesActual: 1250000,
      ventasMesAnterior: 1000000,
      comprasMesActual: 780000,
      comprasMesAnterior: 850000,
      gananciasMesActual: 470000,
      gananciasMesAnterior: 150000
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  const isMobile = dimensions.width < 768;
  const chartWidth = isMobile ? dimensions.width * 0.85 : dimensions.width * 0.4;

  // Calcular porcentajes de cambio
  const calcularPorcentaje = (actual, anterior) => {
    if (anterior === 0) return 100;
    return ((actual - anterior) / anterior) * 100;
  };

  const porcentajeVentas = calcularPorcentaje(
    dashboardData.resumen.ventasMesActual,
    dashboardData.resumen.ventasMesAnterior
  );

  const porcentajeCompras = calcularPorcentaje(
    dashboardData.resumen.comprasMesActual,
    dashboardData.resumen.comprasMesAnterior
  );

  const porcentajeGanancias = calcularPorcentaje(
    dashboardData.resumen.gananciasMesActual,
    dashboardData.resumen.gananciasMesAnterior
  );

  // Datos para gráficos
  const chartData = {
    labels: dashboardData.ventas.map(item => item.mes),
    datasets: [
      {
        data: dashboardData.ventas.map(item => item.total),
        color: () => '#1a237e',
        strokeWidth: 3,
      },
      {
        data: dashboardData.compras.map(item => item.total),
        color: () => '#c62828',
        strokeWidth: 3,
      },
    ],
    legend: ['Ventas', 'Compras'],
  };

  const gananciasData = {
    labels: dashboardData.ganancias.map(item => item.mes),
    datasets: [
      {
        data: dashboardData.ganancias.map(item => item.total),
        colors: [
          (opacity = 1) => '#c62828',
          (opacity = 1) => '#1a237e',
          (opacity = 1) => '#c62828',
          (opacity = 1) => '#1a237e',
        ],
      },
    ],
  };

  const lineChartConfig = {
    backgroundColor: '#fafafa',
    backgroundGradientFrom: '#fafafa',
    backgroundGradientTo: '#fafafa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => '#333',
    strokeWidth: 2,
    propsForLabels: {
      fontSize: isMobile ? 10 : 12,
    },
    propsForDots: {
      r: isMobile ? 3 : 5,
      strokeWidth: '2',
      stroke: '#fff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
    },
  };

  const barChartConfig = {
    backgroundColor: '#fafafa',
    backgroundGradientFrom: '#fafafa',
    backgroundGradientTo: '#fafafa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => '#333',
    barPercentage: 0.7,
    propsForLabels: {
      fontSize: isMobile ? 10 : 12,
    },
    fillShadowGradient: '#1a237e',
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>Dashboard</Text>

        <View style={[styles.cardContainer, isMobile && styles.cardContainerMobile]}>
          {[
            { 
              label: 'Ventas', 
              value: dashboardData.resumen.ventasMesActual,
              porcentaje: porcentajeVentas,
              isPositive: porcentajeVentas >= 0
            },
            { 
              label: 'Compras', 
              value: dashboardData.resumen.comprasMesActual,
              porcentaje: porcentajeCompras,
              isPositive: porcentajeCompras <= 0
            },
            { 
              label: 'Ganancias', 
              value: dashboardData.resumen.gananciasMesActual,
              porcentaje: porcentajeGanancias,
              isPositive: porcentajeGanancias >= 0
            }
          ].map((item, i) => (
            <View key={i} style={[styles.card, isMobile && styles.cardMobile]}>
              <Text style={styles.cardTitle}>{item.label} de este mes</Text>
              <Text style={styles.cardValue}>
                ${item.value.toLocaleString('es-CO')}
              </Text>
              <View style={[
                styles.comparisonContainer, 
                item.isPositive ? styles.comparisonPositive : styles.comparisonNegative,
                isMobile && styles.comparisonContainerMobile,
                { alignSelf: 'center' } // Centrar en móviles
              ]}>
                <Text style={styles.comparisonArrow}>
                  {item.isPositive ? '↑' : '↓'}
                </Text>
                <Text style={[
                  styles.comparisonPercent,
                  item.isPositive ? styles.comparisonPositivePercent : styles.comparisonNegativePercent
                ]}>
                  {Math.abs(item.porcentaje).toFixed(1)}%
                </Text>
                <Text style={styles.comparisonText}>vs mes pasado</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.graphsRow, isMobile && styles.graphsRowMobile]}>
          <View style={[styles.chartCard, isMobile && styles.chartCardMobile]}>
            <Text style={styles.chartTitle}>Ventas por mes</Text>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={220}
              chartConfig={lineChartConfig}
              bezier
              style={styles.chart}
              withShadow={true}
              withInnerLines={false}
              withOuterLines={false}
            />
          </View>

          <View style={[styles.chartCard, isMobile && styles.chartCardMobile]}>
            <Text style={styles.chartTitle}>Ganancias por mes</Text>
            <Text style={styles.subTitle}>Últimos {dashboardData.ganancias.length} meses</Text>
            <BarChart
              data={gananciasData}
              width={chartWidth}
              height={220}
              chartConfig={barChartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
              barRadius={4}
              withCustomBarColorFromData={true}
              flatColor={true}
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footerContainer, isMobile && styles.footerMobile]}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>
            © 2025 Nicoll Andrea Giraldo Franco |
          </Text>
          <Text style={styles.footerText}>Luis Miguel Chica Ruiz</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  container: {
    padding: 16,
    backgroundColor: '#fafafa',
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  loadingText: {
    marginTop: 20,
    color: '#333',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  titleMobile: {
    textAlign: 'left',
    marginLeft: 8,
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardContainerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '30%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center', // Centrar contenido en móviles
  },
  cardMobile: {
    width: '100%',
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center', // Centrar texto en móviles
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center', // Centrar texto en móviles
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  comparisonContainerMobile: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  comparisonNegative: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  comparisonPositive: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  comparisonArrow: {
    fontSize: 14,
    marginRight: 4,
  },
  comparisonPercent: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  comparisonNegativePercent: {
    color: '#e74c3c',
  },
  comparisonPositivePercent: {
    color: '#2ecc71',
  },
  comparisonText: {
    fontSize: 12,
    color: '#666',
  },
  graphsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  graphsRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    width: '48%',
  },
  chartCardMobile: {
    width: '100%',
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -10, // Ajuste para alinear mejor en móviles
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fafafa',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerMobile: {
    paddingHorizontal: 16,
  },
  footerContent: {
    alignItems: 'flex-start', // Alinear a la izquierda
    paddingHorizontal: 16,
  },
  footerText: {
    textAlign: 'left', // Alinear texto a la izquierda
    fontSize: 14,
    color: '#333',
  },
});

export default DashboardScreen;