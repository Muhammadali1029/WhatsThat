/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatsScreen from '../components/chats';
import CreateChatScreen from '../components/createChat';
import SingleChatNav from './singleChatNav';

const ChatsStack = createNativeStackNavigator();

export default class ChatsScreenStack extends Component
{
  render()
  {
    return (
      <ChatsStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'chats',
        }}
      >
        <ChatsStack.Screen name="chats" component={ChatsScreen} />
        <ChatsStack.Screen name="createChatScreen" component={CreateChatScreen} />
        <ChatsStack.Screen name="singleChatScreenNav" component={SingleChatNav} />
      </ChatsStack.Navigator>
    );
  }
}
