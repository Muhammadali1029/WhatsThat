import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';



import SettingsScreen from './settings';
import ProfileScreen from './profile';


const SettingsStack = createNativeStackNavigator();


export default class SettingsScreenStack extends Component 
{
    render()
    {
        return (
            <SettingsStack.Navigator
                screenOptions=
                {{
                    headerShown: false,
                    initialRouteName:'settings'
                }}
            >
                <SettingsStack.Screen name="settings" component={SettingsScreen} />
                <SettingsStack.Screen name="profile" component={ProfileScreen} />
            </SettingsStack.Navigator>
        )
    }

}