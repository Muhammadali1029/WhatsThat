/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../components/login';
import SignUpScreen from '../components/signup';
import HomeNav from './homeNav';

const AuthStack = createNativeStackNavigator();

export default class AuthorizationStack extends Component
{
  render()
  {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            initialRouteName: 'login',
          }}
        >
          <AuthStack.Screen name="login" accessibilityLabel="Login Screen" component={LoginScreen} />
          <AuthStack.Screen name="signup" accessibilityLabel="Sign Up Screen" component={SignUpScreen} />
          <AuthStack.Screen name="homenav" accessibilityLabel="Chats Navigator" component={HomeNav} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
