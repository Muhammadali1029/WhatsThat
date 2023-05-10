import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

// import getData from './getRequest';
import Modal from './modal';

export default class CreateChatScreen extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      chatName: '',
      submitted: false,
      usersData: [],
      chatId: '',
      userAddedToChat: false,
      showChatCreated: false,
      addedName: '',
      alreadyAdded: false,
    };
  }

  componentDidMount()
  {
    const { route } = this.props;
    const { params } = route;
    // const { contactsData } = params;
    const { test } = params;

    console.log(params);
    console.log(`Contacts data coming from contacts scree: ${test}`);
  }

  getContactsData = async () =>
  {
    console.log('Contacts request sent to api');
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
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
        console.log('Contacts Data returned from api');
        console.log(responseJson);
        this.setState({
          usersData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  createChat = async () =>
  {
    const { chatName } = this.state;
    const { route } = this.props;
    const { params } = route;

    this.setState({ submitted: true });

    const toSend = {
      name: chatName,
    };

    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'post',
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
        console.log('Create chat sent to api');
        if (response.status === 201)
        {
          console.log(`${chatName} Created`);
          params.getData();
          this.getContactsData();
          return response.json();
        }

        throw 'Something went wrong';
      })
      .then(async (resJson) =>
      {
        console.log(`New created chat id: ${resJson.chat_id}`);
        this.setState({ chatId: resJson.chat_id, submitted: true });
      })

      .catch((error) =>
      {
        console.log(error);
      });
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
      const { route } = this.props;
      const { params } = route;

      console.log('Add to Chat sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userId} added to Chat`);
        params.getData();
        this.setState({ userAddedToChat: true });
        setTimeout(() =>
        {
          this.setState({ userAddedToChat: false });
        }, 2000);
      }
      if (response.status === 400)
      {
        console.log(`User ${userId} already added to Chat`);
        this.setState({ alreadyAdded: true });
        setTimeout(() =>
        {
          this.setState({ alreadyAdded: false });
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
    const {
      chatName, chatId, submitted, usersData, userAddedToChat,
      showChatCreated, addedName, alreadyAdded,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View>
        <Text>Create New Chat</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          placeholder="Enter Chat Name"
          onChangeText={(cN) => this.setState({ chatName: cN })}
          defaultValue={chatName}
        />

        {chatName
            && (
            <Button
              title="Create"
              onPress={() =>
              {
                this.createChat();
                this.setState({ showChatCreated: true });
                setTimeout(() =>
                {
                  this.setState({ showChatCreated: false });
                }, 2000);
              }}
            />
            )}

        {
          submitted
          && (
          <View>
            <Text>Add Users to Chat:</Text>
            <FlatList
              data={usersData}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <View>
                    <TouchableOpacity onPress={() => console.log('Profile screen')}>
                      <View>
                        <Text>
                          {item.first_name}
                          {' '}
                          {item.last_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>
                    {
                      this.addToChat(chatId, item.user_id);
                      this.setState({ addedName: `${item.first_name} ${item.last_name}` });
                    }}
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Add to Chat</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
                // eslint-disable-next-line camelcase
              keyExtractor={({ user_id }) => user_id}
            />
            <Button
              title="Done"
              onPress={() =>
              {
                navigate('chats');
              }}
            />
          </View>
          )
        }

        {userAddedToChat
         && <Modal alert={`${addedName} was added to the Chat`} />}
        {showChatCreated
          && <Modal alert="Chat Created" />}
        {alreadyAdded
          && <Modal alert={`${addedName} is already added to the Chat`} />}
      </View>
    );
  }
}

CreateChatScreen.propTypes = {
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
    justifyContent: 'center',
  },
  title: {

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
  disableButton: {
    marginBottom: 30,
    backgroundColor: 'gray',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
