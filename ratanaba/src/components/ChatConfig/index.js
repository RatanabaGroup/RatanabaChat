import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Popover from 'react-native-popover-view';
import Feather from 'react-native-vector-icons/Feather';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ChatConfig({ route }) {
  const [participants, setParticipants] = useState([]);
  const { idGrupo } = route.params;

  const user = auth().currentUser.toJSON();

  useEffect(() => {
    const fetchData = async () => {
      const participantsCollection = await firestore()
        .collection('grupos')
        .doc(idGrupo)
        .collection('participantes')
        .get();

      const participantsData = participantsCollection.docs.map(doc => doc.data());
      setParticipants(participantsData);
    };

    fetchData();
  }, [idGrupo]);

  const [isVisible, setIsVisible] = useState(false);
  const showPopover = () => { setIsVisible(true) }
  const closePopover = () => { setIsVisible(false) }

  function exitRoom() {
    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja sair do grupo?",
      [
        {
          text: "Cancelar",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => handleExitRoom()
        }
      ]
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.nameText}>Participantes</Text>
      </View>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={showPopover} style={styles.row}>

              <View style={styles.content}>
                <Text style={styles.contentName}>{item.name}</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.contentPosition}>{item.position}</Text>
              </View>
            </TouchableOpacity>

            <Popover
              onClose={closePopover}
              isVisible={isVisible}
              popoverStyle={{
                height: 150,
                width: 300,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={[styles.option, {
                color: 'red'
              }]}
              >
                {/* {user.uid === 'Admin' &&
                  'Remover do grupo'
                } */}
                Remover do grupo
              </Text>

              <TouchableOpacity onPress={closePopover}>
                <Text style={[styles.option, {
                  color: '#2E54D4'
                }]}
                >Fechar</Text>
              </TouchableOpacity>
            </Popover>

            <View style={styles.bottomBorder} />
          </>
        )}
      />

      {/* {user.uid === item.userId && item.position === 'Membro' ? (
        <View style={styles.leave} onPress={exitRoom}>
          <Feather name="log-out" size={28} color="#000" />
        </View>
      ) : null} */}

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
    justifyContent: 'center'
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
    marginTop: 100,
    alignItems: 'center',
  },
})