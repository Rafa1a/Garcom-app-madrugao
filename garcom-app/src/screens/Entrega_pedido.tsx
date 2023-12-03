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
import { fetch_user_bar, fetch_user_call, fetch_user_chapeiro, fetch_user_entregando, fetch_user_porcoes } from '../store/action/user';
import { fetch_mesa_status_call } from '../store/action/mesas';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  status_chapeiro?:boolean;
  users:user_fun[];
  mesas:Mesas[]
  navigation: NavigationProp<any,any>;
  user_login:user_fun;
  //
  onUpUser_entregando:(id:string, array:string[]) =>void
  onUpUser_chapeiro:(id:string, ids_pedidos:string[]) =>void
  onUpUser_bar:(id:string, ids_pedidos:string[]) =>void
  onUpUser_porcoes:(id:string, ids_pedidos:string[]) =>void
  pedidos_mesa:any
  pedidos: pedido_inter[];
}
const Pedidos = ({ mesas, users,navigation,pedidos,user_login,onUpUser_entregando,onUpUser_chapeiro,onUpUser_bar,onUpUser_porcoes }:Props) => {


  const [state_chapeiro,setState_chapeiro] = useState<pedido_inter[]>()
  const [state_bar,setState_bar] = useState<pedido_inter[]>()
  const [state_porcoes,setState_porcoes] = useState<pedido_inter[]>()
  const [state_click,setState_click] = useState<string[]>([])

  /////////filtragem para selecionar itens q correspondem as condicoes para entregue////// 

  useEffect(() => {
    ///////////// Filtro dos pedidos chapeiro/////////////////////
    const pedidosChapeiro = pedidos.filter((pedido) => {
      return (
        pedido.status_chapeiro === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'comidas' && (item.categoria_2 === 'lanches' ||
            item.categoria_2 === 'hotdogs')
        )
      );
    }); 
    ///////////// Filtro dos pedidos drinks/////////////////////
    const pedidosBar = pedidos.filter((pedido) => {
      return (
        pedido.status_bar === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'bar'
        )
      );
    }); 
     ///////////// Filtro dos pedidos porcoes/////////////////////
     const pedidosPorcoes = pedidos.filter((pedido) => {
      return (
        pedido.status_porcoes === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'comidas' && item.categoria_2 ==='porcoes'
        )
      );
    }); 

    ///////////////// Filtro dos usuários chapeiro/////////////////////
    const Chapeiro_entregue = pedidosChapeiro.filter((item) => {
      return !users.some((user) => user.chapeiro?.includes(item.id));
    });
    ///////////////// Filtro dos usuários bar/////////////////////
    const Bar_entregue = pedidosBar.filter((item) => {
      return !users.some((user) => user.bar?.includes(item.id));
    });
    ///////////////// Filtro dos usuários porcoes/////////////////////
    const Porcoes_entregue = pedidosPorcoes.filter((item) => {
      return !users.some((user) => user.porcoes?.includes(item.id));
    });
    ///chapeiro
    setState_chapeiro(Chapeiro_entregue)
    ///bar
    setState_bar(Bar_entregue)
    ///porcoes
    setState_porcoes(Porcoes_entregue)
    // console.log('Chapeiros Entregues:', Chapeiro_entregue);  
    // console.log('bar Entregues:', Bar_entregue);  
    // console.log('porcoes Entregues:', Porcoes_entregue);  
  }, [pedidos, users]);

  //////////// Atualizar o estado do user globalmente //////////////////////
  const user_logado = users.find(user => user.uid === user_login.uid)

  useEffect(()=>{
    const atualizar_entregando = async() => {
    await onUpUser_entregando(user_logado.id,state_click);
  }
   atualizar_entregando()
  },[state_click])

  // console.log(state_chapeiro)
  // console.log(state_click)

  ////////////// Verfica se o id é igual ao array state  chapeiro ////////////////////
  const array_state_chapeiro = state_chapeiro?.find(item => {
    return state_click?.some(i=> item.id=== i)
  })
  ////////////// Verfica se o id é igual ao array state bar ////////////////////
  const array_state_bar = state_bar?.find(item => {
    return state_click?.some(i=> item.id=== i)
  })
  ////////////// Verfica se o id é igual ao array state porcoes ////////////////////
  const array_state_porcoes = state_porcoes?.find(item => {
    return state_click?.some(i=> item.id=== i)
  })
  // console.log("lanches",array_state_chapeiro)
  // console.log("bar",array_state_bar)
  // console.log("porcoes",array_state_porcoes)

  const consolidatedArray = [
    array_state_chapeiro,
    array_state_bar,
    array_state_porcoes,
  ].filter(Boolean);
  
  // console.log(consolidatedArray)
  // navegar para a listagem dos pedidos 
  const func_pedido_list = () =>{

      navigation.navigate('Pedido',{ 
        ids: state_click,
        numero_mesa: consolidatedArray[0]?.numero_mesa, 
        chapeiro_bar_porcoes : true
        })
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <Header entrega navigation={navigation} />
      <ScrollView style={{flex:1}}>
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <View  style={styles.separator_txt}>
            <Text style={styles.text}>Chapeiro</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={state_chapeiro}
          //item ja retorna apenas os status_chapeiro de acordo com o back0end query
          keyExtractor={item => `${item.id}`}
          renderItem={({ item,index }) => {
              // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos

              // atualizacao em tempo real de qual user atende qual pedido (mesa)

              if(users.find(user => user.entregando?.includes(item.id))){
                return <Entrega   users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                state_click={state_click}/>;
              }else {
                return <Entrega  chapeiro users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
              }
                  
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <View  style={styles.separator_txt}>
            <Text style={styles.text}>Bar</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={state_bar}
          //item ja retorna apenas os status_chapeiro de acordo com o back0end query
          keyExtractor={item => `${item.id}`}
          renderItem={({ item,index }) => {
              // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos

              // atualizacao em tempo real de qual user atende qual pedido (mesa)
              if(users.find(user => user.entregando?.includes(item.id))){
                return <Entrega   users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                state_click={state_click}/>;
              }else {
                return <Entrega  drinks users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
              }
                  
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <View  style={styles.separator_txt}>
            <Text style={styles.text}>Porções</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={state_porcoes}
          //item ja retorna apenas os status_chapeiro de acordo com o back0end query
          keyExtractor={item => `${item.id}`}
          renderItem={({ item,index }) => {
              // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos

              // atualizacao em tempo real de qual user atende qual pedido (mesa)
              if(users.find(user => user.entregando?.includes(item.id))){
                return <Entrega   users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                state_click={state_click}/>;
              }else {
                return <Entrega  porcoes users={users} state_chapeiro={state_chapeiro} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
              }
                  
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>
      
    {state_click.length > 0?
      <View style={styles.container_Buttons}>
        <MaterialCommunityIcons name="playlist-edit" size={35} color="tomato" onPress={func_pedido_list}/>
        <Feather name="x-octagon" size={30} color="tomato"  onPress={async()=> {
        array_state_chapeiro?await onUpUser_chapeiro(user_logado.id,state_click):null
        array_state_bar?await onUpUser_bar(user_logado.id,state_click):null
        array_state_porcoes?await onUpUser_porcoes(user_logado.id,state_click):null
        setState_click([])
        }}/>
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
    height: "2%",
    width: '100%',
    backgroundColor: 'transparent',
    alignItems:'center',
  },
  separator_txt: {
    height: 55,
    width: '100%',
    alignItems:'center',
    borderColor:"#fff",
    borderTopWidth:1,
    paddingBottom:10,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 35,
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
    
    onUpUser_entregando: (id:string,array:string[]) => dispatch(fetch_user_entregando(id,array)),
    onUpUser_chapeiro: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_chapeiro(id,ids_pedidos)),
    onUpUser_bar: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_bar(id,ids_pedidos)),
    onUpUser_porcoes: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_porcoes(id,ids_pedidos)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedidos);
