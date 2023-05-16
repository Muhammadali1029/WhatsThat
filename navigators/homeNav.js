import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import ChatsNav from './chatsNav';
import ContactsNav from './contactsNav';
// import SettingsScreenStack from './settingsNav';
import ProfileNav from './profileNav';

const Tab = createBottomTabNavigator();

export default class HomeNav extends Component
{
  componentDidMount()
  {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () =>
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
      const { navigation } = this.props;
      navigation.navigate('login');
    }
  };

  render()
  {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'chatsNav',
        }}
      >
        <Tab.Screen name="chatsNav" options={{ tabBarLabel: 'Chats' }} component={ChatsNav} />
        <Tab.Screen name="contactsNav" options={{ tabBarLabel: 'Contacts' }} component={ContactsNav} />
        <Tab.Screen name="profileNav" options={{ tabBarLabel: 'Profile' }} component={ProfileNav} />
      </Tab.Navigator>
    );
  }
}

HomeNav.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
