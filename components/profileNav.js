/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './profile';
import EditProfileScreen from './editProfile';

const ProfileStack = createNativeStackNavigator();

export default class ProfileScreenStack extends Component
{
  render()
  {
    return (
      <ProfileStack.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'profile',
        }}
      >
        <ProfileStack.Screen name="profile" component={ProfileScreen} />
        <ProfileStack.Screen name="editProfile" component={EditProfileScreen} />
      </ProfileStack.Navigator>
    );
  }
}
