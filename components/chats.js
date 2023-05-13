import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

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

        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.titleText}>Chats</Text>
          </View>

          <View style={styles.headerButtonsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate(
              'createChatScreen',
              {
                getData: this.getData,
              },
            )}
            >
              <Text style={[
                globalStyles.headerButtons, styles.headerButtons,
              ]}
              >
                Create New Chat

              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chatsList}>
          <FlatList
            data={allChatsData}
            renderItem={({ item }) => (
              <View style={styles.chatsContainer}>

                <View style={styles.icon}>
                  <Icon name="chatbubble-ellipses-outline" size={30} color="white" />
                </View>

                <View style={styles.chats}>
                  <TouchableOpacity onPress={() => navigation.navigate('singleChatScreenNav', { screen: 'singleChatScreen', params: { chatItem: item } })}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    {/* <Text>
                    {item.last_message.author.first_name}
                    {' '}
                    {item.last_message.author.last_name}
                    :
                    {item.last_message.message}
                  </Text> */}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          // eslint-disable-next-line camelcase
            keyExtractor={({ chat_id }) => chat_id}
          />
        </View>
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
  headerButtons: {
    width: '39%',
  },
  chatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    fontSize: 20,
    fontWeight: '800',
  },
  icon: {
    marginTop: 15,
    marginRight: 10,
    alignSelf: 'flex-start',
    padding: 5,
    borderWidth: 1,
    borderRadius: 360,
    borderColor: 'black',
    backgroundColor: '#7BC74D',
  },
});
