import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Button } from 'react-native-web';
import PropTypes from 'prop-types';

import getRequest from './getRequest';
import ProfileScreen from './otherUsersProfile';
import globalStyles from './globalStyleSheet';

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
      }
      else if (response.status === 400)
      {
        console.log('You cannot remove yourself');
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
      }
      else
      {
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
      }
      else if (response.status === 400)
      {
        console.log('You cannot Block yourself');
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
      }
      else
      {
        throw 'Something went wrong';
      }
    });

  render()
  {
    const {
      isLoading, contactsData, showProfile, profileUserId,
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={globalStyles.headerText}>Contacts</Text>
          </View>
          <View style={styles.blockedbtn}>
            <Button
              title="View Blocked Users"
              onPress={() => navigation.navigate(
                'blocked',
                {
                  getData: this.getData,
                  removeFromContacts: this.removeFromConatacts,
                },
              )}
            />
          </View>
          <View style={styles.addButton}>
            <Button
              title="Add New Contact"
              style={styles.addButtonText}
              onPress={() => navigation.navigate(
                'addContact',
                {
                  getData: this.getData,
                },
              )}
            />
          </View>
        </View>

        <View style={styles.contactsList}>
          <FlatList
            data={contactsData}
            renderItem={({ item }) => (
              <View style={styles.contactContainer}>
                <TouchableOpacity onPress={() =>
                {
                  this.setState({
                    showProfile: true,
                    profileUserId: item.user_id,
                  });
                }}
                >
                  <Text style={styles.contactName}>
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </Text>
                </TouchableOpacity>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => this.removeFromConatacts(item.user_id)}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Remove</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.blockUser(item.user_id)}>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 35,
    fontWeight: '800',
    color: 'black',
  },
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
