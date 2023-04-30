/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FlatList, TextInput, TouchableOpacity, Button, 
} from 'react-native-web';
import PropTypes from 'prop-types';

import searchUsers from './search';

export default class ChatInfoScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      showEdit: false,
      editChatName: '',
      adduser: false,
    };
  }

  updateChatName = (newChatName) =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatData } = params;
    chatData.name = newChatName;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ chatData });
  };

  updateChatInfo = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const { editChatName } = this.state;

    console.log('send message request sent to api');

    const toSend = {
      name: editChatName,
    };

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}`,
      {
        method: 'PATCH',
        headers:
                {
                  'Content-Type': 'application/json',
                  'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
                },
        body: JSON.stringify(toSend),
      },
    )

      .then((response) =>
      {
        console.log('New Chat Name sent to api');
        if (response.status === 200)
        {
          console.log('Chat name editted successfully');
          params.getData(() => this.updateChatName(editChatName));
          return response.json();
        }

        throw 'Something went wrong';
      })

      .catch((error) =>
      {
        console.log(error);
      });
  };

  removeFromChat = async (chatId, userID) => fetch(
    `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userID}`,
    {
      method: 'DELETE',
      headers:
            {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
    },
  )

    .then(async (response) =>
    {
      const { route } = this.props;
      const { params } = route;
      console.log('Remove from chat sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} removed from chat`);
        params.getData();
      }
      else
      {
        throw 'Something went wrong';
      }
    });

  // searchUsers = async (searchTerm, location) =>
  // {
  //   (resJson)
  // };

  render()
  {
    const { route } = this.props;
    const { params } = route;
    const { chatData } = params;
    const { chatItem } = params;
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { showEdit } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chat Info</Text>
        {showEdit
          ? (
            <View>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Enter New Chat Name"
                onChangeText={(n) => this.setState({ editChatName: n })}
                defaultValue={chatData.name}
              />
              <TouchableOpacity onPress={() =>
              {
                this.updateChatInfo();
                this.setState({ showEdit: false });
              }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Confim</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
          : (
            <View>
              <Text>{chatData.name}</Text>
              <TouchableOpacity onPress={() => this.setState({ showEdit: true })}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        <View>
          <Button
            title="Add User to Chat"
            onPress={() => this.setState({ addUser: true })}
          />
          {/* {addUser
          ? (

          ) : (

          )
          } */}
        </View>
        <View style={styles.members}>
          <Text>Members:-</Text>
          <FlatList
            data={chatData.members}
            renderItem={({ item }) => (
              <View style={styles.membersList}>
                <Text>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
                <TouchableOpacity onPress={
                  () => this.removeFromChat(chatItem.chat_id, item.user_id)
                }
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Remove</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
      </View>
    );
  }
}

ChatInfoScreen.propTypes = {
  route: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  title: {
    marginBottom: 40,
  },
  info: {

  },
  nav: {
    marginBottom: 5,
  },
  button: {
    marginBottom: 30,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
