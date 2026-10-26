import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,TextInput,View } from 'react-native';
type Evento={id:number;nombre:string;ciudad:string;categoria:string;fecha:string};
const API_URL='http://172.22.26.192:3000';
export default function App(){
 const [eventos,setEventos]=useState<Evento[]>([]);
 const [ciudad,setCiudad]=useState('Zaragoza');
 const [categoria,setCategoria]=useState('Tecnologia');
 const [error,setError]=useState('');
 async function filtrar(ciudadFiltro=ciudad,categoriaFiltro=categoria){
   const params=new URLSearchParams();
   if(ciudadFiltro.trim()) params.set('ciudad',ciudadFiltro.trim());
   if(categoriaFiltro.trim()) params.set('categoria',categoriaFiltro.trim());
   const query=params.toString();
   const r=await fetch(`${API_URL}/eventos${query ? `?${query}` : ''}`);
   if(!r.ok) throw new Error('No se pudieron cargar los eventos');
   setEventos(await r.json());
   setError('');
 }
 useEffect(()=>{
   filtrar().catch((e:unknown)=>setError(e instanceof Error ? e.message : 'Error al cargar eventos'));
 },[]);
 function aplicarFiltros(){
   filtrar().catch((e:unknown)=>setError(e instanceof Error ? e.message : 'Error al cargar eventos'));
 }
 function quitarFiltros(){
   setCiudad('');
   setCategoria('');
   filtrar('','').catch((e:unknown)=>setError(e instanceof Error ? e.message : 'Error al cargar eventos'));
 }
 return <SafeAreaView><Text>🎟️ Event Radar</Text>
 <Text>Ciudad</Text>
 <TextInput placeholder="Cualquier ciudad" value={ciudad} onChangeText={setCiudad}/>
 <Text>Categoría</Text>
 <TextInput placeholder="Cualquier categoría" value={categoria} onChangeText={setCategoria}/>
 <Button title="Aplicar filtros" onPress={aplicarFiltros}/>
 <Button title="Quitar filtros" onPress={quitarFiltros}/>
 <Text>Eventos filtrados</Text>
 {error ? <Text>{error}</Text> : null}
 <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.nombre}</Text><Text>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>;
}