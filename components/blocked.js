import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import { Button } from 'react-native-web';



export default class BlockedScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: true,
            blockedData: []
        };
    }

    componentDidMount()
    {
        this.getData();
    }

    getData = async () =>
    {   
        console.log("Blocked request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/blocked",
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
                blockedData: responseJson
            });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    unblockUser = async (userID) =>
    {
        return fetch("http://localhost:3333/api/1.0.0/user/"+ userID + "/block", 
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
            console.log("Unblock User request sent to api");
            if(response.status === 200)
            {   
                console.log("User " + userID + " Unblocked")
            }
            else if(response.status === 400)
            {
                console.log("You cannot unblock yourself")
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
                    <Text>Blocked Users</Text>
                    <View>
                        <FlatList
                            data={this.state.blockedData}
                            renderItem = {({item}) => 
                            (
                                <View>
                                    <Text>{item.first_name} {item.last_name}</Text>
                                    <TouchableOpacity onPress={() => this.unblockUser(item.user_id)}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Unblock</Text>
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