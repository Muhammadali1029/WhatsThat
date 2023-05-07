import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ScrollView } from 'react-native-web';
import PropTypes from 'prop-types';

import globalStyles from './globalStyleSheet';

export default class ChatsScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: false,
      allChatsData: [],
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
          allChatsData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  render()
  {
    const { isLoading, allChatsData } = this.state;
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
      <View style={globalStyles.container}>
        <View>
          <Text styles={globalStyles.headerText}>Chats</Text>
        </View>
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
        <ScrollView style={{ flex: 1 }}>
          {allChatsData.reverse().map((item) => (
            <View key={item.chat_id}>
              <TouchableOpacity onPress={() => navigation.navigate('singleChatScreenNav', { screen: 'singleChatScreen', params: { chatItem: item } })}>
                <Text style={styles.chats}>{item.name}</Text>
                {/* <Text>
                  {item.last_message.author.first_name}
                  {' '}
                  {item.last_message.author.last_name}
                  :
                  {item.last_message.message}
                </Text> */}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

ChatsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   padding: 10,
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
