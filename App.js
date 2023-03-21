import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import AuthorizationStack from './components/authStack';



export default class App extends Component {
  render(){
    return (
      <AuthorizationStack />
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