import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Button } from 'react-native-web';




export default class ContactsScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: false,
            userID: "",
            searchTerm: "",
            usersData: []
        };
    }


    searchAllUsers = async (searchTerm) =>
    {   
        console.log("All search request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/search?q=" + searchTerm + "&search_in=all",
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
            this.setState({usersData: responseJson});
        })
        .catch((error) => 
        {
            console.log(error);
        });
    }
    
    addToConatacts = async (userID) =>
    {
        return fetch("http://localhost:3333/api/1.0.0/user/"+ userID + "/contact", 
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
            console.log("Add to contacts sent to api");
            if(response.status === 200)
            {   
                console.log("User " + userID + " added to contacts")
            }
            else if(response.status === 400)
            {
                console.log("You cannot add yourself")
            }
            else if(response.status === 404)
            {
                console.log("User does not exist")
            }
            else
            {
                throw "Something went wrong"
            }
        })

        .catch((error) => 
        {
            console.log(error);
        });
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
                    <View>
                    <Text>Add a user to Contacts</Text>
                    <View>
                        <Text>Name, Email or UserID</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter..."
                            onChangeText={searchTerm => this.setState({searchTerm})}
                            defaultValue={this.state.searchTerm}
                        />
                    </View>

                    <View style={styles.addbtn}>
                        <TouchableOpacity onPress={() => this.searchAllUsers(this.state.searchTerm)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Search</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </View>
                    <Text>Users:</Text>
                    <View>
                        <FlatList
                            data={this.state.usersData}
                            renderItem = {({item}) => 
                            (
                                <View>
                                    <Text>{item.given_name} {item.family_name}</Text>
                                    {/* <TouchableOpacity onPress={() => console.log("Added "+ item.user_id)}> */}
                                    <TouchableOpacity onPress={() => this.addToConatacts(item.user_id)}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Add to contacts</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={({user_id}, index) => user_id}
                        />
                    </View>
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
        justifyContent: "start"
    },
    search: {
       
    },
    info: {
       
    },
    nav:{
      marginBottom: 5
    },
    button: {
      backgroundColor: '#2196F3'
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
  });




  
    // searchAllUsers = async (search) =>
    // {   
    //     console.log("All search request sent to api")
    //     return fetch("http://localhost:3333/api/1.0.0/search?q=" + search + "&search_in=all",
    //     {
    //         method: 'get',
    //         headers:
    //         {
    //             'Content-Type': 'application/json',
    //             'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
    //         }
    //     })
    //     .then((response) => response.json())
    //     .then((responseJson) =>
    //     {
    //         console.log("Data returned from api");
    //         console.log(responseJson);
    //         this.setState({usersData: responseJson});
    //     })
    //     .catch((error) => 
    //     {
    //         console.log(error);
    //     });
    // }
