import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header_pedido from '../components/headers/Header_Pedido';
import Lista from '../components/pedidos/Lista_Pedido'
import { connect } from 'react-redux';
import { fetchatualizar_pedido_mesa} from '../store/action/pedidos' 
import { pedido_itens_comp } from '../interface/inter';
import { SafeAreaView } from 'react-native-safe-area-context';


 class Pedido_itens extends React.Component<pedido_itens_comp>{
   
   
  render() {
    const { numero_mesa, image_on, name_on, id, ids, rua, numero, pegar_local,dinheiro,pix,cartao, chapeiro_bar_porcoes,chapeiro_bar_porcoes_itens } = this.props.route.params;
    
    const atualizar_pedido_mesa = () =>{
      this.props.onAtualizarPedido_Mesa(ids)
      this.props.navigation?.goBack()
    }
    return(
    <SafeAreaView style={styles.container}>
     <ScrollView style={styles.scroll}>
      {/* header q recebe o numero se tiver image se tiver e name do user se tiver */}
      <Header_pedido 
      id={id}
      ids={ids}
      numero_mesa={numero_mesa} 
      image_on={image_on} 
      name_on={name_on} 
      rua={rua}
      numero={numero}
      pegar_local={pegar_local}
      dinheiro={dinheiro}
      pix={pix}
      cartao={cartao}
      chapeiro_bar_porcoes={chapeiro_bar_porcoes}
      />
      {/*recebe o id depois faz um find em pedidos qual id === id_pedidos*/}
      <Lista  numero_mesa={numero_mesa} ids={ids} 
      chapeiro_bar_porcoes={chapeiro_bar_porcoes}
      chapeiro_bar_porcoes_itens={chapeiro_bar_porcoes_itens}
      /> 
      {/* botao para atualizar o status_$ do PEDIDO */}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValue}>${this.props.total}</Text>
      </View>
      <View style={styles.divider} />
      {chapeiro_bar_porcoes ? null : 
      <TouchableOpacity onPress={atualizar_pedido_mesa}  style={styles.button}>
            <Text style={styles.buttonText}>Finalizado</Text>
      </TouchableOpacity>}
     
      
      </ScrollView>
    </SafeAreaView>
  );}
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#252A32",
    width: '100%',
  },
  scroll: {
    flex:1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height:160,
    width:160,
    borderRadius: 100,
    margin: 5,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
        color: '#F4F7FC',
        fontSize: 30,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom:10
},
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    width: '90%',
    marginBottom: 10,
  },
  totalText: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 30,
  },
  totalValue: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 50,
  },
});
const mapStateProps = ({ pedidos }: { pedidos: any}) => {
  return {
    total: pedidos.total
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizarPedido_Mesa: (ids:any) => dispatch(fetchatualizar_pedido_mesa(ids)),
  };
};

export default connect(mapStateProps,mapDispatchProps)(Pedido_itens)