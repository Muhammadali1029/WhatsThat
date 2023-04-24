/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from './settings';
import ProfileScreenStack from './profileNav';

const SettingsStack = createNativeStackNavigator();

export default class SettingsScreenStack extends Component
{
  render()
  {
    return (
      <SettingsStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'settings',
        }}
      >
        <SettingsStack.Screen name="settings" component={SettingsScreen} />
        <SettingsStack.Screen name="profileNav" component={ProfileScreenStack} />
      </SettingsStack.Navigator>
    );
  }
}
