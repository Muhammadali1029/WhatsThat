import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class APICalls extends Component 
{
    
    searchAllUsers = async (search) =>
    {   
        console.log("All search request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/search" + search + "&search_in=all",
        {
            method: 'get',
            headers:
            {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('whatsthat_session-token')
            }
        })
        .then((response) => response.json())
        .then((responseJson) =>
        {
            console.log("Data returned from api");
            console.log(responseJson);
        })
        .catch((error) => 
        {
            console.log(error);
        });
    }
}