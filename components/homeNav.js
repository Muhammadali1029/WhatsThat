import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import ChatsNav from './chatsNav';
import ContactsNav from './contactsNav';
import SettingsScreenStack from './settingsNav';

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
        <Tab.Screen name="chatsNav" component={ChatsNav} />
        <Tab.Screen name="contactsNav" component={ContactsNav} />
        <Tab.Screen name="settingsNav" component={SettingsScreenStack} />
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
