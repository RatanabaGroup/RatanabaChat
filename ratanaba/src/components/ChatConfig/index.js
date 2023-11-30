import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Popover from 'react-native-popover-view';
import Feather from 'react-native-vector-icons/Feather'; // Make sure you have this import
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ChatConfig({ route }) {
  const [participants, setParticipants] = useState([]);
  const [relation, setRelation] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const { idGrupo } = route.params;
  const user = auth().currentUser.toJSON();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const participantsCollection = await firestore()
        .collection('grupos')
        .doc(idGrupo)
        .collection('participantes')
        .get();

      const participantsData = participantsCollection.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      participantsCollection.docs.forEach((doc) => {
        if (doc.data().email === user.email) {
          const participantData = {
            ...doc.data(),
            id: doc.id,
          };
          setRelation(participantData);
        }
      });

      setParticipants(participantsData);
    };

    fetchData();
  }, [idGrupo, user.email]);

  function showPopover(item) {
    if (relation.position === "Admin"){
      if (item.position === "Admin") {
        return null
      } else{
        Alert.alert(
          `Deseja remover ${item.name}?`,
          "Escolha uma opção:",
          [
            {
              text: "Remover",
              onPress: () => {
                removeParticipant(item.id);
              }
            }, {
              text: "Cancelar",
              style: "cancel"
            }
          ]
        );
      }
    } else {
      return null
    }
  }

  const exitRoom = () => {
    Alert.alert('Atenção', 'Você tem certeza que deseja sair do grupo?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: handleExitRoom,
      },
    ]);
  };

  const handleExitRoom = async () => {
    try {
      await firestore()
        .collection('grupos')
        .doc(route.params.idGrupo)
        .collection('participantes')
        .doc(relation.id)
        .delete();
    } catch (err) {
      console.error('Erro ao atualizar mensagem:', err);
    }
    navigation.navigate('Dashboard');
  };

  const removeParticipant = async (id) => {
    try {
      await firestore()
        .collection('grupos')
        .doc(route.params.idGrupo)
        .collection('participantes')
        .doc(id)
        .delete();
    } catch (err) {
      console.error('Erro ao atualizar mensagem:', err);
    }
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.nameText}>Participantes</Text>
      </View>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity
              onPress={() => showPopover(item)}
              style={styles.row}
            >
              <View style={styles.content}>
                <Text style={styles.contentName}>{item.name}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.contentPosition}>{item.position}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.bottomBorder} />
          </>
        )}
      />

      {relation.position === 'Membro' && (
        <TouchableOpacity style={styles.leave} onPress={exitRoom}>
          <Feather name="log-out" size={28} color="#000" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    justifyContent: 'center',
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
    marginHorizontal: 30,
  },
  content: {
    flexDirection: 'row',
  },
  contentName: {
    color: '#000',
    fontSize: 16,
    marginTop: 2,
  },
  contentPosition: {
    color: '#8B8B8B',
    fontSize: 14,
    marginTop: 2,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
  },
  option: {
    padding: 5,
  },
  leave: {
    marginTop: 10,
    alignItems: 'center',
  },
  popoverStyle: {
    height: 150,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
