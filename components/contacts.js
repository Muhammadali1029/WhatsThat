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
    componentDidUpdate(prevProps, prevState) 
    {
        if (prevState.contactsData.length !== this.state.contactsData.length) 
        {
          this.getData();
        }
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

    removeFromConatacts = async (userID) =>
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
                this.getData();
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
    
    blockUser = async (userID) =>
    {
        return fetch("http://localhost:3333/api/1.0.0/user/"+ userID + "/block", 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
            }
        })

        .then(async (response) => 
        {
            console.log("Block User sent to api");
            if(response.status === 200)
            {   
                console.log("User " + userID + " Blocked")
                this.getData();
            }
            else if(response.status === 400)
            {
                console.log("You cannot Block yourself")
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
                    <View style={styles.blockedbtn}>
                        <Button
                            title = "View Blocked Users"
                            onPress={() => this.props.navigation.navigate('blocked',
                            {
                                getData: this.getData,
                                removeFromContacts: this.removeFromConatacts
                            })}
                        />
                    </View>
                    <Text>Contacts</Text>
                    <Button 
                        title = "Add New Contact"
                        onPress={() => this.props.navigation.navigate('addContact', 
                        {
                            contactsData: this.state.contactsData,
                            getData: this.getData
                        })}
                    />
                    <View style={styles.contactsList}>
                        <FlatList
                            data={this.state.contactsData}
                            renderItem = {({item}) => 
                            (
                                <View style={styles.contacts}>
                                    <Text>{item.first_name} {item.last_name}</Text>
                                    <TouchableOpacity onPress={() => this.removeFromConatacts(item.user_id)}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Remove</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.blockUser(item.user_id)}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Block</Text>
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
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
    },
    contactsList: {
      marginTop: 20,
      flex: 1,
      alignSelf: 'stretch',
    },
    contacts: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
  });
  