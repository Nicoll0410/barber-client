import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DateTime } from 'luxon';

const Calendar = ({ selectedDate, onDateChange, minDate, maxDate, markedDates = {} }) => {
  const today = DateTime.now();
  const startDate = minDate ? DateTime.fromISO(minDate) : today.startOf('month');
  const endDate = maxDate ? DateTime.fromISO(maxDate) : today.endOf('month');
  
  const days = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = currentDate.plus({ days: 1 });
  }
  
  const weeks = [];
  let week = [];
  
  days.forEach((day, i) => {
    week.push(day);
    if (day.weekday === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const isSelected = (date) => {
    return selectedDate && date.hasSame(DateTime.fromISO(selectedDate), 'day');
  };

  const isDisabled = (date) => {
    return (minDate && date < DateTime.fromISO(minDate)) || 
           (maxDate && date > DateTime.fromISO(maxDate));
  };

  const formatDateKey = (date) => {
    return date.toFormat('yyyy-MM-dd');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <Text key={day} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>
      
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => {
            const disabled = isDisabled(day);
            const selected = isSelected(day);
            const dateKey = formatDateKey(day);
            const customMarked = markedDates[dateKey] || {};
            
            return (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.day,
                  selected && styles.selectedDay,
                  disabled && styles.disabledDay,
                  customMarked.selected && styles.selectedDay,
                  customMarked.disabled && styles.disabledDay,
                ]}
                onPress={() => !disabled && onDateChange(day.toISODate())}
                disabled={disabled}
              >
                <Text style={[
                  styles.dayText,
                  selected && styles.selectedDayText,
                  disabled && styles.disabledDayText,
                  customMarked.selected && styles.selectedDayText,
                  customMarked.disabled && styles.disabledDayText,
                ]}>
                  {day.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    width: 30,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  day: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#007bff',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: '#999',
  },
});

export default Calendar;