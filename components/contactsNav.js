import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import ContactsScreen from './contacts';
import AddContactsScreen from './addContact';


const ContactsStack = createNativeStackNavigator();


export default class ContactsScreenStack extends Component 
{
    render()
    {
        return (
            <ContactsStack.Navigator
                screenOptions=
                {{
                    headerShown: false,
                    initialRouteName:'contacts'
                }}
            >
                <ContactsStack.Screen name="contact" component={ContactsScreen} />
                <ContactsStack.Screen name="addContact" component={AddContactsScreen} />
            </ContactsStack.Navigator>
        )
    }

}