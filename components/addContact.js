import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

import Modal from './modal';
import ProfileScreen from './otherUsersProfile';
import globalStyles from '../styles/globalStyleSheet';

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
      showAdded: false,
      profileUserId: '',
      showProfile: false,
      searchPressed: false,
      increment: 10,
      searchResults: '',
      addedName: '',
      error: '',
      showError: false,
    };
  }

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
        this.setState({ showError: true, error: 'Cannot Add Yourself' });
        setTimeout(() =>
        {
          this.setState({ showError: false });
        }, 2000);
        console.log('You cannot add yourself');
      }
      else if (response.status === 401)
      {
        this.setState({ showError: true, error: 'Unauthorised, Login' });
        setTimeout(() =>
        {
          this.setState({ showError: false });
        }, 2000);
        console.log('Unauthorized');
      }
      else if (response.status === 404)
      {
        this.setState({ showError: true, error: 'Account Doesnot Exist' });
        setTimeout(() =>
        {
          this.setState({ showError: false });
        }, 2000);
        console.log('User does not exist');
      }
      else
      {
        this.setState({ showError: true, error: 'Server Error' });
        setTimeout(() =>
        {
          this.setState({ showError: false });
        }, 2000);
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
      showAdded, profileUserId, showProfile, searchPressed, increment,
      searchResults, addedName, showError, error,
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
            <Text style={globalStyles.titleText}>Add to Contacts</Text>
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchbox}>
            <Text style={styles.text}>Name, Email or UserID</Text>
            <TextInput
              style={{
                height: 40, borderWidth: 1, width: '100%', borderRadius: 100,
              }}
              accessibilityLabel="Search Box"
              placeholder="Enter..."
              onChangeText={(sT) => this.setState({ searchTerm: sT })}
              defaultValue={searchTerm}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
              {
                this.searchUsers(searchTerm, 'all');
                this.setState({ searchPressed: true });
              }}
              accessibilityLabel="Search Button"
            >
              <View style={styles.bottomButton}>
                <Text style={styles.buttonText}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
          {searchResults === 0
            ? <Text style={globalStyles.text}>No Results...</Text>
            : null}
        </View>

        <FlatList
          styles={styles.searchList}
          data={usersData}
          renderItem={({ item }) => (
            <View style={styles.searchContainer}>
              <TouchableOpacity
                onPress={() =>
                {
                  this.setState({
                    showProfile: true,
                    profileUserId: item.user_id,
                  });
                }}
                accessibilityLabel="Clickable Searched Profile"
              >
                <Text style={styles.searchName}>
                  {item.given_name}
                  {' '}
                  {item.family_name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                {
                  this.addToContacts(item.user_id);
                  this.setState({ addedName: `${item.given_name} ${item.family_name}` });
                }}
                accessibilityLabel="Submit Button"
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Add To Contacts</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
            // eslint-disable-next-line camelcase
          keyExtractor={({ user_id }) => user_id}
        />
        {searchPressed
        && (

        <View style={styles.bottmButtonsContainer}>
          <Text>
            Page Number:
            {(offset + increment) / increment}
          </Text>
          <TouchableOpacity
            onPress={() =>
            {
              this.setState({ offset: (offset + increment) }, () =>
              {
                console.log(offset);
                this.searchUsers(searchTerm, 'all');
              });
            }}
            accessibilityLabel="Next Page Button"
          >
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>next page</Text>
            </View>
          </TouchableOpacity>

          {offset > 0
        && (
        <TouchableOpacity
          onPress={() =>
          {
            this.setState({ offset: (offset - increment) }, () =>
            {
              console.log(offset);
              this.searchUsers(searchTerm, 'all');
            });
          }}
          accessibilityLabel="Previous Page Button"
        >
          <View style={styles.bottomButton}>
            <Text style={styles.buttonText}>previous page</Text>
          </View>
        </TouchableOpacity>
        )}
          <TouchableOpacity onPress={() => navigation.navigate('contacts')} accessibilityLabel="Back Button">
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>Go Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        )}

        {showAdded
         && <Modal alert={`${addedName} added to the Contacts`} />}
        {showError
          && <Modal alert={error} />}
        {showProfile
          && (
          <ProfileScreen
            userID={profileUserId}
            onClose={() => this.setState({ showProfile: false })}
          />
          ) }
        {showError
         && <Modal alert={error} />}
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
  nav: {
    marginBottom: 5,
  },
  searchList: {
    flex: 1,
    backgroundColor: '1a1a1as',
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
    padding: 10,
  },
  searchBox: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  searchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  bottmButtonsContainer: {
    alignItems: 'center',
  },
  bottomButton: {
    backgroundColor: '#0077be',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});
