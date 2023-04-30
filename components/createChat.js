import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

// import getData from './getRequest';

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
    };
  }

  componentDidMount()
  {
    const { route } = this.props;
    const { params } = route;
    // const { contactsData } = params;
    const { test } = params;
    
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
        method: 'POST',
        headers:
          {
            'Content-Type': 'application/json',
            'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          },
        body: JSON.stringify(toSend),
      },
    )
      // .then((response) => response.json())
      .then(async (response) =>
      {
        console.log('Create chat sent to api');
        console.log(response);
        if (response.status === 201)
        {
          console.log(`${chatName} Created`);
          this.setState({ chatId: response, submitted: true });
          params.getData();
          this.getContactsData();
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
  };

  // searchContactUsers = async () =>
  // {
  //     console.log("All search request sent to api")
  //     return fetch("http://localhost:3333/api/1.0.0/search?q=&search_in=contacts",
  //     {
  //         method: 'get',
  //         headers:
  //         {
  //             'Content-Type': 'application/json',
  //             'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
  //         }
  //     })
  //     .then((response) => response.json())
  //     .then((responseJson) =>
  //     {
  //         console.log("search Contacts Data returned from api");
  //         console.log(responseJson);
  //         this.setState({ usersData: responseJson });
  //     })
  //     .catch((error) =>
  //     {
  //         console.log(error);
  //     });
  // }

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
      chatName, chatId, submitted, usersData,
    } = this.state;

    return (
      <View>
        <Text>Create New Chat</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          placeholder="Enter Chat Name"
          onChangeText={(cN) => this.setState({ chatName: cN })}
          defaultValue={chatName}
        />

        <Button
          title="Create"
          onPress={() => this.createChat()}
        />

        {
          submitted
          && (
          <View>
            <Text>Chat Created</Text>
            <Text>Add Users to Chat:</Text>
            <View>
              <FlatList
                data={usersData}
                renderItem={({ item }) => (
                  <View style={styles.container}>
                    {/* <Text>
                      {item.given_name}
                      {' '}
                      {item.family_name}
                    </Text> */}

                    <TouchableOpacity onPress={() => console.log('Profile screen')}>
                      <View>
                        <Text>
                          {item.given_name}
                          {' '}
                          {item.family_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.addToChat(chatId, item.user_id)}>
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
        }
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
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
