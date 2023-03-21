import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class SettingsScreen extends Component 
{
    constructor(props)
    {
        super(props);
    }

    logout = async () =>
    {
        return fetch("http://localhost:3333/api/1.0.0/logout", 
            {
                method: 'post',
                headers: 
                {
                    'Content-Type': 'application/json',
                    'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
                }
            })

        .then(async (response) => 
        {
            console.log("Logout sent to api");
            if(response.status === 200)
            {   
                console.log("logout successful")
                await AsyncStorage.removeItem('whatsthat_user_id')
                await AsyncStorage.removeItem('whatsthat_session_token')
                this.props.navigation.navigate('login')
            }
            else if(response.status === 401)
            {
                console.log("Unauthorized. Logged out")
                await AsyncStorage.removeItem('whatsthat_user_id')
                await AsyncStorage.removeItem('whatsthat_session_token')
                this.props.navigation.navigate('login')
            }
            else 
            {
                throw "Something went wrong"
            }
        })

        .catch((error) => 
        {
            console.log(error);
        })
    }

    render()
    {
        return (
                <View>
                    <View style={styles.container}>
                        <Text>Settings</Text>
                        <View style={styles.logoutbtn}>
                            <TouchableOpacity onPress={this.logout}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Logout</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        )
    }

}


const styles = StyleSheet.create
({
    container: 
    {
      width: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    button: 
    {
      marginBottom: 30,
      backgroundColor: '#2196F3'
    }
})