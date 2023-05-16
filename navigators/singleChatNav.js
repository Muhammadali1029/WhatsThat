/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SingleChatScreen from '../components/singleChatScreen';
import ChatInfoScreen from '../components/chatInfo';

const SingleChatStack = createNativeStackNavigator();

export default class SingleChatScreenStack extends Component
{
  render()
  {
    return (
      <SingleChatStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'singleChatScreen',
        }}
      >
        <SingleChatStack.Screen name="singleChatScreen" component={SingleChatScreen} options={{ tabBarVisible: false }} />
        <SingleChatStack.Screen name="chatInfoScreen" component={ChatInfoScreen} />
      </SingleChatStack.Navigator>
    );
  }
}
