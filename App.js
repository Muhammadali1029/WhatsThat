import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import HomeScreen from './components/home';
import ContactsScreen from './components/contacts';
import SettingsScreen from './components/settings';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const HomeNav = () => {
  return(
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name="contacts" component={ContactsScreen} options={{headerShown: false}} />
      <Tab.Screen name="settings" component={SettingsScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  )
}

// const loginStack = () => {
//   return (
//     <Stack.Navigator initialRouteName='login'>         
//       <Stack.Screen name="login" component={LoginScreen} options={{headerShown: false}} />
//       <Stack.Screen name="signup" component={SignUpScreen} options={{headerShown: false}} />
//       <Stack.Screen name="home" component={HomeTabs} options={{headerShown: false}} />
//     </Stack.Navigator>
//   )
// }

export default class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            initialRouteName:'login'
          }}
          >
            <AuthStack.Screen name="login" component={LoginScreen} />
            <AuthStack.Screen name="signup" component={SignUpScreen} />
            <AuthStack.Screen name="homenav" component={HomeNav} />
          </AuthStack.Navigator>
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