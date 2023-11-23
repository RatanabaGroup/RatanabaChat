import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firestore from '@react-native-firebase/firestore';

export default function ChatConfig({ route }) {
  const [participants, setParticipants] = useState([]);
  const { idGrupo } = route.params;

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
            <View style={styles.row}>

              <View style={styles.content}>
                <Text style={styles.contentName}>{item.name}</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.contentPosition}>{item.position}</Text>
              </View>
              {/* <Text style={styles.contentPosition}>
                {item.position === 'Membro' ? null : item.position}
              </Text> */}
            </View>

            <View style={styles.bottomBorder} />
          </>
        )}
      />

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
  }
})