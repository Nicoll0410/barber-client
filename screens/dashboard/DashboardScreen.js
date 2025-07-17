import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Footer from '../../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState({
    ventasPorMes: [],
    comprasPorMes: [],
    gananciasPorMes: [],
    ventasEsteMes: 0,
    comprasEsteMes: 0,
    profitEsteMes: 0,
    ventasChange: 0,
    comprasChange: 0,
    profitChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data || {};
      
      // Validar y mapear datos para gráficos con valores por defecto
      const ventasPorMes = (data.ventasPorMes || []).map(item => ({
        mes: item?.x || 'Mes',
        total: item?.y || 0
      }));

      const comprasPorMes = (data.comprasPorMes || []).map(item => ({
        mes: item?.x || 'Mes',
        total: item?.y || 0
      }));

      const gananciasPorMes = (data.gananciasPorMes || []).map(item => ({
        mes: item?.label || 'Mes',
        total: item?.value || 0
      }));

      setDashboardData({
        ventasPorMes,
        comprasPorMes,
        gananciasPorMes,
        ventasEsteMes: data.ventasEsteMes || 0,
        comprasEsteMes: data.comprasEsteMes || 0,
        profitEsteMes: data.profitEsteMes || 0,
        ventasChange: data.ventasChange || 0,
        comprasChange: data.comprasChange || 0,
        profitChange: data.profitChange || 0
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Error al cargar los datos del dashboard');
      // Establecer datos por defecto en caso de error
      setDashboardData({
        ventasPorMes: [],
        comprasPorMes: [],
        gananciasPorMes: [],
        ventasEsteMes: 0,
        comprasEsteMes: 0,
        profitEsteMes: 0,
        ventasChange: 0,
        comprasChange: 0,
        profitChange: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  const isMobile = dimensions.width < 768;
  const chartWidth = isMobile ? dimensions.width * 0.85 : dimensions.width * 0.4;

  // Calcular porcentajes de cambio (ya vienen calculados del backend)
  const porcentajeVentas = dashboardData.ventasChange;
  const porcentajeCompras = dashboardData.comprasChange;
  const porcentajeGanancias = dashboardData.profitChange;

  // Función para formatear números con puntos y signo de pesos
  const formatMoney = (value) => {
    return `$${value.toLocaleString('es-CO')}`;
  };

  // Datos para gráficos
  const chartData = {
    labels: dashboardData.ventasPorMes.map(item => item.mes),
    datasets: [
      {
        data: dashboardData.ventasPorMes.map(item => item.total),
        color: () => '#1a237e',
        strokeWidth: 3,
      },
      {
        data: dashboardData.comprasPorMes.map(item => item.total),
        color: () => '#c62828',
        strokeWidth: 3,
      },
    ],
    legend: ['Ventas', 'Compras'],
  };

  const gananciasData = {
    labels: dashboardData.gananciasPorMes.map(item => item.mes),
    datasets: [
      {
        data: dashboardData.gananciasPorMes.map(item => item.total),
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
    formatYLabel: (value) => formatMoney(value),
    style: {
      borderRadius: 16,
    },
    propsForVerticalLabels: {
      fontWeight: 'bold',
    },
    propsForHorizontalLabels: {
      fontWeight: 'bold',
    }
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
    formatYLabel: (value) => formatMoney(value),
    formatTopBarValue: (value) => formatMoney(value), // Esta línea es la que muestra los valores con $ y puntos sobre las barras
    style: {
      borderRadius: 16,
    },
    propsForVerticalLabels: {
      fontWeight: 'bold',
    },
    propsForHorizontalLabels: {
      fontWeight: 'bold',
    },
    barRadius: 4,
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
              value: dashboardData.ventasEsteMes,
              porcentaje: porcentajeVentas,
              isPositive: porcentajeVentas >= 0
            },
            { 
              label: 'Compras', 
              value: dashboardData.comprasEsteMes,
              porcentaje: porcentajeCompras,
              isPositive: porcentajeCompras <= 0
            },
            { 
              label: 'Ganancias', 
              value: dashboardData.profitEsteMes,
              porcentaje: porcentajeGanancias,
              isPositive: porcentajeGanancias >= 0
            }
          ].map((item, i) => (
            <View key={i} style={[styles.card, isMobile && styles.cardMobile]}>
              <Text style={styles.cardTitle}>{item.label} de este mes</Text>
              <Text style={styles.cardValue}>
                {item.value.toLocaleString('es-CO')}
              </Text>
              <View style={[
                styles.comparisonContainer, 
                item.isPositive ? styles.comparisonPositive : styles.comparisonNegative,
                isMobile && styles.comparisonContainerMobile
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
              yAxisLabel="$"
              yAxisInterval={1}
            />
          </View>

          <View style={[styles.chartCard, isMobile && styles.chartCardMobile]}>
            <Text style={styles.chartTitle}>Ganancias por mes</Text>
            <Text style={styles.subTitle}>Últimos {dashboardData.gananciasPorMes.length} meses</Text>
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
              yAxisLabel="$"
              yAxisInterval={1}
            />
          </View>
        </View>
      </ScrollView>
      
      <Footer />
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
  },
  cardMobile: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
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
    marginLeft: 10,
  },
});

export default DashboardScreen;