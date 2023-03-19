import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-web';

export default class SettingsScreen extends Component {

    render(){
        return (
            <View style={styles.container}>
                <Text>Settings</Text>
                <View style={styles.logoutbtn}>
                    <TouchableOpacity onPress={this._onPressButton}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create
({
    container: 
    {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    logoutbtn:
    {
  
    }
})