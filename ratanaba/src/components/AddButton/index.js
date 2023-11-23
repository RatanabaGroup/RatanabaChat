import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function AddButton({ setVisible, userStatus }){
  const navigation = useNavigation();

  function handleNavigateButton(){
    userStatus ? setVisible() : navigation.navigate("SignIn")
  }

  return(
    <TouchableOpacity 
      style={styles.containerButton}
      activeOpacity={0.9}
      onPress={handleNavigateButton}
    >
      <View>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerButton:{
   backgroundColor: '#2E54D4', 
   width: 60,
   height: 60,
   borderRadius: 30,
   justifyContent: 'center',
   alignItems: 'center',
   position: 'absolute',
   bottom: '5%',
   right: '6%'
  },
  text:{  
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold'
  }
})