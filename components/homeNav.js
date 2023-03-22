import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';


import HomeScreen from './home';
import ContactsScreen from './contacts';
import SettingsScreenStack from './settingsNav';


const Tab = createBottomTabNavigator();


export default class HomeNav extends Component 
{
    componentDidMount()
    {
        this.unsubscribe = this.props.navigation.addListener('focus', () =>
        {
        this.checkLoggedIn();
        });
    }

    componentWillUnmount()
    {
        this.unsubscribe();
    }

    checkLoggedIn = async () =>
    {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        if (value == null)
        {
        this.props.navigation.navigate('login');
        }
    };

    render()
    {
        return (
            <Tab.Navigator
                screenOptions=
                {{
                    headerShown: false,
                    initialRouteName:'home'
                }}
            >
                <Tab.Screen name="home" component={HomeScreen}/>
                <Tab.Screen name="contacts" component={ContactsScreen}/>
                <Tab.Screen name="settingsNav" component={SettingsScreenStack}/>
            </Tab.Navigator>
        )
    }

}