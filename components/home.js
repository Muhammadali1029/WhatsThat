import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeScreen extends Component 
{
  componentDidMount()
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>
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
      this.props.navigation.navigate('login');
    }
  };

  render()
  {
    return (
        <View>
            <Text>Chats</Text>
        </View>
    )
  }
}



const styles = StyleSheet.create
({
  container: 
  {
    width: "100%"
  },
  title:
  {
      
  },
  nav:
  {
    marginBottom: 5
  },

  button: 
  {
    marginBottom: 30,
    backgroundColor: '#2196F3'
  },
  buttonText: 
  {
    textAlign: 'center',
    padding: 20,
    color: 'white'
  },
});