import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LoginForm from '../../components/LoginForm';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/newYorkBarber.jpeg')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  }
});

export default LoginScreen;