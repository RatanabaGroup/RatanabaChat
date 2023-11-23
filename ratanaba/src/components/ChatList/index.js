import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'

export default function ChatList({ data, deleteRoom, userStatus }){
  const navigation = useNavigation();

  function openChat(){
    if(userStatus){
      navigation.navigate("Chat", { thread: data })
    }else{
      navigation.navigate("SignIn")
    }

  }

  return(
    <TouchableOpacity onPress={ openChat }  onLongPress={ () => deleteRoom && deleteRoom() }>
      <View style={styles.row}>

        <View style={styles.content}>

          <View style={styles.header}>
            <Text style={styles.nameText} numberOfLines={1}>{data.name}</Text>
          </View>

          <Text style={styles.contentText} numberOfLines={1}>
            {data.lastMessage.text}
          </Text>
        </View>

      </View>
      <View style={styles.bottomBorder} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row:{
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  content:{
    flexShrink: 1,
  },
  header:{
    flexDirection: 'row'
  },
  contentText:{
    color: '#8B8B8B',
    fontSize: 16,
    marginTop: 2,
  },
  nameText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  bottomBorder: {
    height: 2, 
    backgroundColor: '#F6F6F6',
    marginHorizontal: 10,
  }
})  