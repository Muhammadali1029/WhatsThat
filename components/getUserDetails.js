import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';

export default class GetUserDetails extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            isLoading: true,
            profileData: []
        };
    }

    // componentDidMount()
    // {
    //     this.getData();
    // }

    getData = async () =>
    {   
        console.log("Profile request sent to api")
        return fetch("http://localhost:3333/api/1.0.0/user/"+ (await AsyncStorage.getItem('whatsthat_user_id')),
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
                profileData: responseJson
            });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }

    render()
    {
        return (
            this.getData()
        )
    }
}