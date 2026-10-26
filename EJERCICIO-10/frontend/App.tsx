import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,TextInput,View } from 'react-native';

type PrioridadDestino='alta'|'media'|'baja';
type Destino={
 id:number;
 ciudad:string;
 pais:string;
 descripcion:string;
 prioridad:PrioridadDestino;
 visitado:boolean;
};
const API_URL='http://172.22.26.192:3000';

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');
 const [prioridad,setPrioridad]=useState<PrioridadDestino>('alta');
 const [visitado,setVisitado]=useState(false);
 const [error,setError]=useState('');

 function siguientePrioridad(actual:PrioridadDestino):PrioridadDestino{
   const prioridades:PrioridadDestino[]=['alta','media','baja'];
   return prioridades[(prioridades.indexOf(actual)+1)%prioridades.length];
 }

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/destinos');
     setDestinos(await r.json());
     setError('');
   }catch{setError('No se pudieron cargar los destinos.');}
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/destinos',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         ciudad,
         pais,
         descripcion:'Nuevo destino',
         prioridad,
         visitado,
       }),
     });
     setCiudad('');
     setPais('');
     setPrioridad('alta');
     setVisitado(false);
     await cargar();
   }catch{setError('No se pudo crear.');}
 }

 async function actualizar(id:number,cambios:Partial<Destino & {prioridad:PrioridadDestino;visitado:boolean}>){
   try{
     await request(API_URL+'/destinos/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify(cambios),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

 async function editar(id:number){
   await actualizar(id,{descripcion:'Destino actualizado'});
 }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('No se pudo eliminar.');}
 }

 return <SafeAreaView>
   <Text>🌍 Wander</Text>
   {error!==''&&<Text>{error}</Text>}
   <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
   <TextInput placeholder="País" value={pais} onChangeText={setPais}/>
   <Button
     title={`Prioridad: ${prioridad.toUpperCase()}`}
     onPress={()=>setPrioridad(siguientePrioridad(prioridad))}
   />
   <Button
     title={visitado ? '✓ Visitado' : 'Marcar como visitado'}
     onPress={()=>setVisitado(!visitado)}
   />
   <Button title="Crear destino" onPress={crear}/>
   <FlatList
     data={destinos}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View>
       <Text>{item.ciudad} · {item.pais}</Text>
       <Text>{item.descripcion}</Text>
       <Text>Prioridad {item.prioridad?.toUpperCase() ?? 'MEDIA'}</Text>
       <Button
         title="Cambiar prioridad"
         onPress={()=>actualizar(item.id,{
           prioridad:siguientePrioridad(item.prioridad ?? 'media'),
         })}
       />
       <Button
         title={item.visitado ? '✓ Visitado' : 'Marcar como visitado'}
         onPress={()=>actualizar(item.id,{visitado:!item.visitado})}
       />
       <Button title="Editar" onPress={()=>editar(item.id)}/>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}