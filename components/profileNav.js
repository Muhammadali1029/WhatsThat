import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import ProfileScreen from './profile';
import EditProfileScreen from './editProfile';
import AddToContactsScreen from './addContact'

const ProfileStack = createNativeStackNavigator();


export default class ProfileScreenStack extends Component 
{
    render()
    {
        return (
            <ProfileStack.Navigator
                screenOptions=
                {{
                    headerShown: false,
                    initialRouteName:'profile'
                }}
            >
                <ProfileStack.Screen name="profile" component={ProfileScreen} />
                <ProfileStack.Screen name="editProfile" component={EditProfileScreen} />
                <ProfileStack.Screen name="addContact" component={EditProfileScreen} />
            </ProfileStack.Navigator>
        )
    }

}