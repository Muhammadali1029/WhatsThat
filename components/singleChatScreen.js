import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class SingleChatScreen extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            chatData: []
        };
    }

    componentDidMount()
    {
        this.getData();
    }

    getData = async () =>
  {   
      console.log("message screen request sent to api")
      return fetch("http://localhost:3333/api/1.0.0/chat/"+ this.props.route.params.chat_id,
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
          console.log("Message Screen Data returned from api");
          console.log(responseJson);
          this.setState
          ({
              isLoading: false,
              chatsData: responseJson
          });
      })
      .catch((error) =>
      {
          console.log(error);
      });
  }

    render()
    {
      
    }
}