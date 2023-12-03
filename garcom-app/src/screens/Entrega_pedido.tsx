import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { fetchpedidos,setPedidos_MESA,startPedidosListener} from '../store/action/pedidos';
import { Mesas, pedido_inter, user_fun } from '../interface/inter';
import Header from '../components/headers/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import Entrega from '../components/call_entrega/Entrega';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { fetch_user_call } from '../store/action/user';
import { fetch_mesa_status_call } from '../store/action/mesas';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  status_chapeiro?:boolean;
  users:user_fun[];
  mesas:Mesas[]
  navigation: NavigationProp<any,any>;
  user_login:user_fun;
  onUpUser_call:(id:string,number:number) =>void
  onUpMesa_user_call:(id:string) =>void
  pedidos_mesa:any
  pedidos: pedido_inter[];
}
const Pedidos = ({ mesas, users,navigation,pedidos }:Props) => {


  const [state_chapeiro,setState_chapeiro] = useState<pedido_inter[]>()
  const [state_click,setState_click] = useState<string[]>([])
  //filtragem para selecionar itens q correspondem as condicoes para entregue 
  useEffect(() => {
    // Filtro dos pedidos
    const pedidosChapeiro = pedidos.filter((pedido) => {
      return (
        pedido.status_chapeiro === false &&
        pedido.itens.some(
          (item) =>
            (item.categoria === 'comidas' && item.categoria_2 === 'lanches') ||
            item.categoria_2 === 'hotdogs'
        )
      );
    }); 
    /// Filtro dos usuários
    const Chapeiro_entregue = pedidosChapeiro.filter((item) => {
      return !users.some((user) => user.chapeiro?.includes(item.id));
    });
    setState_chapeiro(Chapeiro_entregue)
    // console.log('Chapeiros Entregues:', Chapeiro_entregue);  
  }, [pedidos, users]);


  // console.log(state_chapeiro)
  // console.log(state_click)
  // Verfica se o numero da mesa é igual aos q estao presentes
  const array_state = state_chapeiro?.find(item => {
    return state_click?.some(i=> item.id=== i)
  })
  console.log(state_click)

  // navegar para a listagem dos pedidos podendo mudar o status do pedido para finalizado
  const func_pedido_finalizar = () =>{
      navigation.navigate('Pedido',{ 
        ids: state_click,
        numero_mesa: array_state.numero_mesa, 
        })
  }
  return (
    <SafeAreaView style={styles.container}>
   
      <Header entrega navigation={navigation} />
      <ScrollView>
      <FlatList
      scrollEnabled={false}

        data={state_chapeiro}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
            if(state_click.includes(item.id)){
              return <Entrega chapeiro  users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
              state_click={state_click}/>;
            }else {
              return <Entrega  users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
            }
                
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View  style={styles.separator}>
          <Text >rafa</Text>
      </View>
      {/* <FlatList
      scrollEnabled={false}
        data={mesas.filter(item => item.status_call===true)}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
               if(item.status_user_call === true){
                return <Entrega  user_call users={users} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation}/>;
              }else {
                return <Entrega   users={users} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} />;
              }
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      /> */}
    </ScrollView>
    {state_click?
      <View style={styles.container_Buttons}>
        <MaterialCommunityIcons name="playlist-edit" size={35} color="tomato" onPress={func_pedido_finalizar}/>
        <Feather name="x-octagon" size={30} color="tomato"  />
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
    alignItems:'center'
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
    pedidos: pedidos.pedidos,
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
