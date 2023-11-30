import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
} from 'react-native';
//necessarios para fazer login
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import {
GoogleAuthProvider,
onAuthStateChanged,
signInWithCredential,
signOut
} from 'firebase/auth'
import { auth } from '../store/auth';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { add_Func } from '../store/action/user';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = (props: any) => {
  const [userInfo, setUserInfo] = React.useState<any>()
  const [request,response,promptAsync] = Google.useAuthRequest({
    iosClientId:"132031674201-9s1pkkhehuakqevilbob9btuia0bf2e4.apps.googleusercontent.com",
    androidClientId:"132031674201-vu8fs3nq0e0sacsf9o2umraillpecp7o.apps.googleusercontent.com"
  })

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth,async (user:any) =>{
      if(user){
        // console.log(JSON.stringify(user,null,2))
        // const new_user = {
        //   name_func : res
        // }
        setUserInfo(user);

      }else {
        console.log('sem user')
      }
    })
    return () =>unsub();
  },[]);

  React.useEffect(()=>{
    if(response?.type == "success"){
      console.log(response)
      const {id_token} = response.params;
     
      const credential = GoogleAuthProvider.credential(id_token);
      // console.log(credential)
      //login do user 
      signInWithCredential(auth,credential)
      .catch(e=>console.error(e));
    }
  },[response])
  
  // React.useEffect(()=>{
  //   if(userInfo){
  //     props.navigation?.navigate("Splash");
  //   }

  // },[userInfo])

  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bem Vindo Garçom</Text>
      <TouchableOpacity style={styles.button} onPress={()=>promptAsync()}>
      <FontAwesome name="google-plus-square" size={35} color="#f4f7fc" />
        <Text style={styles.buttonText}>Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor:'#2d2f31'
  },
  button: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-around',
    backgroundColor: '#4285F4', // Cor do Google
    padding: 15,
    margin: 10,
    borderRadius: 15,
    width: 200,
  },
  buttonText: {
    color: '#f4f7fc',
    fontWeight: 'bold',
  },
  text :{
    color: '#f4f7fc',
    fontSize:30,
    fontFamily:"OpenSans-Bold"
  }
});



const mapStateProps = ({ pedidos, user }: { pedidos: any, user: any}) => {
  return {
   
  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    onAdd_User: (user:any) => dispatch(add_Func(user))
  };
};

export default connect(null,mapDispatchProps )(LoginScreen);
