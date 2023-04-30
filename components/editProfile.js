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
      isLoading: false,
      originalProfileData: [],

      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',

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

      toSend.password = password;
    }

    if (password !== confirmPassword)
    {
      this.setState({ error: 'Password does not match, re-enter' });
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
        if (response.status === 200)
        {
          console.log('Profile updated');
        }
        else
        {
          console.log('Failed');
        }

        this.setState({ isLoading: false });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  render()
  {
    const {
      firstName, lastName, email, password, confirmPassword, isLoading, submitted,
    } = this.state;

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
          value={firstName}
          onChangeText={(val) => this.setState({ firstName: val })}
        />

        <Text>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={(val) => this.setState({ lastName: val })}
        />

        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={(val) => this.setState({ email: val })}
        />

        <Text>Password</Text>
        <TextInput
          placeholder="Enter password"
          onChangeText={(p) => this.setState({ password: p })}
          defaultValue={password}
        />

        <Text>Confirm Password</Text>
        <TextInput
          placeholder="Re-enter password"
          onChangeText={(cP) => this.setState({ confirmPassword: cP })}
          defaultValue={confirmPassword}
        />

        {submitted && !confirmPassword
        && <Text style={styles.error}>*Confirm Password is required</Text>}

        <Button
          title="Update"
          onPress={() => this.updateProfile()}
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
