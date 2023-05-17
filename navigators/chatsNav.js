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
        <ChatsStack.Screen name="chats" accessibilityLabel="All Chats Screen" component={ChatsScreen} />
        <ChatsStack.Screen name="createChatScreen" accessibilityLabel="Create Chat Screen" component={CreateChatScreen} />
        <ChatsStack.Screen name="singleChatScreenNav" accessibilityLabel="Single Chat Navigator" component={SingleChatNav} />
      </ChatsStack.Navigator>
    );
  }
}
