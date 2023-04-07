import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import { Button } from 'react-native-web';



export default class ContactsScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: true,
            contactsData: [],
            userID: ""

        };
    }

    componentDidMount()
    {
        this.getData();
    }

    getData = async () =>
    {   
        console.log("Contacts request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/contacts",
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
                contactsData: responseJson
            });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    RemoveFromConatacts = async (userID) =>
    {
        return fetch("http://localhost:3333/api/1.0.0/user/"+ userID + "/contact", 
        {
            method: 'DELETE',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            }
        })

        .then(async (response) => 
        {
            console.log("Remove from contacts sent to api");
            if(response.status === 200)
            {   
                console.log("User " + userID + " removed from contacts")
            }
            else if(response.status === 400)
            {
                console.log("You cannot remove yourself")
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
                    <Text>Contacts</Text>
                    <Button 
                        title = "Add New Contact"
                        onPress={() => this.props.navigation.navigate('addContact', {UserID: this.state.userID})}
                    />
                    <View>
                        <FlatList
                            data={this.state.contactsData}
                            renderItem = {({item}) => 
                            (
                                <View>
                                    <Text>{item.first_name} {item.last_name}</Text>
                                    {/* <TouchableOpacity onPress={() => console.log("Removed " + item.user_id)}> */}
                                    <TouchableOpacity onPress={() => this.RemoveFromConatacts(item.user_id)}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Remove</Text>
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
        justifyContent: "center"
    },
    search: {
       
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