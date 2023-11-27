import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginScreen = (props: any) => {
  const handleGoogleLogin = () => {
    // Implementar a lógica de login com o Google aqui
    console.log('Login com Google');
  };

  const handleFacebookLogin = () => {
    // Implementar a lógica de login com o Facebook aqui
    console.log('Login com Facebook');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Login com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFacebookLogin}>
        <Text style={styles.buttonText}>Login com Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4285F4', // Cor do Google
    padding: 15,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
