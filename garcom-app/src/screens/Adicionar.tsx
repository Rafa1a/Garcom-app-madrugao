import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchatualizar_cardapio_estoque, fetchatualizar_cardapio_onoroff } from '../store/action/cardapio';
import { Avatar, Button, Icon, ListItem, Tab, TabView } from '@rneui/themed';
import Adicionar_list from '../components/Adicionar_retirar_list';
import { adicionar_screen } from '../interface/inter_adicionar';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../store/auth';
import routes from '../routes';

function Adicionar(props: adicionar_screen) {
  const { params } = props.route;
  const [numero_mesa, setNumero_mesa] = useState(null);
  const [mesa, setMesa] = useState(false);

  // Verificar se params existe antes de acessar suas propriedades
  useEffect(()=>{
    if (params && params.numero_mesa && params.mesa) {
      const { numero_mesa, mesa } = params;
      setNumero_mesa(numero_mesa)
      setMesa(mesa)
    } else {
      // Lógica para lidar com o caso em que params ou suas propriedades são indefinidos
      // console.log('Parâmetros ausentes ou indefinidos.');
    }
  
  },[])
  
  //capturar o estado inicial da aplicacao
  // console.log(props.inicial_state_outros)
  
  // index da tab 
  const [index, setIndex] = React.useState(0);
  // controle expansão do ListItem.Accordion
  const [expanded, setExpanded] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false); 
  const [expanded3, setExpanded3] = React.useState(false); 
  const [expanded4, setExpanded4] = React.useState(false); 
  const [expanded5, setExpanded5] = React.useState(false); 
  const [expanded6, setExpanded6] = React.useState(false); 
  const [expanded7, setExpanded7] = React.useState(false); 
  

  // retirar categoria repetidas
  const uniqueCategories = [...new Set(props.cardapio.map((item: any) => item.categoria))];
 
  //separar e filtrar
  const bebidas:any = props.cardapio.filter((item:any) =>item.categoria === 'bebidas' && item.onorof===true)
  const comidas = props.cardapio.filter((item:any) =>item.categoria === 'comidas' && item.onorof===true)
  const bar = props.cardapio.filter((item:any) =>item.categoria === 'bar' && item.onorof===true)
  //categoria do flatlist do ListItem.Accordion
  const categoria_Bebidas = ['no-alcool','alcool','adicionar']
  const categoria_comidas = ['lanches','hotdogs','porcoes','adicionar']
  const categoria_bar = ['drinks','sucos','adicionar']
  //funcao para atualizar usada 1 vez apenas

  // const atualizar = props.cardapio.filter(item => item.adicionais)
  // const  fetchatualizar_cardapio = async (id:any) => {
   
  //     const pedidoRef = doc(db, 'cardapio', id);
  //     await updateDoc(pedidoRef, {
  //       adicionais:  [{name:"catupiry",valor:3.5}, {name:"queijo",valor:2.5}, {name:"cheddar",valor:2.5},{name:"bacon",valor:3}, {name:"frango",valor:4}, {name:"salsicha",valor:2}, {name:"calabresa",valor:3.5}, {name:"cebola",valor:3}]
  //     });
    
  // }
  // for (let i = 0; i < atualizar.length ; i++){
  //   console.log(atualizar[i].id)
  //   fetchatualizar_cardapio(atualizar[i].id)
  // }
  //return componente
  return (
    <SafeAreaView style={styles.container}>
      {/* tab para navegacao entre as 3 pricnipais categorias*/}
      <Tab 
        dense
        value={index} onChange={(e) => setIndex(e)} 
        variant="primary"
        indicatorStyle={{
          backgroundColor: '#E8F0FE',
          height: 3
        }}
        buttonStyle={{
          backgroundColor: '#2D2F31',
        }}
        titleStyle={{
          fontFamily:'OpenSans-Bold',
          color:'#F4F7FC'
        }}
      >
        {uniqueCategories.map((category: any, index: number) => {
          let categoryName = '';
          if (category === 'comidas') {
            categoryName = 'Comidas';
          } else if (category === 'bar') {
            categoryName = 'Bar';
          } else if (category === 'bebidas') {
            categoryName = 'Bebidas';
          }
          return (
            
            <Tab.Item key={index} title={categoryName}  />
          );
        })}
      </Tab>
      
      <TabView value={index} onChange={setIndex} animationType="spring" >
        {/*criacao da 1 tabview Bebidas */}
        <TabView.Item style={{width: '100%' }}>
          {/*flatlist do accordion Bebidas */}
          <FlatList
              data={categoria_Bebidas}
              keyExtractor={(item,index) => `${index}`}
              
              renderItem={({ item,index }) =>  {
                
                if(item === 'no-alcool'){
                  
                return (
                    
                <ListItem.Accordion 
                
                  content={
                    <ListItem.Content >
                      <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Cervejas</ListItem.Subtitle >
                    </ListItem.Content>
                  }
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                    setExpanded2(false)
                    setExpanded3(false)
                    setExpanded4(false)
                    setExpanded5(false)
                    setExpanded6(false)
                    setExpanded7(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                  
                  {/* flatlist dos itens do cardapio === alcool*/} 
                  <FlatList
                    data={bebidas.filter((item:any)=> item.categoria_2 === 'alcool')}
                    keyExtractor={(item,index) => `${index}`}
                    renderItem={({ item,index }:{item:any,index:number}) =>  {
                      const find = props.adicionar_pedido.find(
                        (find:any) =>
                        find.id === item.id 
                      );
                      if(find){
                      return <Adicionar_list {...item}   trueorfalse={true}/>
                      }
                    
                    return <Adicionar_list {...item}   trueorfalse={false}/>
                    }}
                  />
                </ListItem.Accordion>)
                }else if(item === 'alcool'){
                  return (
                  <ListItem.Accordion
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtittle}>Refrigerantes</ListItem.Subtitle>
                      </ListItem.Content>
                    }
                    isExpanded={expanded2}
                    onPress={() => {
                      setExpanded2(!expanded2);
                      setExpanded(false)
                      setExpanded3(false)
                      setExpanded4(false)
                      setExpanded5(false)
                      setExpanded6(false)
                      setExpanded7(false)
                    }}
                    containerStyle={styles.tabaccordion}
                  >
                  {/* flatlist dos itens do cardapio === no-alcool*/} 
                    <FlatList
                      data={bebidas.filter((item:any)=> item.categoria_2 === 'no-alcool')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) => {
                        const find = props.adicionar_pedido.find(
                          (find:any) =>
                          find.id === item.id 
                        );
                        if(find){
                        return <Adicionar_list {...item} trueorfalse={true}/>
                        }
                      
                      return <Adicionar_list {...item} trueorfalse={false}/>
                      }}
                    />
                  </ListItem.Accordion>
                  )
                }else if (item === 'adicionar') {

                 return( 
                 <Button  
                    size='md'	
                    radius='lg' 
                    type='outline'
                    title={'Adicionar'}
                    titleStyle={{
                      fontFamily:'OpenSans-Bold',
                      color:'#F4F7FC'
                    }}
                    icon={{
                      name: 'add-circle',
                      type: 'ionicons',
                      size:35,
                      color: '#F4F7FC',
                    }}
                    containerStyle={{marginLeft:50,marginRight:50,marginTop:expanded||expanded2||expanded3 || expanded4 || expanded5 || expanded6 || expanded7?null:"100%"}}
                    buttonStyle={{backgroundColor:'#3c4043',borderColor:'tomato'}}
                    onPress={()=>{
                      props.navigation?.navigate('Pedido_Adicionar',{mesa:mesa,numero_mesa:numero_mesa})}} 
                  />)
                }
                return  null
              }}
          />
        </TabView.Item>
        {/*criacao da 2 tabview comidas */}
        <TabView.Item style={{  width: '100%' }}>
          {/*flatlist do accordion comidas */}
          <FlatList
            data={categoria_comidas}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'lanches'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Lanches</ListItem.Title>
                  </ListItem.Content>
                }
                isExpanded={expanded3}
                onPress={() => {
                  setExpanded3(!expanded3);
                  setExpanded(false)
                  setExpanded2(false)
                  setExpanded4(false)
                  setExpanded5(false)
                  setExpanded6(false)
                  setExpanded7(false)
                }}
                containerStyle={styles.tabaccordion}
              >
                  {/* flatlist dos itens do cardapio === lanches*/} 

                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'lanches')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) => {
                    const find = props.adicionar_pedido.find(
                      (find:any) =>
                      find.id === item.id 
                    );
                    if(find){
                    return <Adicionar_list {...item}  adicionar_retirar  trueorfalse={true} />
                    }
                  
                  return <Adicionar_list {...item} adicionar_retirar  trueorfalse={false}/>
                  }}
                />
              </ListItem.Accordion>)
              }else if(item === 'hotdogs'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Hot Dogs</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded4}
                  onPress={() => {
                    setExpanded4(!expanded4);
                    setExpanded(false)
                    setExpanded2(false)
                    setExpanded3(false)
                    setExpanded5(false)
                    setExpanded6(false)
                    setExpanded7(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === hotdogs*/} 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'hotdogs')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  {
                    const find = props.adicionar_pedido.find(
                      (find:any) =>
                      find.id === item.id 
                    );
                    if(find){
                    return <Adicionar_list {...item} adicionar_retirar  trueorfalse={true} />
                    }
                  
                  return <Adicionar_list {...item} adicionar_retirar  trueorfalse={false}/>
                  }}
                />
                </ListItem.Accordion>
                )
              }else if (item === 'porcoes'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Porções</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded5}
                  onPress={() => {
                    setExpanded5(!expanded5);
                    setExpanded(false)
                    setExpanded2(false)
                    setExpanded3(false)
                    setExpanded4(false)
                    setExpanded6(false)
                    setExpanded7(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === porcoes*/} 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'porcoes')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  {
                    const find = props.adicionar_pedido.find(
                      (find:any) =>
                      find.id === item.id 
                    );
                    if(find){
                    return <Adicionar_list {...item}   trueorfalse={true} />
                    }
                 
                  return <Adicionar_list {...item} trueorfalse={false}/>
                  }}
                />
                </ListItem.Accordion>
                )
              }else if (item === 'adicionar') {

                return( 
                <Button  
                   size='md'	
                   radius='lg' 
                   type='outline'
                   title={'Adicionar'}
                   titleStyle={{
                     fontFamily:'OpenSans-Bold',
                     color:'#F4F7FC'
                   }}
                   icon={{
                     name: 'add-circle',
                     type: 'ionicons',
                     size:35,
                     color: '#F4F7FC',
                   }}
                   containerStyle={{marginLeft:50,marginRight:50,marginTop:expanded||expanded2||expanded3 || expanded4 || expanded5 || expanded6 || expanded7?null:'89%'}}
                   buttonStyle={{backgroundColor:'#3c4043',borderColor:'tomato'}}
                   onPress={()=>{
                    props.navigation?.navigate('Pedido_Adicionar',{mesa:mesa,numero_mesa:numero_mesa})}} 
                 />)
               }
              return  null
            }}
          />
        </TabView.Item>
        {/*criacao da 3 tabview bar */}
        <TabView.Item style={{width: '100%' }}>
          <FlatList
            data={categoria_bar}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'drinks'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                    <ListItem.Subtitle style={styles.subtittle}>Drinks</ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expanded6}
                onPress={() => {
                  setExpanded6(!expanded6);
                  setExpanded(false)
                  setExpanded2(false)
                  setExpanded3(false)
                  setExpanded4(false)
                  setExpanded5(false)
                  setExpanded7(false)
                }}
                containerStyle={styles.tabaccordion}
              >
              {/* flatlist dos itens do cardapio === drinks*/} 
              <FlatList
                data={bar.filter((item:any)=> item.categoria_2 === 'drinks')}
                keyExtractor={(item,index) => `${index}`}
                renderItem={({ item,index }) =>  {
                  const find = props.adicionar_pedido.find(
                    (find:any) =>
                    find.id === item.id 
                  );
                  if(find){
                  return <Adicionar_list {...item} trueorfalse={true} />
                  }
                
                return <Adicionar_list {...item}  trueorfalse={false}/>
                }}
              />
              </ListItem.Accordion>)
              }else if(item === 'sucos'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Sucos</ListItem.Subtitle>
                    </ListItem.Content>
                  }
                  isExpanded={expanded7}
                  onPress={() => {
                    setExpanded7(!expanded7);
                    setExpanded(false)
                    setExpanded2(false)
                    setExpanded3(false)
                    setExpanded4(false)
                    setExpanded5(false)
                    setExpanded6(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === sucos*/} 

                <FlatList
                  data={bar.filter((item:any)=> item.categoria_2 === 'sucos')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) => {
                    const find = props.adicionar_pedido.find(
                      (find:any) =>
                      find.id === item.id 
                    );
                    if(find){
                    return <Adicionar_list {...item}  trueorfalse={true}/>
                    }
                 
                  return <Adicionar_list {...item}   trueorfalse={false}/>
                  }}
                />
                </ListItem.Accordion>
                )
              }else if (item === 'adicionar') {

                return( 
                <Button  
                   size='md'	
                   radius='lg' 
                   type='outline'
                   title={'Adicionar'}
                   titleStyle={{
                     fontFamily:'OpenSans-Bold',
                     color:'#F4F7FC'
                   }}
                   icon={{
                     name: 'add-circle',
                     type: 'ionicons',
                     size:35,
                     color: '#F4F7FC',
                   }}
                   containerStyle={{marginLeft:50,marginRight:50,marginTop:expanded||expanded2||expanded3 || expanded4 || expanded5 || expanded6 || expanded7?null:'100%'}}
                   buttonStyle={{backgroundColor:'#3c4043',borderColor:'tomato'}}
                   onPress={()=>{
                    props.navigation?.navigate('Pedido_Adicionar',{mesa:mesa,numero_mesa:numero_mesa})}} 
                 />)
               }
              return  null
            }}
          />
        </TabView.Item>
      </TabView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#202124',
  },
  tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold'
  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular'
  }
});

const mapStateProps = ({ cardapio,pedidos,state }: { cardapio: any,pedidos:any,state:any }) => {
  return {
    cardapio: cardapio.cardapio,
    adicionar_pedido:pedidos.adicionar_pedido,
    inicial_state_outros:state.state_outros

  };
};

export default connect(mapStateProps,null)(Adicionar);
