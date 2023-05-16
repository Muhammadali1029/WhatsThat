/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactsScreen from '../components/contacts';
import AddContactsScreen from '../components/addContact';
import BlockedScreen from '../components/blocked';

const ContactsStack = createNativeStackNavigator();

export default class ContactsScreenStack extends Component
{
  render()
  {
    return (
      <ContactsStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'contacts',
        }}
      >
        <ContactsStack.Screen name="contacts" component={ContactsScreen} />
        <ContactsStack.Screen name="addContact" component={AddContactsScreen} />
        <ContactsStack.Screen name="blocked" component={BlockedScreen} />
      </ContactsStack.Navigator>
    );
  }
}