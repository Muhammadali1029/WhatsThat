import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import ChatsScreen from './chats';
import CreateChatScreen from './createChat';
import SingleChatScreen from './singleChatScreen';

const ChatsStack = createNativeStackNavigator();


export default class ChatsScreenStack extends Component 
{
    render()
    {
        return (
            <ChatsStack.Navigator
                screenOptions=
                {{
                    headerShown: false,
                    initialRouteName:'chats'
                }}
            >
                <ChatsStack.Screen name="chats" component={ChatsScreen} />
                <ChatsStack.Screen name="createChatScreen" component={CreateChatScreen} />
                <ChatsStack.Screen name="singleChatScreen" component={SingleChatScreen} />
            </ChatsStack.Navigator>
        )
    }

}