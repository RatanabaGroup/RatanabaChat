import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, SafeAreaView, FlatList,
  KeyboardAvoidingView, Platform, TextInput, TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import ChatMessage from '../../components/ChatMessage';

export default function Chat({ route }) {

  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const user = auth().currentUser.toJSON();

  useEffect(() => {
    const unsubscribeListener = firestore().collection('grupos')
      .doc(thread._id)
      .collection('mensagens')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data()
          const data = {
            _id: doc.id,
            text: '',
            createdAt: firestore.FieldValue.serverTimestamp(),
            ...firebaseData
          }
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName
            }
          }
          return data;
        })
        setMessages(messages)
      })
    return () => unsubscribeListener()
  }, []);

  async function handleSend() {
    if (input === '') return;

    await firestore()
      .collection('grupos')
      .doc(thread._id)
      .collection('mensagens')
      .add({
        text: input,
        message: 'text',
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: user.uid,
          displayName: user.displayName
        }
      })

    await firestore()
      .collection('grupos')
      .doc(thread._id)
      .set({
        lastMessage: {
          text: input,
          message: 'text',
          createdAt: firestore.FieldValue.serverTimestamp(),
        }
      }, { merge: true }
      )
    setInput('');
  }

  function handleUpload() {
    ImagePicker.openPicker({
      cropping: false
    }).then(async image => {
      const imgName = image.path.substring(image.path.lastIndexOf('/') + 1);
        const exit = imgName.split('.').pop();
        const newName = `${imgName.split('.')[0]}${Date.now()}.${exit}`;

        await storage().ref(`chatMedia/${newName}`).putFile(image.path);

        const imgUrl = await storage().ref(`chatMedia/${newName}`).getDownloadURL()

        await firestore().collection('grupos').doc(thread._id)
          .collection('mensagens')
          .add({
            text: imgUrl, message: 'image',
            createdAt: firestore.FieldValue.serverTimestamp(),
            user: { _id: user.uid, displayName: user.displayName }
          })

        await firestore().collection('grupos').doc(thread._id)
          .set({
            lastMessage: { text: '📷 Foto', message: 'image',
              createdAt: firestore.FieldValue.serverTimestamp(),
            } }, { merge: true }
          )

    }).catch(error => {
      console.log('OPÇÃO 1: Usuário cancelou a seleção de imagem. OU')
      console.log('OPÇÃO 2: Erro ao selecionar imagem:', error)
    });
  }



  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ width: 'auto' }}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <ChatMessage data={item} thread={thread?._id} />}
        inverted={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : 'height'}
        style={{ width: '100%' }}
        keyboardVerticalOffset={-100}
      >
        <View style={styles.containerInput}>

          <TouchableOpacity onPress={handleUpload}>
            <View style={styles.buttonUpload}>
              <Feather name="paperclip" size={26} color="#A8A8A8" />
            </View>
          </TouchableOpacity>

          <View style={styles.mainContainerInput}>
            <TextInput
              placeholder="Hable..."
              style={styles.textInput}
              value={input}
              onChangeText={(text) => setInput(text)}
              multiline={true}
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity onPress={handleSend}>
            <View style={styles.buttonSend}>
              <Feather name="send" size={22} color="#FFF" />
            </View>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerInput: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end'
  },
  buttonUpload: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 48,
  },
  buttonSend: {
    backgroundColor: '#51c880',
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  }
})