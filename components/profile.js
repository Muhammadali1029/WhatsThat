import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


export default class ProfileScreen extends Component {
 
    render()
    {
        return (
            <View style={StyleSheet.container}>
                <View style={StyleSheet.title}>
                    <Text>Profile</Text>
                </View>

                <View style={StyleSheet.info}>
                    <Text>Name</Text>
                    <Text>Email</Text>
                </View>
                
                <View style={StyleSheet.nav}>
                    <TouchableOpacity onPress={this._onPressButton}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
      width: "100%"
    },
    title: {
       
    },
    info: {
       
    },
    nav:{
      marginBottom: 5
    },
    button: {
      marginBottom: 30,
      backgroundColor: '#2196F3'
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
  });