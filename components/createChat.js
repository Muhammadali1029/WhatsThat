import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

// import getData from './getRequest';
import Modal from './modal';
import ProfileScreen from './otherUsersProfile';

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
      searchResults: '',
      showProfile: false,
      profileUserId: '',
      searchPressed: false,
      searchTerm: '',
      offset: 0,
      increment: 10,
    };
  }

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
          return response.json();
        }

        throw 'Something went wrong';
      })
      .then(async (resJson) =>
      {
        console.log(`New created chat id: ${resJson.chat_id}`);
        this.setState({
          chatId: resJson.chat_id,
          submitted: true,
        });
      })

      .catch((error) =>
      {
        console.log(error);
      });
  };

  searchUsers = async (searchTerm, location) =>
  {
    const { offset, increment } = this.state;
    console.log('All search request sent to api');
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}&limit=${increment}&offset=${offset}`,
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
        console.log('Data returned from api');
        console.log(responseJson);
        this.setState({
          usersData: responseJson,
          searchResults: responseJson.length,
        });
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
      chatName, submitted, usersData, userAddedToChat, searchResults,
      showChatCreated, addedName, alreadyAdded, showProfile, profileUserId,
      searchPressed, searchTerm, offset, increment, chatId,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={styles.container}>
        <Text>Create New Chat</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          placeholder="Enter Chat Name"
          onChangeText={(cN) => this.setState({ chatName: cN })}
          defaultValue={chatName}
        />

        {chatName && !submitted
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
            <View>
              <Text>Add Users to Chat:</Text>
              <View>
                <Text>Name, Email or UserID</Text>
                <TextInput
                  style={{ height: 40, borderWidth: 1, width: '100%' }}
                  placeholder="Enter..."
                  onChangeText={(sT) => this.setState({ searchTerm: sT })}
                  defaultValue={searchTerm}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() =>
                {
                  this.searchUsers(searchTerm, 'contacts');
                  this.setState({ searchPressed: true });
                }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Search</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {searchResults === 0
              ? <Text>No Results...</Text>
              : null}

            <FlatList
              styles={styles.searchList}
              data={usersData}
              renderItem={({ item }) => (
                <View style={styles.searchContainer}>
                  <TouchableOpacity onPress={() =>
                  {
                    this.setState({
                      showProfile: true,
                      profileUserId: item.user_id,
                    });
                  }}
                  >
                    <Text style={styles.searchName}>
                      {item.given_name}
                      {' '}
                      {item.family_name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>
                  {
                    this.addToChat(chatId, item.user_id);
                    this.setState({ addedName: `${item.given_name} ${item.family_name}` });
                  }}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Add To Chat</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            // eslint-disable-next-line camelcase
              keyExtractor={({ user_id }) => user_id}
            />
            {searchPressed
        && (
        <View>
          <Text>
            Page Number:
            {(offset + increment) / increment}
          </Text>
          <Button
            title="next page"
            onPress={() =>
            {
              this.setState({ offset: (offset + increment) }, () =>
              {
                console.log(offset);
                this.searchUsers(searchTerm, 'contacts');
              });
            }}
          />
          {offset > 0
          && (
          <Button
            title="previous page"
            onPress={() =>
            {
              this.setState({ offset: (offset - increment) }, () =>
              {
                console.log(offset);
                this.searchUsers(searchTerm, 'contacts');
              });
            }}
          />
          )}
        </View>
        )}
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

        {showProfile
          && (
          <ProfileScreen
            userID={profileUserId}
            onClose={() => this.setState({ showProfile: false })}
          />
          ) }
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
  },
  searchList: {
    flex: 1,
    backgroundColor: '1a1a1as',
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
  },
  searchName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
