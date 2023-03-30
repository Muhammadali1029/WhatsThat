import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';


export default class EditProfileScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: true,
            profileData: {},

            orig_first_name: '',
            orig_last_name: '',
            orig_email: '',
            orig_password: '',

            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            error: ''
        };
    }


    componentDidMount()
    {
        this.getData();
        console.log(this.state.profileData)

        this.setState
        ({
            orig_first_name: this.state.profileData.first_name,
            orig_last_name: this.state.profileData.last_name,
            orig_email: this.state.profileData.email,
            orig_password: this.state.profileData.password
        })
    }

    getData = async () =>
    {   
        console.log("Profile request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/user/"+ (await AsyncStorage.getItem('whatsthat_user_id')),
        {
            method: 'get',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            }
        })

        .then((response) => response.json())
        .then((responseJson) => 
        {
            console.log("Data returned from api");
            console.log(responseJson);
            this.setState
            ({
                isLoading: false,
                profileData: responseJson
            });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    updateProfile = async () =>
    {
        let to_send = {};

        if (this.state.first_name != this.state.orig_first_name)
        {
            to_send['first_name'] = this.state.first_name;
        }

        if (this.state.last_name != this.state.orig_last_name)
        {
            to_send['last_name'] = this.state.last_name;
        }

        if (this.state.email != this.state.orig_email)
        {
            to_send['email'] = this.state.email;
        }

        if (this.state.password != this.state.password)
        {
            to_send['password'] = this.state.password;
        }

        // const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        // if(!PASSWORD_REGEX.test(this.state.password))
        // {
        //     this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
        //     return;
        // }

        // if (this.state.password != this.state.confirm_password)
        // {
        //     this.setState({error: "Password does not match, re-enter"})
        // }

        console.log(JSON.stringify(to_send));

        return fetch("http://localhost:3333/api/1.0.0/user/" + (await AsyncStorage.getItem('whatsthat_user_id')),
        {
            method: 'PATCH',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            },
            body: JSON.stringify(to_send)
        })
        .then((response) =>
        {
            if(response.status === 200)
            {
                console.log("Profile updated");
            }
            else
            {
                console.log('Failed');
            }
        })
        .catch((error) => 
        {
            console.log(error);
        })
    }

    render()
    {
        if(this.state.isLoading)
        {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        }

        else
        {
            return (
                <View style={styles.container}>
                    <Text>Edit Profile Details</Text>
                    
                    <TextInput
                        placeholder = "Enter First Name..."
                        onChangeText = {(first_name) => this.setState({first_name})}
                        value = {this.state.first_name}    
                    />

                    <TextInput
                        placeholder = "Enter Last Name..."
                        onChangeText = {(last_name) => this.setState({last_name})}
                        value = {this.state.last_name}    
                    />

                    <TextInput
                        placeholder = "Enter email..."
                        onChangeText = {(email) => this.setState({email})}
                        value = {this.state.email}    
                    />

                    <TextInput
                        placeholder = "Enter new Password..."
                        onChangeText = {(password) => this.setState({password})}
                        value = {this.state.password}    
                    />

                    <TextInput
                        placeholder = "Re-enter Password..."
                        onChangeText = {(confirm_password) => this.setState({confirm_password})}
                        value = {this.state.confirm_password}    
                    />

                    <Button 
                        title = "Update"
                        onPress = {() => this.updateProfile()}
                    />
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
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