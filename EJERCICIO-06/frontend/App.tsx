import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, SafeAreaView, Text, View } from 'react-native';
type Libro={id:number;titulo:string;autor:string;genero:string, leido:boolean};
const API_URL='http://172.22.26.192:3000';

export default function App(){
 const [libros,setLibros]=useState<Libro[]>([]);

 async function cargar(){
   const r=await fetch(API_URL+'/libros');
   setLibros(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 function confirmar(libro:Libro){
   Alert.alert('Eliminar libro',libro.titulo,[
     {text:'Cancelar',style:'cancel'},
     {text:'Eliminar',style:'destructive',onPress:()=>eliminar(libro.id)},
   ]);
 }
 //Creamos una funcion que llame a la API para actualizar leido, cuando termine la funcion, actualizamos la página. 
 function actualizarLeido(id:number,leido:boolean){
   fetch(API_URL+'/libros/'+id,{method:'PATCH',body:JSON.stringify({id})});
   // Sincronizamos el estado local después de actualizar en PostgreSQL.
   setLibros(actuales=>actuales.map(l=>l.id===id?{...l,leido}:l));
 }

 async function eliminar(id:number){
   await fetch(API_URL+'/libros/'+id,{method:'DELETE'});
   // Sincronizamos el estado local después de borrar en PostgreSQL.
   setLibros(actuales=>actuales.filter(l=>l.id!==id));
 }

 return <SafeAreaView>
   <Text>📚 My Library</Text>
   <FlatList data={libros} keyExtractor={x=>String(x.id)} renderItem={({item})=>
     <View><Text>{item.titulo}</Text>
     <Button title="Eliminar" onPress={()=>confirmar(item)}/>
      <Button title={item.leido?'Marcar como no leído':'Marcar como leído'} onPress={()=>actualizarLeido(item.id,!item.leido)}/>
     </View>}/>

 </SafeAreaView>;
}