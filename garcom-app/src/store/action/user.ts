
import {GET_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_fun} from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';
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
export const setUser =  (users:user_fun[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}