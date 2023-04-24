/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './login';
import SignUpScreen from './signup';
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
          <AuthStack.Screen name="login" component={LoginScreen} />
          <AuthStack.Screen name="signup" component={SignUpScreen} />
          <AuthStack.Screen name="homenav" component={HomeNav} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}
