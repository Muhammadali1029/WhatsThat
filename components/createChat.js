import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';


export default class CreateChatScreen extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
          chatName: "",
          submitted: false
        };
    }

    createChat = async (chatName) =>
    {
      this.setState({submitted: true})

      let to_send = 
      {
        name: this.state.chatName
      };

      return fetch("http://localhost:3333/api/1.0.0/chat", 
      {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
          },
          body: JSON.stringify(to_send)
      })

      .then(async(response) => 
      {
          console.log("Create chat sent to api");
          if(response.status === 201)
          {   
              console.log(this.state.chatName + " Created")
              this.props.route.params.getData();
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
      return (
        <View>
          <Text>Create New Chat</Text>
          <TextInput 
            style={{height: 40, borderWidth: 1, width: "100%"}}
            placeholder="Enter Chat Name"
            onChangeText={chatName => this.setState({chatName})}
            defaultValue={this.state.chatName}
          />  

          <Button
            title="Create"
            onPress={() => this.createChat()}
          />

          <>
            {
              this.state.submitted &&
              <Text>Chat Created</Text>
            }
          </>
        </View>
      )
    }

}


const styles = StyleSheet.create
({
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