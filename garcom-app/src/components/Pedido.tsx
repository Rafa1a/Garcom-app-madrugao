import React, { useEffect } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Number from './Number';
import { pedido_props } from '../interface/inter';
import { connect } from 'react-redux';
import { fetchExcluirPedido, fetchExcluirPedido_Mesa } from '../store/action/pedidos';

const Pedido = (props: pedido_props) => {
 


  const handlePress = () => {
    //clicar redireciona para os itens do pedido e passa as propriedades
      props.navigation?.navigate('Pedido',{ 
        id:props.id,
        ids:props.ids,
        numero_mesa: props.numero_mesa, 
        image_on: props.image_on, 
        name_on:props.name_on,
        rua : props.rua,
        numero:props.numero,
        pegar_local:props.pegar_local,
        pix:props.pix,
        cartao:props.cartao,
        dinheiro:props.dinheiro
        })
  };
  // ususario ou mesa como retorno da const 
  const userormesa = props.numero_mesa?
  //styles seria preto ou branco 
  // styles diz se esta em primeiro ou nao na ordem de pedidos || refere a cor pois o primeiro item o funco é branco e o restante é preto ...
  props.styles?
  <Number number={props.numero_mesa} styles/>
  :
  <Number number={props.numero_mesa} />:
  //tem imagem do usuario? se nao usa o icone de anonimo
  props.image_on ?
  <Avatar
    size={100}
    rounded
    source={{ uri: props.image_on }}
    containerStyle={{
      width: props.image_on?50:60,
      margin:props.image_on?7:null,
      aspectRatio: 1,
    }}
  />
  :
  <Avatar
      size={100}
      rounded
      
      icon={{ name: 'account-circle', type: 'material-icons', 
      //icone preto ou branco
      color: props.styles? '#3C4043':'#E8F0FE' }}
      containerStyle={{
        width: props.image_on?50:60,
        margin:props.image_on?7:null,
        aspectRatio: 1,
      }}
  />
    // se tem o nome ou nao
  const username = props.name_on?
  <Text 
    style={props.styles?styles.textindex0:styles.text}>{props.name_on}
  </Text>
  :null
  // funcao de deletar onFetchPedidos_Excluir e onFetchPedidos_Excluir_Mesa o primeiro deleta um item com 1 id o segundo deleta um array de ids pois mesa possui mais do q 1 pedido
  const delete_ = () => {
    if (props.ids) {
      Alert.alert(`Excluindo pedidos da mesa : ${props.numero_mesa}`);
      props.onFetchPedidos_Excluir_Mesa(props.ids);
    } else {
      Alert.alert('Excluindo pedido');
      props.onFetchPedidos_Excluir(props.id);
    }
  }
  
  return  (
      
    <SafeAreaView style={styles.containerM}>
      <TouchableOpacity onPress={handlePress }>
      <View style={props.styles?styles.containerindex0:styles.container}>
      <View style={styles.content}>
        {userormesa}
        {username}
        {props.status?null:<Text style={{marginLeft:30,color:"#f10404"}}>{props.ordem}</Text>}
      </View>
      
      {/* <Icon size={23} raised name="minus" type="evilicon" onPress={() => console.warn('hello')} color='#252A32' /> */}
     
      <TouchableOpacity onPress={delete_}>
        <Icon
          size={20}
          reverse
          name='x'
          type='feather'
          color='tomato'
        />
      </TouchableOpacity>
      </View>
      
      </TouchableOpacity>
      
    </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3C4043',
    borderRadius: 50,
    height:Dimensions.get('window').width*1/7,
    width: Dimensions.get('window').width/1.6
  },
  containerindex0: {
    
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F7FC',
    borderRadius: 50,
    height:Dimensions.get('window').width*1/5.5,
    width: Dimensions.get('window').width/1.29,
    marginRight:"10%",
    marginLeft:"10%",
    
  },
  containerM: {
    
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    
   
    height:Dimensions.get('window').width*1/5.5,
    width: "100%"
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  text: {
    fontFamily:"RobotoMono-Bold",
    color: '#E8F0FE',
  },
  textindex0: {
    fontFamily:"RobotoMono-Bold",
    color: '#3C4043',
  },
  numbers: {
    width:'38%',
    aspectRatio: 1,
  },
  outros: {},
});
const mapDispatchProps = (dispatch: any) => {
  return {
    
    onFetchPedidos_Excluir: (id:string) => dispatch(fetchExcluirPedido(id)),
    onFetchPedidos_Excluir_Mesa: (id:string[]) => dispatch(fetchExcluirPedido_Mesa(id))
  };
};
export default connect(null,mapDispatchProps)(Pedido)
 