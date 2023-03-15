import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const Tab = createBottomTabNavigator();


export default class HomeScreen extends Component {

    render(){
        return (
            <NavigationContainer>
                <View style={StyleSheet.container}>
                    <View style={StyleSheet.title}>
                        <Text>Chats</Text>
                    </View>
                    
                    <View style={StyleSheet.nav}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Chats</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Settings</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Contacts</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
            </Tab.Navigator>
            </NavigationContainer>
        )
    }

}


const styles = StyleSheet.create({
    container: {
      width: "100%"
    },
    title: {
       
    },
    nav:{
      marginBottom: 5
    },
    // password:{
    //   marginBottom: 10
    // },
    // loginbtn:{
  
    // },
    // signup:{
    //   justifyContent: "center",
    //   textDecorationLine: "underline"
    // },
    button: {
      marginBottom: 30,
      backgroundColor: '#2196F3'
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
    // error: {
    //     color: "red",
    //     fontWeight: '900'
    // }
  });