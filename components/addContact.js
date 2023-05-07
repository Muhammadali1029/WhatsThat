import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Button } from 'react-native-web';
import PropTypes from 'prop-types';

import Modal from './modal';
import ProfileScreen from './otherUsersProfile';

export default class AddContactsScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: false,
      searchTerm: '',
      usersData: [],
      offset: 0,
      showCannotAddYourself: false,
      showAdded: false,
      profileUserId: '',
      showProfile: false,
    };
  }

  searchAllUsers = async (searchTerm, location) =>
  {
    const { offset } = this.state;
    console.log('All search request sent to api');
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}&limit=10&offset=${offset}`,
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
        // const { contactsData } = this.state;

        console.log('Data returned from api');
        console.log(responseJson);
        this.setState({ usersData: responseJson });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  addToContacts = async (userID) => fetch(
    `http://localhost:3333/api/1.0.0/user/${userID}/contact`,
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
      console.log('Add to contacts sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} added to contacts`);
        this.setState({ showAdded: true });
        setTimeout(() =>
        {
          this.setState({ showAdded: false });
        }, 2000);
      }
      else if (response.status === 400)
      {
        this.setState({ showCannotAddYourself: true });
        setTimeout(() =>
        {
          this.setState({ showCannotAddYourself: false });
        }, 2000);
        console.log('You cannot add yourself');
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
      }
      else
      {
        console.log(response.status);
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
      isLoading, searchTerm, usersData, offset,
      showCannotAddYourself, showAdded, profileUserId, showProfile,
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
        <View>
          <Text>Add a user to Contacts</Text>
          <View>
            <Text>Name, Email or UserID</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter..."
              onChangeText={(sT) => this.setState({ searchTerm: sT })}
              defaultValue={searchTerm}
            />
          </View>

          <View style={styles.addbtn}>
            <TouchableOpacity onPress={() => this.searchAllUsers(searchTerm, 'all')}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text>Users:</Text>
        <FlatList
          data={usersData}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <TouchableOpacity onPress={() =>
              {
                this.setState({
                  showProfile: true,
                  profileUserId: item.user_id,
                });
              }}
              >
                <View style={styles.profilebtn}>
                  <Text style={styles.buttonText}>
                    {item.given_name}
                    {' '}
                    {item.family_name}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.addToContacts(item.user_id)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Add to contacts</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
            // eslint-disable-next-line camelcase
          keyExtractor={({ user_id }) => user_id}
        />
        <Button
          title="Go Back"
          onPress={() => navigation.navigate('contacts')}
        />
        <Button
          title="next page"
          onPress={() =>
          {
            this.setState({ offset: (offset + 10) });
            console.log(offset);
            this.searchAllUsers(searchTerm, 'all');
          }}
        />

        {showCannotAddYourself
         && <Modal alert="Cannot Add Yourself to Contacts" />}
        {showAdded
         && <Modal alert="User Added to Contacts" />}
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

AddContactsScreen.propTypes = {
  route: PropTypes.shape({
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
    justifyContent: 'start',
  },
  search: {

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
  profilebtn: {
    backgroundColor: 'red',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  disableButton: {
    marginBottom: 30,
    backgroundColor: 'gray',
  },
  buttonTextDisabled:
    {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

// searchAllUsers = async (search) =>
// {
//     console.log("All search request sent to api")
//     return fetch("http://localhost:3333/api/1.0.0/search?q=" + search + "&search_in=all",
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
//         console.log("Data returned from api");
//         console.log(responseJson);
//         this.setState({usersData: responseJson});
//     })
//     .catch((error) =>
//     {
//         console.log(error);
//     });
// }
