import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TouchableOpacity } from 'react-native-web';
import PropTypes from 'prop-types';

import Camera from './camera';
import DisplayImage from './displayPhoto';
import globalStyles from '../styles/globalStyleSheet';

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
      <View style={globalStyles.container}>
        {takePhoto
          ? (
            <View style={styles.camera}>
              <Camera />
              <Button
                title="Go Back"
                onPress={() => this.setState({ takePhoto: false })}
                accessibilityLabel="Go back button"
              />
            </View>
          ) : (
            <View style={styles.profileContainer}>
              <View style={globalStyles.headerContainer}>
                <View style={globalStyles.titleContainer}>
                  <Text style={globalStyles.titleText}>Profile</Text>
                </View>

                <View style={globalStyles.headerButtonsContainer}>
                  <TouchableOpacity onPress={() => this.setState({ takePhoto: true })}>
                    <Text
                      style={[
                        globalStyles.headerButtons, styles.headerButtons,
                      ]}
                      accessibilityLabel="Go to camera button"
                    >
                      Update Photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('editProfile', { profileData })} accessibilityLabel="go to edit profile screen button">
                    <Text style={[
                      globalStyles.headerButtons, styles.headerButtons,
                    ]}
                    >
                      Edit Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.image}>
                  <DisplayImage userID={userId} />
                </View>

                <View style={styles.detailsTextContainer}>
                  <Text style={styles.detailsText}>
                    {profileData.first_name}
                    {' '}
                    {profileData.last_name}
                  </Text>
                  <Text style={styles.detailsText}>
                    {profileData.email}
                  </Text>
                </View>
              </View>

              <View style={styles.logoutButtonContainer}>
                <TouchableOpacity onPress={() => this.logout()} accessibilityLabel="Logout of account button">
                  <Text style={[globalStyles.headerButtons, styles.logoutButton]}>Logout?</Text>
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
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  image: {
    alignItems: 'center',
  },
  detailsTextContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 20,
    fontWeight: '700',
    padding: 5,
  },
  logoutButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    color: 'black',
  },
});
