// import React, { useMemo, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
// // import auth from '@react-native-firebase/auth';
// // import firestore from '@react-native-firebase/firestore';

// export default function ChatMessage({ data, thread }) {
// //   const user = auth().currentUser.toJSON();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedText, setEditedText] = useState(data.text);

//   const isMyMessage = useMemo(() => {
//     return data?.user?._id === user.uid
//   }, [data])
//   console.log(data);

//   function editMessage(id_user, id) {
//     if (id_user !== user?.uid) return;


//     Alert.alert(
//       "Editar ou deletar?",
//       "Escolha uma opção:",
//       [
//         {
//           text: "Editar",
//           onPress: () => {
//             setIsEditing(true);
//           }
//         },
//         {
//           text: "Deletar",
//           onPress: () => {
//             deleteMessage(id)
//           }
//         },
//         {
//           text: "Cancelar",
//           style: "cancel"
//         }
//       ]
//     );
//   }

//   async function updateMessage(documentId) {
//     // console.log(documentId);
//     // try {
//     //   await firestore()
//     //     .collection('MESSAGE_THREADS')
//     //     .doc(thread)
//     //     .collection('MESSAGES')
//     //     .doc(documentId)
//     //     .update({
//     //       text: editedText
//     //     });
//     //   setIsEditing(false);
//     // } catch (error) {
//     //   console.error('Erro ao atualizar mensagem:', error);
//     }
//   }

//   async function deleteMessage(documentId) {
//     // try {
//     //   await firestore()
//     //     .collection('MESSAGE_THREADS')
//     //     .doc(thread)
//     //     .collection('MESSAGES')
//     //     .doc(documentId)
//     //     .delete();
//     // } catch (error) {
//     //   console.error('Erro ao atualizar mensagem:', error);
//     // }
//   }


//   const handleTextChange = (text) => {
//     setEditedText(text);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => editMessage(data?.user?._id, data?._id)}>
//         <View style={[styles.messageBox, {
//           backgroundColor: data.system === true ? 'transparent' : isMyMessage ? '#DCF8C5' : '#FFF',
//           marginLeft: isMyMessage ? 50 : 0,
//           marginRight: isMyMessage ? 0 : 50,
//           borderBottomWidth: 1,
//           borderBottomColor: data.system === true ? '#000' : 'transparent'
//         }
//         ]}
//         >
//           {!isMyMessage &&
//             <Text style={styles.name}>{data?.user?.displayName}</Text>
//           }
          
//           {isEditing ? (
//             <TextInput
//               value={editedText}
//               onChangeText={handleTextChange}
//               onBlur={() => updateMessage(data._id)} 
//               autoFocus
//             />

//           ) : (
//             <Text style={styles.message}>{editedText}</Text>
//           )}

//           <Text style={styles.hour}>
//             {new Date(data?.createdAt?.nanoseconds * 1000 + data?.createdAt?.seconds).toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit'})}
//           </Text>

//         </View>
//       </TouchableOpacity>
//     </View>
//   );


// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   messageBox: {
//     borderRadius: 5,
//     padding: 10
//   },
//   name: {
//     color: '#F53745',
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   hour:{
//     marginLeft: 280,
//     fontSize: 10
//   }
// });