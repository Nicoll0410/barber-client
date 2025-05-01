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
        color: () => '#8e44ad',
        strokeWidth: 2,
      },
      {
        data: [20, 18, 12, 7, 3, 0],
        color: () => '#e91e63',
        strokeWidth: 2,
      },
    ],
    legend: ['Ventas', 'Compras'],
  };

  const gananciasData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
      {
        data: [5, 10, 6, 8],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cardContainer}>
        {['Ventas', 'Compras', 'Profit'].map((label, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{label} de este mes</Text>
            <Text style={styles.cardValue}>$0</Text>
            <Text style={styles.cardComparison}>↓ 0.0% Comparado al mes pasado</Text>
          </View>
        ))}
      </View>

      <View style={styles.graphsRow}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ventas por mes</Text>
          <LineChart
            data={chartData}
            width={screenWidth * 0.9 * 0.5} // 50% del 90% del screen width
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ganancias por mes</Text>
          <Text style={styles.subTitle}>Ganancias de los últimos 4 meses</Text>
          <BarChart
            data={gananciasData}
            width={screenWidth * 0.9 * 0.5}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '30%',
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    color: '#888',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cardComparison: {
    marginTop: 4,
    fontSize: 12,
    color: '#e74c3c',
  },
  graphsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  chart: {
    marginTop: 10,
    borderRadius: 16,
  },
});

export default DashboardScreen;
