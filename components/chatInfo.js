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
import Modal from './modal';
import ProfileScreen from './otherUsersProfile';
import globalStyles from './globalStyleSheet';

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
      showLeftChat: false,
      showAddedToChat: false,
      showAlreadyInChat: false,
      profileUserId: '',
      showProfile: false,
      showRespone: false,
      response: '',
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

    console.log('chat info screen request sent to api', chatItem.creator.user_id);
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
        console.log(' chat info Data returned from api');
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
          this.getData();
          this.setState({ showRespone: true, response: 'Chat eddited successfuly' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
        else if (response.status === 400)
        {
          this.setState({ showRespone: true, response: 'Bad Request' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
        else if (response.status === 401)
        {
          this.setState({ showRespone: true, response: 'Unauthorised, login' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
        else if (response.status === 403)
        {
          this.setState({ showRespone: true, response: 'Forbidden' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
        else if (response.status === 404)
        {
          this.setState({ showRespone: true, response: 'Chat not found' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
        else if (response.status === 500)
        {
          this.setState({ showRespone: true, response: 'server error' });
          setTimeout(() =>
          {
            this.setState({ showRespone: false });
          }, 2000);
        }
      })

      .catch((error) =>
      {
        console.log(error);
      });
  };

  removeFromChat = async (chatId, userId) => fetch(
    `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`,
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
      const { chatData } = this.state;
      const { navigation } = this.props;
      const { navigate } = navigation;

      console.log('Remove from chat sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userId} removed from chat`);
        this.setState({ showRespone: true, response: 'User removed from chat' });
        setTimeout(() =>
        {
          this.setState({ showRespone: false });
        }, 2000);
        if (userId === chatData.creator.user_id)
        {
          navigate('chatsNav', { screen: 'chats' });
          return;
        }
        this.handleFocus();
      }
      else if (response.status === 401)
      {
        this.setState({ showRespone: true, response: 'Unauthorised, login' });
        setTimeout(() =>
        {
          this.setState({ showRespone: false });
        }, 2000);
      }
      else if (response.status === 403)
      {
        this.setState({ showRespone: true, response: 'Forbidden' });
        setTimeout(() =>
        {
          this.setState({ showRespone: false });
        }, 2000);
      }
      else if (response.status === 404)
      {
        this.setState({ showRespone: true, response: 'User not found' });
        setTimeout(() =>
        {
          this.setState({ showRespone: false });
        }, 2000);
      }
      else
      {
        this.setState({ showRespone: true, response: 'Server Error' });
        setTimeout(() =>
        {
          this.setState({ showRespone: false });
        }, 2000);
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

        this.setState({ showAddedToChat: true });
        setTimeout(() =>
        {
          this.setState({ showAddedToChat: false });
        }, 2000);

        this.getData();
      }
      else if (response.status === 400)
      {
        this.setState({ showAlreadyInChat: true });
        setTimeout(() =>
        {
          this.setState({ showAlreadyInChat: false });
        }, 2000);
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
      showLeftChat, showAddedToChat, showAlreadyInChat, showProfile, profileUserId,
      showRespone, response,
    } = this.state;

    return (
      <View style={globalStyles.container}>

        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.titleText}>Chat Info</Text>
          </View>
        </View>

        {showEdit
          ? (
            <View style={styles.confirmEdit}>
              <TextInput
                style={[globalStyles.textInput, styles.textInput]}
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
                <View style={globalStyles.button}>
                  <Text style={globalStyles.buttonText}>Confim</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
          : (
            <View style={styles.chatName}>
              <Text style={styles.text}>{chatData.name}</Text>
              <TouchableOpacity onPress={() => this.setState({ showEdit: true })}>
                <View style={globalStyles.button}>
                  <Text style={globalStyles.buttonText}>Edit</Text>
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
              <View style={styles.searchListContainer}>
                <FlatList
                  data={searchData}
                  renderItem={({ item }) => (
                    <View style={globalStyles.flatListContainer}>
                      <TouchableOpacity onPress={() =>
                      {
                        this.setState({
                          showProfile: true,
                          profileUserId: item.user_id,
                        });
                      }}
                      >
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
                          <Text style={styles.buttonText}>Add User</Text>
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
            <View style={styles.addUserContainer}>
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
                      <TouchableOpacity onPress={() =>
                      {
                        this.setState({
                          showProfile: true,
                          profileUserId: item.user_id,
                        });
                      }}
                      >
                        <View style={styles.profilebtn}>
                          <Text>
                            {item.first_name}
                            {' '}
                            {item.last_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() =>
                      {
                        this.removeFromChat(chatItem.chat_id, item.user_id);
                      }}
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

        {showLeftChat
        && <Modal alert="User Removed from chat" />}
        {showAddedToChat
        && <Modal alert="User Added to Chat" /> }
        {showAlreadyInChat
        && <Modal alert="User Already in Chat" /> }
        {showRespone
        && <Modal alert={response} /> }
        {showProfile
          && (
          <ProfileScreen
            userID={profileUserId}
            onClose={() => this.setState({ showProfile: false })}
          />
          ) }
      </View>
    );
  }
}

ChatInfoScreen.propTypes = {
  route: PropTypes.shape({
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
    // alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  chatName: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 30,
    fontWeight: '600',
    padding: 15,
  },
  addUserContainer: {
    padding: 15,
  },
  searchListContainer: {
    flex: 1,
    backgroundColor: '1a1a1as',
    paddingHorizontal: 10,
  },
  confirmEdit: {
    alignItems: 'center',
    padding: 30,
  },
  textInput: {
    alignItems: 'center',
  },
});
