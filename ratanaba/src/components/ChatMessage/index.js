import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ChatMessage({ data, thread }) {
  const user = auth().currentUser.toJSON();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.text);
  const [relation, setRelation] = useState([]);

  const isMyMessage = useMemo(() => {
    return data?.user?._id === user.uid
  }, [data])
  
  useEffect(() => {
    const fetchData = async () => {
      const participantsCollection = await firestore()
        .collection('grupos').doc(thread)
        .collection('participantes').get();

      participantsCollection.docs.map(doc => {
        if (doc.data().email === user.email) {
          const participantData = {
            ...doc.data(),
            id: doc.id
          };
          setRelation(participantData);
        }
      });
    };

    console.log(relation);

    fetchData();
  }, []);

  // async function deleteMessage() {
  //   try {
  //     const unsubscribe = firestore()
  //       .collection('grupos')
  //       .onSnapshot((querySnapshot) => {
  //         const mensagens = [];
  //         querySnapshot.forEach((doc) => {
  //           mensagens.push({
  //             id: doc.id,
  //             ...doc.data(),
  //           });
  //         });
  //         console.log("oii");
  //         callback(mensagens);
  //       });
  //       // Se necessário, você pode retornar a função de cancelamento para desinscrever-se mais tarde
  //     return () => unsubscribe();
  //   } catch (error) {
  //     console.error('Erro ao atualizar mensagem:', error);
  //   }
  // }

  function editMessage(id_user, id) {
    if (id_user !== user?.uid && relation.position !== "Admin") return;

    Alert.alert(
      "Editar ou deletar?",
      "Escolha uma opção:",
      [
        {
          text: "Editar",
          onPress: () => {
            setIsEditing(true);
          }
        },
        {
          text: "Deletar",
          onPress: () => {
            deleteMessage(id)
          }
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  }

  async function updateMessage(documentId) {
    try {
      await firestore().collection('grupos').doc(thread)
        .collection('mensagens').doc(documentId)
        .update({
          text: editedText
        });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
    }
  }

  async function deleteMessage(documentId) {
    try {
      await firestore().collection('grupos').doc(thread)
        .collection('mensagens').doc(documentId)
        .delete();
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
    }
  }


  const handleTextChange = (text) => {
    setEditedText(text);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => editMessage(data?.user?._id, data?._id)}>
        <View style={[styles.messageBox, {
          backgroundColor: data.system === true ? 'transparent' : isMyMessage ? '#DCF8C5' : '#FFF',
          marginLeft: isMyMessage ? 50 : 0,
          marginRight: isMyMessage ? 0 : 50,
          borderBottomWidth: 1,
          borderBottomColor: data.system === true ? '#000' : 'transparent'
        }
        ]}
        >
          {!isMyMessage &&
            <Text style={styles.name}>{data?.user?.displayName}</Text>
          }
          
          {isEditing ? (
            <TextInput
              value={editedText}
              onChangeText={handleTextChange}
              onBlur={() => updateMessage(data._id)} 
              autoFocus
            />

          ) : (
            <Text style={styles.message}>{editedText}</Text>
          )}

          <Text style={styles.hour}>
            {new Date(data?.createdAt?.nanoseconds * 1000 + data?.createdAt?.seconds).toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit'})}
          </Text>

        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10
  },
  name: {
    color: '#F53745',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hour:{
    marginLeft: 280,
    fontSize: 10
  }
});