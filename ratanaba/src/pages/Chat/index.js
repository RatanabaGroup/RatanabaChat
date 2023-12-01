import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Modal, Text, Alert,
  KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import ChatMessage from '../../components/ChatMessage';

export default function Chat({ route }) {

  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const user = auth().currentUser.toJSON();

  const [modalVisible, setModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const unsubscribeListener = firestore().collection('grupos')
      .doc(thread._id).collection('mensagens')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data()
          const data = {
            _id: doc.id, text: '',
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
      .collection('grupos').doc(thread._id)
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
      .collection('grupos').doc(thread._id)
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

  // function showFileOptions() {
  //   Alert.alert(
  //     `Opções`,
  //     "Deseja enviar que tipo de arquivo?",
  //     [{
  //       text: "Cancelar",
  //       style: "cancel"
  //     }, {
  //       text: "Foto",
  //       onPress: () => { handleImgGallery() }
  //     }, {
  //       text: "Documento",
  //       onPress: () => { handleFileGallery() }
  //     }
  //     ]
  //   );
  // }

  // async function handleFileGallery() {
  //   try {
  //     const result = await DocumentPicker.pick({
  //         type: [DocumentPicker.types.pdf],
  //     });
  //     console.log(result[0].uri);
  //     handlePdfUpload(result[0].uri);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('Envio do pdf cancelado');
  //     } else {
  //       console.log('Erro ao escolher o documento', err);
  //     }
  //   }
  // };

  // async function handlePdfUpload(uri) {
  //   const pdfName = uri.substring(uri.lastIndexOf('/') + 1);
  //   const exit = pdfName.split('.').pop();
  //   const newName = `${pdfName.split('.')[0]}${Date.now()}.${exit}`;
  
  //   await storage().ref(`pdfs/${newName}`).putFile(uri);
  
  //   const pdfUrl = await storage().ref(`pdfs/${newName}`).getDownloadURL();
    
  //   await firestore().collection('grupos').doc(thread._id)
  //     .collection('mensagens')
  //     .add({
  //       text: pdfUrl, message: 'pdf',
  //       createdAt: firestore.FieldValue.serverTimestamp(),
  //       user: { _id: user.uid, displayName: user.displayName },
  //     })
  
  //   await firestore().collection('grupos').doc(thread._id)
  //     .set({ lastMessage: {
  //           text: '📄 PDF', message: 'pdf',
  //           createdAt: firestore.FieldValue.serverTimestamp(),
  //       },
  //     },{ merge: true }
  //     );
  // }

  function handleImgGallery() {
    ImagePicker.openPicker({
      cropping: false
    }).then(async image => {
      setCapturedImage(image);
      setModalVisible(true);
    }).catch(err => {
      console.log('OPÇÃO 1: Usuário cancelou a seleção de imagem. OU')
      console.log('OPÇÃO 2: Erro ao selecionar imagem:', err)
    });
  }

  function handleTakePhoto() {
    ImagePicker.openCamera({
      cropping: false
    }).then(async image => {
      setCapturedImage(image);
      setModalVisible(true);
    }).catch(err => {
      console.log('Erro ao tirar foto da câmera:', err);
    });
  }

  async function handleSendImg() {
    if (capturedImage) {
      handleImageUpload(capturedImage.path);
      setModalVisible(false);
    }
  }

  function handleDiscardImg() { setModalVisible(false) }

  async function handleImageUpload(uri) {
    const imgName = uri.substring(uri.lastIndexOf('/') + 1);
    const exit = imgName.split('.').pop();
    const newName = `${imgName.split('.')[0]}${Date.now()}.${exit}`;

    await storage().ref(`images/${newName}`).putFile(uri);

    const imgUrl = await storage().ref(`images/${newName}`).getDownloadURL();

    await firestore().collection('grupos').doc(thread._id)
      .collection('mensagens')
      .add({
        text: imgUrl, message: 'image',
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: { _id: user.uid, displayName: user.displayName }
      })

    await firestore().collection('grupos').doc(thread._id)
      .set({
        lastMessage: {
          text: '📷 Foto', message: 'image',
          createdAt: firestore.FieldValue.serverTimestamp(),
        }
      }, { merge: true }
      )
  }

  return (
    <SafeAreaView style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja enviar a foto tirada?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton1}
                onPress={handleSendImg}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton2}
                onPress={handleDiscardImg}
              >
                <Text style={styles.modalButtonText}>Descartar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        style={{ width: '100%' }}
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

          <TouchableOpacity onPress={handleImgGallery}>
            <View style={styles.buttonUpload}>
              <Feather name="paperclip" size={22} color="#A8A8A8" />
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

            <TouchableOpacity onPress={handleTakePhoto}>
              <View style={styles.buttonPhoto}>
                <Feather name="camera" size={22} color="#A8A8A8" />
              </View>
            </TouchableOpacity>
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
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonPhoto: {
    marginRight: 14,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 48,
  },
  buttonSend: {
    backgroundColor: '#51C880',
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },

  //-----------------------------------------

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton1: {
    flex: 1,
    backgroundColor: '#51C880',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButton2: {
    flex: 1,
    backgroundColor: '#EEA262',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})