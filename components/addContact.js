import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Button } from 'react-native-web';
import PropTypes from 'prop-types';

export default class AddContactsScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: false,
      searchTerm: '',
      contactsData: [],
      myUserId: '',
    };
  }

  searchAllUsers = async (searchTerm, location) =>
  {
    console.log('All search request sent to api');
    this.setState({ myUserId: await AsyncStorage.getItem('whatsthat_session_token') });
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}`,
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
        const { contactsData } = this.state;

        console.log('Data returned from api');
        console.log(responseJson);
        // this.setState({usersData: responseJson});
        const updatedUsersData = responseJson.map((user) =>
        {
          const isContact = contactsData.some((contact) => contact.user_id === user.user_id);
          return { ...user, isContact };
        });

        this.setState({ usersData: updatedUsersData });
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
      const { route } = this.props;
      const { params } = route;

      console.log('Add to contacts sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} added to contacts`);
        params.getData();
      }
      else if (response.status === 400)
      {
        console.log('You cannot add yourself');
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
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

  async render()
  {
    const {
      isLoading, searchTerm, usersData, myUserId,
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
        <View>
          <FlatList
            data={usersData}
            renderItem={({ item }) => (
              <View style={styles.container}>
                {/* <Text>{item.given_name} {item.family_name}</Text> */}
                <TouchableOpacity onPress={() => console.log('Profile screen')}>
                  <View style={styles.profilebtn}>
                    <Text style={styles.buttonText}>
                      {item.given_name}
                      {' '}
                      {item.family_name}
                    </Text>
                  </View>
                </TouchableOpacity>
                { item.isContact
                  ? (
                    <View style={styles.buttonDisabled}>
                      <Text style={styles.buttonText}>Added to contacts</Text>
                    </View>
                  )
                  : (
                    <TouchableOpacity onPress={() => this.addToContacts(item.user_id)}>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Add to contacts</Text>
                      </View>
                    </TouchableOpacity>
                  )}
              </View>

              // <View style={styles.buttonContainer}>
              // { item.isContact ?
              // (
              //     <View style={styles.buttonDisabled}>
              //         <Text style={styles.buttonText}>Already in contacts</Text>
              //     </View>
              // ) :
              // (
              //     <TouchableOpacity onPress={() => this.addToContacts(item.user_id)}>
              //         <View style={styles.button}>
              //             <Text style={styles.buttonText}>Add to contacts</Text>
              //         </View>
              //     </TouchableOpacity>
              // )}
              // </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
        <Button
          title="Go Back"
          onPress={() => navigation.navigate('contacts')}
        />
      </View>
    );
  }
}

AddContactsScreen.propTypes = {
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
  buttonDisabled:
    {
      backgroundColor: '#d3d3d3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
  buttonTextDisabled:
    {
      color: '#808080',
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
