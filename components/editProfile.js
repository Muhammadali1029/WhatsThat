import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';

import * as EmailValidator from 'email-validator';


export default class EditProfileScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: false,
            original_profile_data: [],

            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            
            error: '',
            submitted: false
        };
    }


    componentDidMount()
    {
        this.setState
        ({
            original_profile_data: this.props.route.params.profileData, 
            first_name: this.props.route.params.profileData.first_name,
            last_name: this.props.route.params.profileData.last_name,
            email: this.props.route.params.profileData.email,
        }, () => 
        {
            console.log("Profile Data: " )
            console.log(this.state)
        })
    }

    updateProfile = async () =>
    {
        this.setState({submitted: true})
        this.setState({error: ""})

        let to_send = {};

        if (this.state.first_name != this.state.original_profile_data.first_name)
        {
            to_send['first_name'] = this.state.first_name;
        }

        if (this.state.last_name != this.state.original_profile_data.last_name)
        {
            to_send['last_name'] = this.state.last_name;
        }

        if (this.state.email != this.state.original_profile_data.email)
        {
            if(!EmailValidator.validate(this.state.email))
            {
                this.setState({error: "Must enter valid email"})
                return;
            }
            
            to_send['email'] = this.state.email;
        }

        if (this.state.password != "")
        {
            const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
            if(!PASSWORD_REGEX.test(this.state.password))
            {
                this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
                return;
            }

            to_send['password'] = this.state.password;
        }

        if (this.state.password != this.state.confirm_password)
        {
            this.setState({error: "Password does not match, re-enter"})
        }

        console.log(JSON.stringify(to_send));

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.original_profile_data.user_id,
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

            this.setState({ isLoading: false });
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
                    
                    <Text>First Name</Text>
                    <TextInput
                        value = {this.state.first_name}
                        onChangeText = {(val) => this.setState({"first_name": val})}
                    />

                    <Text>Last Name</Text>
                    <TextInput
                        value = {this.state.last_name}    
                        onChangeText = {(val) => this.setState({"last_name": val})}
                    />
                    
                    <Text>Email</Text>
                    <TextInput
                        value = {this.state.email}
                        onChangeText = {(val) => this.setState({"email": val})}    
                    />

                    <Text>Password</Text>
                    <TextInput
                        placeholder="Enter password"
                        onChangeText={password => this.setState({password})}
                        defaultValue={this.state.password}  
                    />

                    <Text>Confirm Password</Text>
                    <TextInput
                        placeholder="Re-enter password"
                        onChangeText={confirm_password => this.setState({confirm_password})}
                        defaultValue={this.state.confirm_password}
                    />
                    <>
                        {
                            this.state.submitted && !this.state.confirm_password &&
                            <Text style={styles.error}>*Confirm Password is required</Text>
                        }
                    </>

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