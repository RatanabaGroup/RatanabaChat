import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import Search from '../pages/Search';
import ChatConfig from '../components/ChatConfig';


const AppStack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <AppStack.Navigator initialRouteName="Dashboard">
      <AppStack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          title: "Login"
        }}
      />

      <AppStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false
        }}
      />

      <AppStack.Screen
        name="Chat"
        component={Chat}
        options={({ route, navigation }) => ({
          title: route.params.thread.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatConfig', {
                  idGrupo: route.params.thread._id,
                });
              }}
            >
              <Feather name="settings" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />

      <AppStack.Screen
        name="ChatConfig"
        component={ChatConfig}
        options={{
          title: "Dados da conversa"
        }}
      />

      <AppStack.Screen
        name="Search"
        component={Search}
        options={{
          title: "Pesquise"
        }}
      />

    </AppStack.Navigator>
  )
}