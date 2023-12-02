
import {GET_USER, LOGIN_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_fun} from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';




//onSnapshot para atualizar caso alguma informacao mude 

export const startUser_func= () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_func"));
      onSnapshot(q, (snapshot) => {
      
        console.log("user_func onsnap")
        dispatch(fetchuser_get())
      }); 
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do User: funcionarios'
          }))
      }
  };
};


// retornar users e Atualizar users redux [users]

export const fetchuser_get = () =>{
    return async(dispatch:any)=>{
        try {
            const usersCol = collection(db, 'user_func');
            const querySnapshot = await getDocs(usersCol);
            const users:any = querySnapshot.docs.map((doc) => {
              const rawUsers = doc.data();
              return {
                ...rawUsers,
                id: doc.id
              };
            }); 
            
            // console.log("users")
            dispatch(setUser(users))
            
          } catch (e) {
            console.log(e)
            dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
            }))
          }
    }
}
export const add_Func = (user:user_fun) => {
  return async(dispatch:any)=>{
    try {
        
        const usersCol = collection(db, 'user_func');
        await addDoc(usersCol,user);
        
        // console.log("users")
        dispatch(fetchuser_get())
        
      } catch (e) {
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}

// Atualizar user call :
export const fetch_user_call = (id:string,number:number) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          call: number
      });
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user call'
      }))
    }
   
  }
} 
export const setUser =  (users:user_fun[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}
export const setUser_login =  (user:user_fun) => {
    return { 
        type:LOGIN_USER,
        payload:user
    }
    
}