import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';



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

    addToConatacts = async () =>
    {
        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.state.userID + "/contact", 
            {
                method: 'post',
                headers: 
                {
                    'Content-Type': 'application/json',
                    'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
                }
            },
            this.getData()
        )

        .then(async (response) => 
        {
            console.log("Logout sent to api");
            if(response.status === 200)
            {   
                console.log("User added to contacts")
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
                    <View>
                    <Text>Add a user to Contacts</Text>
                    <View>
                        <Text>User ID:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter User ID"
                            onChangeText={userID => this.setState({userID})}
                            defaultValue={this.state.userID}
                        />
                    </View>

                    <View style={styles.addbtn}>
                        <TouchableOpacity onPress={this.addToConatacts}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Add</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </View>
                    <Text>Contacts</Text>
                    <View>
                        <FlatList
                            data={this.state.contactsData}
                            renderItem = {({item}) => 
                            (
                                <View>
                                    <Text>{item.first_name} {item.last_name}</Text>
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