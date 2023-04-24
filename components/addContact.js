import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Button, ScrollView } from 'react-native-web';



export default class AddContactsScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: false,
            searchTerm: "",
            searchedUsersData: [],
            contactsData: []
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
            // this.setState({usersData: responseJson});
            const updatedUsersData = responseJson.map((user) => {
                const isContact = this.state.contactsData.some((contact) => contact.user_id === user.user_id);
                return { ...user, isContact };
            });
    
            this.setState({ usersData: updatedUsersData });
        })
        .catch((error) => 
        {
            console.log(error);
        });
    }
    
    addToContacts = async (userID) =>
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
                this.props.route.params.getData();
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
                                <View style={styles.container}>
                                    {/* <Text>{item.given_name} {item.family_name}</Text> */}
                                    <TouchableOpacity onPress={() => console.log("Profile screen")}>
                                        <View style={styles.profilebtn}>
                                            <Text style={styles.buttonText}>{item.given_name} {item.family_name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    { item.isContact ? 
                                    (
                                        <View style={styles.buttonDisabled}>
                                            <Text style={styles.buttonText}>Added to contacts</Text>
                                        </View>
                                    ) : 
                                    (
                                        <TouchableOpacity onPress={() => this.addToContacts(item.user_id)}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>Add to contacts</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                // <View style={styles.buttonContainer}>
                                // { item.isContact ? 
                                // (
                                //     <View style={styles.buttonDisabled}>
                                //         <Text style={styles.buttonText}>Already in contacts</Text>
                                //     </View>
                                // ) : 
                                // (
                                //     <TouchableOpacity onPress={() => this.addToContacts(item.user_id)}>
                                //         <View style={styles.button}>
                                //             <Text style={styles.buttonText}>Add to contacts</Text>
                                //         </View>
                                //     </TouchableOpacity>
                                // )}
                                // </View>
                            )}
                            keyExtractor={({user_id}, index) => user_id}
                        />
                    </View>
                    <Button
                        title="Go Back"
                        onPress = {() => this.props.navigation.navigate('contacts')} 
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
    profilebtn: {
        backgroundColor: 'red'
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
    buttonDisabled: 
    {
        backgroundColor: "#d3d3d3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10
    },
    buttonTextDisabled: 
    {
        color: "#808080",
        fontWeight: "bold",
        fontSize: 16
    }
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
