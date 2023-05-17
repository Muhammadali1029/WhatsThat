import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

import getRequest from './getRequest';
import ProfileScreen from './otherUsersProfile';
import globalStyles from '../styles/globalStyleSheet';
import Modal from './modal';

export default class ContactsScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      contactsData: [],
      profileUserId: '',
      showProfile: false,
      showAlert: false,
      response: '',
    };
  }

  componentDidMount()
  {
    this.getData();
  }

  componentDidUpdate()
  {
    const { navigation } = this.props;
    const { addListener } = navigation;

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
    getRequest(
      'http://localhost:3333/api/1.0.0/contacts',
      await AsyncStorage.getItem('whatsthat_session_token'),
      (resJson) =>
      {
        console.log('Contacts Data returned from api');
        console.log(resJson);
        this.setState({
          isLoading: false,
          contactsData: resJson,
        });
      },
      (status) =>
      {
        console.log(status);
      },
    );
  };

  removeFromConatacts = async (userID) => fetch(
    `http://localhost:3333/api/1.0.0/user/${userID}/contact`,
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
      console.log('Remove from contacts sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} removed from contacts`);
        this.getData();
        this.setState({ showAlert: true, response: 'User Removed from Contacts' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else if (response.status === 400)
      {
        console.log('You cannot remove yourself');
        this.setState({ showAlert: true, response: 'Cannot Remove Yourself' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
        this.setState({ showAlert: true, response: 'User doesnot exist' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else
      {
        this.setState({ showAlert: true, response: 'Server Error' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
        throw 'Something went wrong';
      }
    });

  blockUser = async (userID) => fetch(
    `http://localhost:3333/api/1.0.0/user/${userID}/block`,
    {
      method: 'POST',
      headers:
            {
              'Content-Type': 'application/json',
              'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
    },
  )
    .then(async (response) =>
    {
      console.log('Block User sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} Blocked`);
        this.getData();
        this.setState({ showAlert: true, response: 'user Blocked' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else if (response.status === 400)
      {
        console.log('You cannot Block yourself');
        this.setState({ showAlert: true, response: 'Cannot Block Yourself' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
        this.setState({ showAlert: true, response: 'User Does not exist' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
      }
      else
      {
        this.setState({ showAlert: true, response: 'Server Error' });
        setTimeout(() =>
        {
          this.setState({ showAlert: false });
        }, 2000);
        throw 'Something went wrong';
      }
    });

  render()
  {
    const {
      isLoading, contactsData, showProfile, profileUserId, showAlert, response,
    } = this.state;
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
            <Text style={globalStyles.titleText}>Contacts</Text>
          </View>
          <View style={globalStyles.headerButtonsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate(
                'blocked',
                {
                  getData: this.getData,
                  removeFromContacts: this.removeFromConatacts,
                },
              )}
              accessibilityLabel="Go to blocked screen button"
            >
              <Text style={globalStyles.headerButtons}>Blocked Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(
                'addContact',
                {
                  getData: this.getData,
                },
              )}
              accessibilityLabel="Go to add to contacts screen Button"
            >
              <Text style={globalStyles.headerButtons}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactsList}>
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View style={styles.contactContainer}>
                <TouchableOpacity
                  onPress={() =>
                  {
                    this.setState({
                      showProfile: true,
                      profileUserId: item.user_id,
                    });
                  }}
                  accessibilityLabel="Clickable profiles"
                >
                  <Text style={styles.contactName}>
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </Text>
                </TouchableOpacity>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => this.removeFromConatacts(item.user_id)} accessibilityLabel="Remove from chat Button">
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Remove</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.blockUser(item.user_id)} accessibilityLabel="Block user Button">
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Block</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
        {showProfile
          && (
          <ProfileScreen
            userID={profileUserId}
            onClose={() => this.setState({ showProfile: false })}
          />
          ) }
        {showAlert
          && <Modal alert={response} />}
      </View>
    );
  }
}

ContactsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  contactsList: {
    flex: 1,
    backgroundColor: '1a1a1as',
    paddingHorizontal: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
  },
  contactName: {
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
