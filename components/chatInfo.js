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
      showAddUser: false,
      searchTerm: '',
      searchData: [],
      chatData: [],
    };
  }

  componentDidMount()
  {
    const { navigation } = this.props;
    const { addListener } = navigation;
    this.getData();
    this.focusListener = addListener('focus', this.handleFocus);
  }

  componentWillUnmount()
  {
    // Remove the focus listener
    if (this.focusListener)
    {
      this.focusListener();
    }
  }

  handleFocus = () =>
  {
    this.getData();
  };

  getData = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const { chatData } = this.state;

    console.log('message screen request sent to api', chatItem.creator.user_id);
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}`,
      {
        method: 'get',
        headers:
            {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
      },
    )

      .then((response) => response.json())
      .then((responseJson) =>
      {
        console.log('Message Screen Data returned from api');
        console.log(responseJson);
        this.setState({
          chatData: responseJson,
        });
        console.log(chatData);
      })

      .catch((error) =>
      {
        console.log(error);
      });
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
          // params.getData(() => this.updateChatName(editChatName));
          this.getData();
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
      // const { route } = this.props;
      // const { params } = route;
      console.log('Remove from chat sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} removed from chat`);
        // params.getData();
        this.handleFocus();
      }
      else
      {
        throw 'Something went wrong';
      }
    });

  searchContactUsers = async (searchTerm, location) =>
  {
    searchUsers(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}`,
      await AsyncStorage.getItem('whatsthat_session_token'),
      (resJson) =>
      {
        console.log('Search contacts request returned from Api');
        console.log(resJson);
        this.setState({ searchData: resJson });
      },
      (status) =>
      {
        console.log(status);
      },
    );
  };

  addToChat = async (chatId, userId) => fetch(
    `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`,
    {
      method: 'post',
      headers:
            {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
    },
  )
    .then(async (response) =>
    {
      console.log('Add to Chat sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userId} added to Chat`);
        this.setState({ showAddUser: true });
        this.getData();
      }
      else
      {
        throw 'Something went wrong';
      }
    })

    .catch((error) =>
    {
      console.log(error);
    });

  render()
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const {
      chatData, showEdit, showAddUser, searchTerm, searchData,
    } = this.state;

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

        {showAddUser
          ? (
            <View>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Enter Name"
                onChangeText={(sT) => this.setState({ searchTerm: sT })}
                defaultValue={searchTerm}
              />
              <TouchableOpacity onPress={() =>
              {
                this.searchContactUsers(searchTerm, 'contacts');
              }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>

              <Button
                title="Done"
                onPress={() => this.setState({ showAddUser: false })}
              />
              <View>
                <FlatList
                  data={searchData}
                  renderItem={({ item }) => (
                    <View style={styles.container}>
                      <TouchableOpacity onPress={() => console.log('Profile screen')}>
                        <View style={styles.profilebtn}>
                          <Text>
                            {item.given_name}
                            {' '}
                            {item.family_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={
                        () => this.addToChat(chatItem.chat_id, item.user_id)
                      }
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Add to Chat</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
            // eslint-disable-next-line camelcase
                  keyExtractor={({ user_id }) => user_id}
                />
              </View>
            </View>
          )
          : (
            <View>
              <TouchableOpacity onPress={() => this.setState({ showAddUser: true })}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Add New User to Chat</Text>
                </View>
              </TouchableOpacity>

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
          )}
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
    addListener: PropTypes.func.isRequired,
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
