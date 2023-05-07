import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

export default class SingleChatScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      chatData: [],
      newMessage: '',
      editMessage: '',
      showModal: false,
      messageId: '',
      selectedMessage: '',
      userId: '',
    };
  }

  componentDidMount()
  {
    const { navigation } = this.props;
    const { addListener } = navigation;
    this.getData();
    this.setUserId();
    this.focusListener = addListener('focus', this.handleFocus);
  }

  componentDidUpdate(prevProps, prevState)
  {
    const { chatData } = this.state;

    if (prevState.chatData.length !== chatData.length)
    {
      this.getData();
    }
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

  setUserId = async () =>
  {
    const { userId } = this.state;
    await AsyncStorage.getItem('whatsthat_user_id').then((id) =>
    {
      this.setState({ userId: id });
    });
    console.log(userId, 'inside set id');
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
      .then(async (responseJson) =>
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

  sendMessage = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const { newMessage } = this.state;

    console.log('send message request sent to api');

    const toSend = {
      message: newMessage,
    };

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message`,
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
        console.log('New Message sent to api');
        if (response.status === 200)
        {
          console.log('message sent successfully');
          this.setState({ newMessage: '' });
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

  editMessage = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const { messageId, editMessage } = this.state;

    console.log('edit button pressed');
    console.log(messageId);

    const toSend = {
      message: editMessage,
    };
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message/${messageId}`,
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
        console.log('Edit Message sent to api');
        if (response.status === 200)
        {
          console.log('message eddited successfully');
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

  deleteMessage = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const { messageId } = this.state;

    console.log('Delete button pressed');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message/${messageId}`,
      {
        method: 'DELETE',
        headers:
            {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
      },
    )

      .then((response) =>
      {
        console.log('Delete Message sent to api');
        if (response.status === 200)
        {
          console.log('message deleted successfully');
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

  render()
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const {
      chatData, showModal, selectedMessage, messageId, newMessage, userId,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() =>
        {
          navigate('chatInfoScreen', { chatItem });
          console.log({ chatData });
        }}
        >
          <Text style={styles.headers}>{chatData.name}</Text>
        </TouchableOpacity>
        <FlatList
          data={chatData.messages}
          inverted
          renderItem={({ item }) =>
          {
            console.log('My user ID:', userId, 'message author userID:', item.author.user_id);
            return (
              <View
                style={[
                  styles.messageContainer,
                  item.author.user_id === userId
                    ? styles.myMessageContainer
                    : styles.otherMessageContainer,
                ]}
              >
                <TouchableOpacity
                  onLongPress={async () =>
                  {
                    console.log(
                      item.message_id,
                      `Message Creator ID: ${chatItem.creator.user_id}`,
                    );
                    this.setState({
                      messageId: item.message_id,
                      selectedMessage: item.message,
                    });
                    if (item.author.user_id === userId)
                    {
                      this.setState({ showModal: true });
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.author.user_id === userId
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}
                  >
                    {item.author.user_id === userId
                      ? item.message
                      : `${item.author.first_name} ${item.author.last_name}: ${item.message}`}
                  </Text>
                </TouchableOpacity>
                <Modal transparent visible={showModal}>
                  <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                      <View>
                        <Text>Edit Message</Text>
                        <TextInput
                          style={styles.messageBox}
                          placeholder={selectedMessage}
                          onChangeText={(editMessage) => this.setState({ editMessage })}
                        />

                        <Button
                          title="Confirm Edit"
                          onPress={() =>
                          {
                            this.editMessage();
                            console.log(`Edited Message ID: ${messageId}`);
                            this.setState({ showModal: false });
                          }}
                        />
                      </View>

                      <Button
                        title="Delete"
                        onPress={() =>
                        {
                          this.deleteMessage();
                          console.log(`Deleted Message ID: ${messageId}`);
                          this.setState({ showModal: false });
                        }}
                      />

                      <Button
                        title="Cancel"
                        onPress={() => this.setState({ showModal: false })}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
            );
          }}
  // eslint-disable-next-line camelcase
          keyExtractor={({ message_id }) => message_id}
        />

        <View style={styles.sendMessageContainer}>
          <TextInput
            style={styles.messageBox}
            onChangeText={(nM) => this.setState({ newMessage: nM })}
            defaultValue={newMessage}
          />
          <Button
            style={styles.button}
            title="Send"
            onPress={() =>
            {
              if (newMessage !== '')
              {
                this.sendMessage(newMessage);
              }
            }}
          />
        </View>
      </View>
    );
  }
}

SingleChatScreen.propTypes = {
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
  headers:
    {
      fontSize: 20,
      marginBottom: 20,
      borderWidth: 2,
    },
  container:
    {
      flex: 1,
      // justifyContent: 'space-between',
    },
  chats:
    {

    },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '70%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  myMessageText: {
    color: '#FFF',
  },
  otherMessageText: {
    color: '#333',
  },
  messageBox:
    {
      height: 40,
      borderWidth: 1,
      width: '60%',
      marginTop: 10,
    },
  sendMessageContainer:
    {
      flewDirection: 'row',
    },
  button:
    {
      width: '20%',
    },
  modalBackground:
    {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  modal:
    {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      bottom: 0,
      position: 'absolute',
      width: '100%',
    },
});
