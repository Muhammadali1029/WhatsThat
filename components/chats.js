import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';

export default class HomeScreen extends Component 
{

  constructor(props)
  {
      super(props);

      this.state = 
      {
          isLoading: true,
          chatsData: []
      };
  }

  componentDidMount()
  {
      this.getData();
  }

  componentDidUpdate(prevProps, prevState) 
  {
    if (prevState.chatsData.length !== this.state.chatsData.length) 
    {
      this.getData();
    }
  }

  getData = async () =>
  {   
      console.log("Chats request sent to api")
      return fetch("http://localhost:3333/api/1.0.0/chat",
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
            <Button
              title = "New Chat"
              onPress={() => this.props.navigation.navigate('createChatScreen',
              {
                getData: this.getData
              })}
            />
          </View>
            <Text>Chats</Text>
            <FlatList
              data={this.state.chatsData}
              renderItem = {({item}) => 
              (
                  <View style={styles.chats}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('singleChatScreen', { item })}>
                      <Text>{item.name}</Text>
                      {/* <Text>{item.last_message.author.first_name} {item.last_message.author.last_name}: {item.last_message.message}</Text> */}
                    </TouchableOpacity>
                  </View>
              )}
              keyExtractor={({chat_id}, index) => chat_id}
            />
        </View>
      )
    }
  }
}



const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 20,
  // },
  chats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    width: '100%',
    borderWidth: 1
  },
});