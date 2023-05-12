import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TouchableOpacity } from 'react-native-web';
import PropTypes from 'prop-types';

import Camera from './camera';
import DisplayImage from './displayPhoto';

export default class ProfileScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
      takePhoto: false,
      userId: '',
    };
  }

  async componentDidMount()
  {
    this.getData();

    await AsyncStorage.getItem('whatsthat_user_id').then((id) =>
    {
      this.setState({ userId: parseInt(id, 10) });
    });
  }

  getData = async () =>
  {
    console.log('Profile request sent to api');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('whatsthat_user_id')}`,
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
          isLoading: false,
          profileData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  logout = async () => fetch(
    'http://localhost:3333/api/1.0.0/logout',
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
      const { navigation } = this.props;

      console.log('Logout sent to api');
      if (response.status === 200)
      {
        console.log('logout successful');
        await AsyncStorage.removeItem('whatsthat_user_id');
        await AsyncStorage.removeItem('whatsthat_session_token');
        navigation.navigate('login');
      }
      else if (response.status === 401)
      {
        console.log('Unauthorized. Logged out');
        await AsyncStorage.removeItem('whatsthat_user_id');
        await AsyncStorage.removeItem('whatsthat_session_token');
        navigation.navigate('login');
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

  render()
  {
    const { isLoading, profileData, userId } = this.state;
    const { navigation } = this.props;
    const { takePhoto } = this.state;

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
        {takePhoto
          ? (
            <View style={styles.camera}>
              <Camera />
              <Button
                title="Go Back"
                onPress={() => this.setState({ takePhoto: false })}
              />
            </View>
          ) : (
            <View>
              <Text>Profile Details</Text>
              <DisplayImage userID={userId} />
              <Button
                title="Update Photo"
                onPress={() => this.setState({ takePhoto: true })}
              />
              <View>
                <Text>
                  Name:
                  {profileData.first_name}
                  {' '}
                  {profileData.last_name}
                </Text>
                <Text>
                  Email:
                  {profileData.email}
                </Text>
              </View>

              <Button
                title="Edit Profile Details"
                onPress={() => navigation.navigate('editProfile', { profileData })}
              />

              <View style={styles.logoutbtn}>
                <TouchableOpacity onPress={() => this.logout()}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
      </View>

    );
  }
}

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {

  },
  info: {

  },
  nav: {
    marginBottom: 5,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    marginBottom: 30,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});
