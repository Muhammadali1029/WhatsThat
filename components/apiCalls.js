import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class APICalls extends Component 
{
    static async getData()
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

    static async removeFromConatacts(userID)
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

    static async blockUser(userID)
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
    // searchAllUsers = async (search) =>
    // {   
    //     console.log("All search request sent to api")
    //     return fetch("http://localhost:3333/api/1.0.0/search" + search + "&search_in=all",
    //     {
    //         method: 'get',
    //         headers:
    //         {
    //             'Content-Type': 'application/json',
    //             'X-Authorization': await AsyncStorage.getItem('whatsthat_session-token')
    //         }
    //     })
    //     .then((response) => response.json())
    //     .then((responseJson) =>
    //     {
    //         console.log("Data returned from api");
    //         console.log(responseJson);
    //     })
    //     .catch((error) => 
    //     {
    //         console.log(error);
    //     });
    // }
}