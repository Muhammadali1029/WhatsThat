/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../components/profile';
import EditProfileScreen from '../components/editProfile';

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
        <ProfileStack.Screen name="profile" accessibilityLabel="Profile Screen" component={ProfileScreen} />
        <ProfileStack.Screen name="editProfile" accessibilityLabel="Edit Profile Screen" component={EditProfileScreen} />
      </ProfileStack.Navigator>
    );
  }
}
