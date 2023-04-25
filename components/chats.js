import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

export default class ChatsScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      chatsData: [],
    };
  }

  componentDidMount()
  {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState)
  {
    const { chatsData } = this.state;
    if (prevState.chatsData.length !== chatsData.length)
    {
      this.getData();
    }
  }

  getData = async () =>
  {
    console.log('Chats request sent to api');
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
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
        console.log('Chats List Data returned from api');
        console.log(responseJson);
        this.setState({
          isLoading: false,
          chatsData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  render()
  {
    const { isLoading, chatsData } = this.state;
    const { navigation } = this.props;

    if (isLoading)
    {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View>
          <Button
            title="New Chat"
            onPress={() => navigation.navigate(
              'createChatScreen',
              {
                getData: this.getData,
              },
            )}
          />
        </View>
        <Text>Chats</Text>
        <FlatList
          data={chatsData}
          renderItem={({ item }) => (
            <View style={styles.chats}>
              <TouchableOpacity onPress={() => navigation.navigate('singleChatScreen', { item })}>
                <Text>{item.name}</Text>
                {/* <Text>
                  {item.last_message.author.first_name}
                  {' '}
                  {item.last_message.author.last_name}
                  :
                  {item.last_message.message}
                </Text> */}
              </TouchableOpacity>
            </View>
          )}
          // eslint-disable-next-line camelcase
          keyExtractor={({ chat_id }) => chat_id}
        />
      </View>
    );
  }
}

ChatsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

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
    borderWidth: 1,
  },
});
