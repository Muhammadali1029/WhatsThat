import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';

export default class EditProfileScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      originalProfileData: [],

      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordChanged: false,

      error: '',
      submitted: false,
    };
  }

  componentDidMount()
  {
    const { route } = this.props;
    const { profileData } = route.params;

    this.setState({
      originalProfileData: profileData,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      email: profileData.email,
    }, () =>
    {
      console.log('Profile Data: ');
      console.log(this.state);
    });
  }

  updateProfile = async () =>
  {
    const {
      firstName, lastName, email, password, confirmPassword, originalProfileData,
    } = this.state;

    this.setState({ submitted: true });
    this.setState({ error: '' });

    const toSend = {};

    if (firstName !== originalProfileData.first_name)
    {
      toSend.first_name = firstName;
    }

    if (lastName !== originalProfileData.last_name)
    {
      toSend.last_name = lastName;
    }

    if (email !== originalProfileData.email)
    {
      if (!EmailValidator.validate(email))
      {
        this.setState({ error: 'Must enter valid email' });
        return;
      }
      toSend.email = email;
    }

    if (password !== '')
    {
      const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if (!PASSWORD_REGEX.test(password))
      {
        this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
        return;
      }

      if (password !== confirmPassword)
      {
        this.setState({ error: 'Password does not match, re-enter' });
        return;
      }

      toSend.password = password;
    }

    console.log(JSON.stringify(toSend));

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${originalProfileData.user_id}`,
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
        console.log('Edit Profile sent to API');

        if (response.status === 200)
        {
          console.log('Profile updated');
        }
        else
        {
          throw 'Something went Wrong';
        }
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  render()
  {
    const {
      firstName, lastName, email, password, confirmPassword,
      isLoading, submitted, passwordChanged, error,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;

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
        <Text>Edit Profile Details</Text>

        <Text>First Name</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          value={firstName}
          onChangeText={(val) => this.setState({ firstName: val })}
        />

        <Text>Last Name</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          value={lastName}
          onChangeText={(val) => this.setState({ lastName: val })}
        />

        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          value={email}
          onChangeText={(val) => this.setState({ email: val })}
        />

        <Text>Password</Text>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          placeholder="Enter password"
          onChangeText={(p) => this.setState({ password: p, passwordChanged: true })}
          defaultValue={password}
        />

        {passwordChanged
        && (
          <View>
            <Text>Confirm Password</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Re-enter password"
              onChangeText={(cP) => this.setState({ confirmPassword: cP })}
              defaultValue={confirmPassword}
            />
          </View>
        )}

        {submitted && !confirmPassword && passwordChanged
        && <Text style={styles.error}>*Confirm Password is required</Text>}

        {error
          && <Text style={styles.error}>{error}</Text>}

        <Button
          title="Update"
          onPress={() => this.updateProfile()}
        />

        <Button
          title="Go Back"
          onPress={() => navigate('profile')}
        />
      </View>
    );
  }
}

EditProfileScreen.propTypes = {
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
  error:
  {
    color: 'red',
    fontWeight: '900',
  },
});
