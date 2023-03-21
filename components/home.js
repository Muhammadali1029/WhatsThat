import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


export default class HomeScreen extends Component 
{
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