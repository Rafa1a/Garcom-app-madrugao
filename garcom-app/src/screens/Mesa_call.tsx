import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { fetchpedidos,setPedidos_MESA,startPedidosListener} from '../store/action/pedidos';
import { Mesas, pedido_inter, user_fun } from '../interface/inter';
import Header from '../components/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import Call_cliente from '../components/Call_cliente';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { fetch_user_call } from '../store/action/user';
import { fetch_mesa_status_call } from '../store/action/mesas';

interface Props {
  status_chapeiro?:boolean;
  users:user_fun[];
  mesas:Mesas[]
  navigation: NavigationProp<any,any>;
  user_login:user_fun;
  onUpUser_call:(id:string,number:number) =>void
  onUpMesa_user_call:(id:string) =>void
  pedidos_mesa:any

}
const Pedidos = ({ mesas, users,user_login,pedidos_mesa,navigation,onUpUser_call,onUpMesa_user_call }:Props) => {
  // console.log(users);
  // console.log(mesas);
  //funcao para atualizar o stado do usario :
  const [idstate, setIdstate] = useState<string>("") 

  useEffect(()=>{
    const user_logado = users.find(user => user.uid === user_login.uid)
    // console.log(user_logado)
    if(user_logado.call !== 0 && user_logado.call !== undefined){
      const numero_mesa_ = mesas.find(mesa=>mesa.numero_mesa === user_logado.call)
      setIdstate(numero_mesa_.id)

    }
  },[])
  const user_logado = users.find(user => user.uid === user_login.uid)
  // console.log("user logado", user_logado)
  // console.log("state id ", idstate)
  //funcao para atualizar mesa e users para finalizar o atendimento.
  const func_update_x = () => { 
    if(idstate){
      // console.log(idstate)
      onUpUser_call(user_logado.id, 0)
      onUpMesa_user_call(idstate)
      setIdstate('')
    }else {
      Alert.alert("Escolha uma Chamada")
    }
  } 
  const numero_mesa_ = idstate?mesas.find(mesa=>mesa.id === idstate):null
  // console.log(numero_mesa_)
  // console.log(pedidos_mesa)

  const pedido_mesa_finalizar = numero_mesa_?pedidos_mesa.find(mesa => mesa.numero_mesa === numero_mesa_.numero_mesa):null
  // console.log(pedido_mesa_finalizar)

  const func_pedido_finalizar = () =>{
    if(pedido_mesa_finalizar){
      navigation.navigate('Pedido',{ 
        id:pedido_mesa_finalizar.id,
        ids: pedido_mesa_finalizar.ids,
        numero_mesa: pedido_mesa_finalizar.numero_mesa, 
        })
    }else {
      Alert.alert("Cliente não tem Pedido")
    }
  }
  const func_pedido_adicionar = () =>{
    navigation?.navigate('Adicionar', { numero_mesa: numero_mesa_.numero_mesa, mesa:true });
  }
  // console.log(pedidos_mesa)
  return (
    <SafeAreaView style={styles.container}>
   
      <Header call navigation={navigation} />
      
      <FlatList
        data={mesas.filter(item => item.status_call===true)}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
               if(item.status_user_call === true){
                return <Call_cliente  user_call users={users} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setIdstate={setIdstate} />;
              }else {
                return <Call_cliente   users={users} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setIdstate={setIdstate} />;
              }
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {idstate?
      <View style={styles.container_Buttons}>
        <MaterialCommunityIcons name="playlist-edit" size={35} color="tomato" onPress={func_pedido_finalizar}/>
        <Fontisto name="shopping-basket-add" size={45} color="tomato" onPress={func_pedido_adicionar}/>
        <Feather name="x-octagon" size={30} color="tomato"  onPress={func_update_x}/>
      </View>:null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#202124',
    width:"100%",
    
   
  },
  separator: {
    height: 30,
    width: '100%',
    backgroundColor: 'transparent',
  },
  container_Buttons: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity:0.8
  },
  
});

const mapStateProps = ({ pedidos, user }: {  pedidos: any, user: any}) => {
  return {
    mesas:pedidos.mesas,
    users:user.users,
    user_login:user.user,
    pedidos_mesa:pedidos.pedidos_mesa
  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    onUpMesa_user_call: (id:string) => dispatch(fetch_mesa_status_call(id)),
    onUpUser_call: (id:string,number:number) => dispatch(fetch_user_call(id,number)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedidos);
