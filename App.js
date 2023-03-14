import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import HomeScreen from './components/home';


export default class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      
        {/* <View style={styles.container}> */}
          {/* <LoginScreen /> */}
          {/* <SignUpScreen /> */}
          {/* <HomeScreen /> */}
          {/* <ProfileScreen /> */}
        {/* </View> */}     
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});