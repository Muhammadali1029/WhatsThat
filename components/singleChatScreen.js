import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import PropTypes from 'prop-types';
import globalStyles from '../styles/globalStyleSheet';

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
      draftSaved: false,
      viewDraft: false,
      editDraft: '',
      draft: '',
    };
  }

  componentDidMount()
  {
    const { navigation } = this.props;
    const { addListener } = navigation;
    this.getData();
    this.setUserId();
    this.getDraft();
    this.focusListener = addListener('focus', this.handleFocus);

    // Call the getData function every 5 seconds
    this.interval = setInterval(() =>
    {
      this.getData();
    }, 5000);
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

    // Clear the interval
    clearInterval(this.interval);
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
      this.setState({ userId: JSON.parse(id) });
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

  sendMessage = async (mes) =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;

    console.log('send message request sent to api');

    const toSend = {
      message: mes,
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

  getDraft = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;

    try
    {
      const draft = await AsyncStorage.getItem(`draft_message${chatItem.chat_id}`);
      if (draft)
      {
        this.setState({ draft });
      }
      else
      {
        this.setState({ draft: '' });
      }
    }
    catch (error)
    {
      console.error(error);
      this.setState({ draft: '' });
    }
  };

  saveOrEditDraft = async (draft) =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    console.log(draft);
    try
    {
      this.setState({ draft });
      await AsyncStorage.setItem(`draft_message${chatItem.chat_id}`, draft);
      this.getDraft();
    }
    catch
    {
      throw 'Something went wrong';
    }
  };

  deleteDraft = async () =>
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    try
    {
      await AsyncStorage.removeItem(`draft_message${chatItem.chat_id}`);
      this.getDraft();
    }
    catch
    {
      throw 'Something Went Wrong';
    }
  };

  render()
  {
    const { route } = this.props;
    const { params } = route;
    const { chatItem } = params;
    const {
      chatData, showModal, selectedMessage, messageId, newMessage, userId,
      draftSaved, viewDraft, editDraft, draft,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={globalStyles.container}>

        <View style={globalStyles.headerContainer}>
          <TouchableOpacity onPress={() =>
          {
            navigate('chatInfoScreen', { chatItem });
            console.log({ chatData });
          }}
          >
            <Text style={globalStyles.titleText}>{chatData.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.messagesBody}>
            <FlatList
              data={chatData.messages}
              inverted
              renderItem={({ item }) => (
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
                        <View style={styles.allModalButtons}>
                          <Text style={globalStyles.text}>Edit Message</Text>
                          <TextInput
                            style={styles.messageBox}
                            placeholder={selectedMessage}
                            onChangeText={(eM) => this.setState({ editMessage: eM })}
                          />

                          <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() =>
                            {
                              this.editMessage();
                              console.log(`Edited Message ID: ${messageId}`);
                              this.setState({ showModal: false });
                            }}
                            >
                              <View style={styles.button}>
                                <Text style={styles.buttonText}>Confirm Edit</Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() =>
                            {
                              this.deleteMessage();
                              console.log(`Deleted Message ID: ${messageId}`);
                              this.setState({ showModal: false });
                            }}
                            >
                              <View style={styles.button}>
                                <Text style={styles.buttonText}>Delete</Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => this.setState({ showModal: false })}>
                              <View style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
          // eslint-disable-next-line camelcase
              keyExtractor={({ message_id }) => message_id}
            />
          </View>
          <View style={styles.sendMessageContainer}>
            <View>
              <TextInput
                style={styles.messageBox}
                value={newMessage}
                onChangeText={(nM) => this.setState({ newMessage: nM })}
              />

              <View style={styles.draftContainer}>
                {newMessage !== ''
                && (
                  <View>
                    {!draftSaved
                      && (
                      <TouchableOpacity onPress={() =>
                      {
                        this.saveOrEditDraft(newMessage);
                        this.setState({ draftSaved: true });
                      }}
                      >
                        <Text style={styles.sendButton}>Save as Draft</Text>
                      </TouchableOpacity>
                      )}
                  </View>
                )}

                {draft.length !== 0
                && (
                <TouchableOpacity onPress={() =>
                {
                  this.setState({ viewDraft: true });
                }}
                >
                  <Text style={styles.draftButton}>View Draft</Text>
                </TouchableOpacity>
                )}
              </View>

            </View>
            <View style={styles.sendMessage}>
              <TouchableOpacity onPress={() =>
              {
                if (newMessage !== '')
                {
                  this.sendMessage(newMessage);
                }
              }}
              >
                <Text style={styles.sendButton}>Send</Text>
              </TouchableOpacity>
            </View>

            <Modal transparent visible={viewDraft}>
              <View style={styles.modalBackground}>
                <View style={styles.modal}>
                  <View style={styles.allModalButtons}>
                    <Text style={globalStyles.text}>Edit Draft</Text>
                    <TextInput
                      style={styles.messageBox}
                      placeholder={draft}
                      onChangeText={(eD) => this.setState({ editDraft: eD })}
                    />

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity onPress={() =>
                      {
                        this.saveOrEditDraft(editDraft);
                        console.log(`Edited Draft: ${editDraft}`);
                        this.setState({ viewDraft: false });
                      }}
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Confirm Edit</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity onPress={() =>
                      {
                        this.deleteDraft();
                        console.log(`Deleted Draft: ${draft}`);
                        this.setState({ viewDraft: false });
                      }}
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Delete</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity onPress={() =>
                      {
                        this.deleteDraft();
                        this.setState({ viewDraft: false });
                        this.sendMessage(draft);
                      }}
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Send Draft</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity onPress={() =>
                      {
                        this.setState({ viewDraft: false });
                      }}
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>

          </View>
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
  body: {
    flex: 1,
  },
  messagesBody: {
    flex: 1,
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
  sendMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ddd',
  },
  messageBox: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 10,
    width: '150%',
    backgroundColor: 'white',
  },
  sendMessage: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    flex: 0.5,
  },
  sendButton: {
    color: '#0077be',
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0077be',
  },
  modalBackground:
    {
      flex: 1,
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
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 2,
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
  textBoxContainer: {
    alignItems: 'center',
  },
  draftContainer: {
    alignItems: 'center',
  },
  draftButton: {
    color: '#0077be',
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0077be',
  },
  allModalButtons: {
    alignItems: 'center',
  },
});
