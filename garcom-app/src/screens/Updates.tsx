import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckForUpdatesScreen = (props: any) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const navigateToLogin = () => props.navigation?.navigate('Login');

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdateAvailable(true);
        } else {
          setTimeout(() => {
            navigateToLogin();
          }, 500); // Aguarda 500 milissegundos antes de navegar para o 'Login'
        }
      } catch (error) {
        navigateToLogin();
        console.error('Error ao verificar Updates:', error);
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdatePress = async () => {
    try {
      await Updates.fetchUpdateAsync();
      // Handle the update: you can prompt the user to restart the app
      // or do it automatically by calling Updates.reloadAsync()
      Updates.reloadAsync();
    } catch (error) {
      console.error('Error fetching update:', error);
      Alert.alert('Error', 'Ao tentar atualizar, tente mais tarde.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {isUpdateAvailable ? (
        <View>
          <Text style={styles.text}>Nova Atualização disponível!</Text>
          <Button title="Atualizar" onPress={handleUpdatePress} />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2d2f31' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2f31',
  },
  text: {
    color: '#F4F7FC',
    fontFamily: 'OpenSans-Regular',
    fontSize: 40,
    marginBottom: 15,
  },
});

export default CheckForUpdatesScreen;
