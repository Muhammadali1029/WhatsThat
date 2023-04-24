import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';
import PropTypes from 'prop-types';

export default class ProfileScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
    };
  }

  componentDidMount()
  {
    this.getData();
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

  render()
  {
    if (this.state.isLoading)
    {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>Profile Details</Text>
        <View>
          <Text>
            Name:
            {this.state.profileData.first_name}
            {' '}
            {this.state.profileData.last_name}
          </Text>
          <Text>
            Email:
            {this.state.profileData.email}
          </Text>
        </View>

        <Button
          title="Edit Profile Details"
          onPress={() => this.props.navigation.navigate('editProfile', { profileData: this.state.profileData })}
        />
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
  button: {
    marginBottom: 30,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
