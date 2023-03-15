import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import HomeScreen from './components/home';



const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <NavigationContainer>{
        <Stack.Navigator>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignUpScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
        </Stack.Navigator>
      }
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});