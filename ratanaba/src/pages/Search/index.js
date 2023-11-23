import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
        TextInput, FlatList, Keyboard } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatList from '../../components/ChatList';
import { useIsFocused } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// console.disableYellowBox = true;

export default function Search(){
  const isFocused = useIsFocused();

  const [input, setInput] = useState('')
  const [chats, setChats] = useState([])
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);
  }, [isFocused]);

  async function handleSearch(){
    if(input === '') return;

    const responseSearch = await firestore()
    .collection('grupos')
    .where('name', '>=', input)
    .where('name', '<=', input + '\uf8ff')
    .get()
    .then( (querySnapshot) => {

      const threads = querySnapshot.docs.map( documentSnapshot => {
        return{
          _id: documentSnapshot.id,
          name: '',
          lastMessage: { text: '' },
          ...documentSnapshot.data()
        }
      })

      setChats(threads);
      //console.log(threads)
      setInput('');
      Keyboard.dismiss();
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          placeholder='Nome da unidade'
          value={input}
          onChangeText={ (text) => setInput(text) }
          style={styles.input}
          // autoCapitalize={'none'}
        />

        <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch} >
          <MaterialIcons name="search" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList 
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={ item => item._id}
        renderItem={ ({ item}) => <ChatList data={item} userStatus={user} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  containerInput:{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  input:{
    backgroundColor: '#EBEBEB',
    marginLeft: 10,
    height: 50,
    width: '75%',
    borderRadius: 4,
    padding: 12,
  },
  buttonSearch:{
    backgroundColor: '#2e54d4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 12,
    marginRight: 10,
  }
})