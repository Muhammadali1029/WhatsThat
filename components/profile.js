import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';
import PropTypes from 'prop-types';

// import Camera from './camera';
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
    const { isLoading, profileData } = this.state;
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
              {/* <Camera /> */}
              <Button
                title="Go Back"
                onPress={() => this.setState({ takePhoto: false })}
              />
            </View>
          ) : (
            <View>
              <Text>Profile Details</Text>
              <DisplayImage />
              <Button
                title="Take Photo"
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
