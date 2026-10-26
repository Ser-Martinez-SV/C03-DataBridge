// App.tsx
// RESPONSABILIDAD: mostrar una Playlist relacionada y añadir canciones.
import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';

type Cancion={id:number;titulo:string;artista:string};
type Playlist={id:number;nombre:string;canciones:Cancion[]};
const API_URL='http://172.22.26.192:3000';

export default function App(){
 const [playlist,setPlaylist]=useState<Playlist|null>(null);
 const [titulo,setTitulo]=useState('');
 const [artista,setArtista]=useState('');
 const [guardando,setGuardando]=useState(false);
 const [error,setError]=useState('');

 async function cargar(){
   const r=await fetch(API_URL+'/playlists/1');
   if(!r.ok) throw new Error('No se pudo cargar la playlist');
   setPlaylist(await r.json());
 }

 useEffect(()=>{
   cargar().catch((e:unknown)=>{
     setError(e instanceof Error ? e.message : 'No se pudo cargar la playlist');
   });
 },[]);

 async function agregarCancion(){
   if(!playlist || !titulo.trim() || !artista.trim()) return;
   setGuardando(true);
   setError('');
   try{
     const r=await fetch(API_URL+'/playlists/canciones',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         titulo:titulo.trim(),
         artista:artista.trim(),
         playlistId:playlist.id,
       }),
     });
     if(!r.ok) throw new Error('No se pudo añadir la canción');
     await cargar();
     setTitulo('');
     setArtista('');
   }catch(e:unknown){
     setError(e instanceof Error ? e.message : 'No se pudo añadir la canción');
   }finally{
     setGuardando(false);
   }
 }

 if(!playlist)return <SafeAreaView>
   <Text>{error || 'Cargando...'}</Text>
   {error ? <Button title="Reintentar" onPress={()=>cargar().catch((e:unknown)=>{
     setError(e instanceof Error ? e.message : 'No se pudo cargar la playlist');
   })}/> : null}
 </SafeAreaView>;

 return <SafeAreaView>
   <Text>🎵 {playlist.nombre}</Text>
   <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View><Text>{item.titulo}</Text><Text>{item.artista}</Text></View>}/>
   <TextInput
     placeholder="Título de la canción"
     value={titulo}
     onChangeText={setTitulo}
   />
   <TextInput
     placeholder="Artista"
     value={artista}
     onChangeText={setArtista}
   />
   {error ? <Text>{error}</Text> : null}
   <Button
     title={guardando ? 'Añadiendo...' : '＋ Añadir canción'}
     onPress={agregarCancion}
     disabled={guardando || !titulo.trim() || !artista.trim()}
   />
 </SafeAreaView>;
}