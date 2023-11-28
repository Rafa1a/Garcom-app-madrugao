import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//necessarios para fazer login
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import {
GoogleAuthProvider,
onAuthStateChanged,
signInWithCredential
} from 'firebase/auth'
import { auth } from '../store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = (props: any) => {
  const [userInfo, setUserInfo] = React.useState<any>()
  const [request,response,promptAsync] = Google.useAuthRequest({
    iosClientId:"132031674201-9s1pkkhehuakqevilbob9btuia0bf2e4.apps.googleusercontent.com",
    androidClientId:"132031674201-vu8fs3nq0e0sacsf9o2umraillpecp7o.apps.googleusercontent.com"
  })

  React.useEffect(()=>{
    if(response?.type == "success"){
      // console.log(response)
      const {id_token} = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      // console.log(credential)
      signInWithCredential(auth,credential)
    }
  },[response])

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth,async (user) =>{
      if(user){
        console.log(JSON.stringify(user,null,2))

        setUserInfo(user);
      }else {
        console.log('sem user')
      }
    })
    return () =>unsub();
  },[]);

  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={()=>promptAsync()}>
        <Text style={styles.buttonText}>rafa com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} >
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
