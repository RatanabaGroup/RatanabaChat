import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
        Image, Modal, ActivityIndicator, FlatList, Alert } from 'react-native';

// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AddButton from '../../components/AddButton';
import ModalGrupo from '../../components/ModalGrupo';
import ChatList from '../../components/ChatList';

// console.disableYellowBox = true;

export default function Dashboard(){
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);

//   useEffect(()=>{
//     const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
//     setUser(hasUser);

//   }, [isFocused]);


//   useEffect(()=>{
//     let isActive = true;

//     function getChats(){
//       firestore()
//       .collection('MESSAGE_THREADS')
//       .orderBy('lastMessage.createdAt', 'desc')
//       .limit(10)
//       .get()
//       .then((snapshot)=>{
//         const threads = snapshot.docs.map( documentSnapshot => {
//           return {
//             _id:  documentSnapshot.id,
//             name: '',
//             lastMessage: { text: '' },
//             ...documentSnapshot.data()
//           }
//         })
//         if(isActive){
//           setThreads(threads);
//           setLoading(false);
//         }
//       })
//     }

//     getChats();

//     return () => {
//        isActive = false;
//     }

//   }, [isFocused, updateScreen]);

  function deleteRoom(ownerId, idRoom){
    console.log(typeof idRoom)
    // Se está tentando deletar e nao é o dono
    if(ownerId !== user?.uid) return;

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja deletar essa sala?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => handleDeleteRoom(idRoom)
        }
      ]
    )

  }

  async function handleDeleteRoom(idRoom){
    // await firestore()
    // .collection('MESSAGE_THREADS')
    // .doc(idRoom)
    // .delete();

    // setUpdateScreen(!updateScreen);
  }

  function handleSignOut(){
    navigation.navigate("SignIn")

    // auth()
    // .signOut()
    // .then(()=>{
    //   setUser(null);
    //   navigation.navigate("SignIn")
    // })
    // .catch(()=>{
    //   console.log("Nao ha usuario logado")
    // })
  }

  // if(loading){
  //   return(
  //    <ActivityIndicator size="large" color="#555" style={{ marginTop: 250 }} />
  //   )
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        { user ? (
          <TouchableOpacity onPress={handleSignOut}>
            <MaterialIcons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity/>
        )}

          <Image style={styles.logo} source={require('../SignIn/snow.png')} />

        <TouchableOpacity onPress={ () => navigation.navigate("Search")}>
            <MaterialIcons name="search" size={28} color="#FFF" />
          </TouchableOpacity>
      </View>

      <FlatList
        data={threads}
        keyExtractor={ item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          <ChatList data={item} deleteRoom={ () => deleteRoom(item.owner, item._id) }  userStatus={user} />
        )}
      />

      <AddButton setVisible={ () => setModalVisible(true) }  userStatus={user} />

      <Modal 
        visible={modalVisible} 
        animationType='fade'
        transparent={true}
      >
        <ModalGrupo 
        setVisible={ () => setModalVisible(false) } 
        setUpdateScreen={ () => setUpdateScreen(!updateScreen) }
        />
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FFF'
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 34,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2E54D4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  logo:{
    width: 60,
    height: 60
  }
})