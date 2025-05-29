import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const chartData = {
    labels: ['Sept', 'Oct', 'Nov', 'Dec', 'Ene', 'Feb'],
    datasets: [
      {
        data: [28, 20, 15, 10, 5, 0],
        color: () => '#1a237e', // Azul oscuro
        strokeWidth: 3,
      },
      {
        data: [20, 18, 12, 7, 3, 0],
        color: () => '#c62828', // Rojo
        strokeWidth: 3,
      },
    ],
    legend: ['Ventas', 'Compras'],
  };

  const gananciasData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
      {
        data: [5, 10, 6, 8],
        colors: [
          (opacity = 1) => '#c62828', // Rojo
          (opacity = 1) => '#1a237e', // Azul oscuro
          (opacity = 1) => '#c62828',
          (opacity = 1) => '#1a237e',
        ],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cardContainer}>
        {['Ventas', 'Compras', 'Ganancias'].map((label, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{label} de este mes</Text>
            <Text style={styles.cardValue}>$0</Text>
            <View style={[styles.comparisonContainer, i === 1 ? styles.comparisonNegative : styles.comparisonPositive]}>
              <Text style={styles.comparisonArrow}>
                {i === 1 ? '↓' : '↑'}
              </Text>
              <Text style={styles.comparisonPercent}>
                {i === 1 ? '0.0%' : '0.0%'}
              </Text>
              <Text style={styles.comparisonText}>Comparado al mes pasado</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.graphsRow}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ventas por mes</Text>
          <LineChart
            data={chartData}
            width={screenWidth * 0.9 * 0.5}
            height={220}
            chartConfig={lineChartConfig}
            bezier
            style={styles.chart}
            withShadow={true}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ganancias por mes</Text>
          <Text style={styles.subTitle}>Ganancias de los últimos 4 meses</Text>
          <BarChart
            data={gananciasData}
            width={screenWidth * 0.9 * 0.5}
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
  );
};

const lineChartConfig = {
  backgroundColor: '#fafafa', // Fondo más suave
  backgroundGradientFrom: '#fafafa',
  backgroundGradientTo: '#fafafa',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  strokeWidth: 2,
  propsForLabels: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontWeight: '500',
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#fff',
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#e0e0e0',
  },
};

const barChartConfig = {
  backgroundColor: '#fafafa', // Fondo más suave
  backgroundGradientFrom: '#fafafa',
  backgroundGradientTo: '#fafafa',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  barPercentage: 0.7,
  propsForLabels: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontWeight: '500',
  },
  fillShadowGradient: '#1a237e',
  fillShadowGradientOpacity: 1,
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#e0e0e0',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa', // Fondo principal más suave
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(242, 242, 242, 0.6)', // Más transparente
    borderRadius: 10,
    width: '30%',
    minWidth: 100,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    color: '#808080',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  comparisonNegative: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  comparisonPositive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  comparisonArrow: {
    fontSize: 12,
    marginRight: 2,
  },
  comparisonNegativeText: {
    color: '#e74c3c',
  },
  comparisonPositiveText: {
    color: '#2ecc71',
  },
  comparisonPercent: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: '500',
  },
  comparisonNegativePercent: {
    color: '#e74c3c',
  },
  comparisonPositivePercent: {
    color: '#2ecc71',
  },
  comparisonText: {
    fontSize: 10,
    color: '#999',
  },
  graphsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  chartCard: {
    backgroundColor: '#f5f5f5', // Fondo más suave para las tarjetas de gráficos
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '400',
  },
  chart: {
    marginTop: 10,
    borderRadius: 16,
  },
});

export default DashboardScreen;