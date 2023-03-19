import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-web';

import * as EmailValidator from 'email-validator';


export default class LoginScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            error: "", 
            isLoading: true,
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

    _onPressButton()
    {
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.first_name && this.state.last_name && this.state.email && this.state.password && this.state.confirm_password))
        {
            this.setState({error: "Must enter all details"})
            return;
        }

        if(!EmailValidator.validate(this.state.email))
        {
            this.setState({error: "Must enter valid email"})
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password))
        {
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }
        
        if (this.state.password != this.state.confirm_password)
        {
            this.setState({error: "Password does not match, re-enter"})
        }

        console.log("Button clicked: " + this.state.first_name + " " + this.state.last_name + " " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")

        let to_send = 
        {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://localhost:3333/api/1.0.0/user", 
        {
            method: 'post',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => 
        {
            console.log("Signup details sent to api");

            if(response.status === 201)
            {
                console.log("Account created")
                return response.json();
            }
            else if(response.status === 400)
            {
                throw "Account already exists"
            }
            else 
            {
                throw "Something went wrong"
            }
        })
        .then((rJson) =>
        {
            console.log(rJson)
            this.setState({"error": "User added successfully"});
            this.setState({"submitted": false});
            this.props.navigation.navigate('login');
        })
        .catch((error) => 
        {
            console.log(error);
        })
    }

    render()
    {
        return (
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <View style={styles.first_name}>
                        <Text>First Name:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter first name"
                            onChangeText={first_name => this.setState({first_name})}
                            defaultValue={this.state.first_name}
                        />

                        <>
                            {this.state.submitted && !this.state.first_name &&
                                <Text style={styles.error}>*First Name is required</Text>
                            }
                        </>
                    </View>
                    
                    <View style={styles.last_name}>
                        <Text>Last Name:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter last name"
                            onChangeText={last_name => this.setState({last_name})}
                            defaultValue={this.state.last_name}
                        />

                        <>
                            {this.state.submitted && !this.state.last_name &&
                                <Text style={styles.error}>*Last Name is required</Text>
                            }
                        </>
                    </View>

                    <View style={styles.email}>
                        <Text>Email:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter email"
                            onChangeText={email => this.setState({email})}
                            defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.password}>
                        <Text>Password:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter password"
                            onChangeText={password => this.setState({password})}
                            defaultValue={this.state.password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                        </>
                    </View>

                    <View style={styles.confirm_password}>
                        <Text>Confirm Password:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Re-enter password"
                            onChangeText={confirm_password => this.setState({confirm_password})}
                            defaultValue={this.state.confirm_password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.confirm_password &&
                                <Text style={styles.error}>*Confirm Password is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.createbtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
            
                    <View>
                        <Button
                            title="Have an account? Login"
                            onPress={() => this.props.navigation.navigate('login')}
                        />
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
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    formContainer: 
    {
  
    },
    first_name:
    {
        marginBottom: 5
    },
    last_name:
    {
        marginBottom: 10
    },
    email:
    {
      marginBottom: 15
    },
    password:
    {
      marginBottom: 20
    },
    confirm_password:
    {
        marginBottom: 25
    },
    createbtn:
    {
  
    },
    signin:
    {
      justifyContent: "center",
      textDecorationLine: "underline"
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
    error: 
    {
        color: "red",
        fontWeight: '900'
    }
  });