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
    this.setState({
      originalProfileData: this.props.route.params.profileData,
      firstName: this.props.route.params.profileData.first_name,
      lastName: this.props.route.params.profileData.last_name,
      email: this.props.route.params.profileData.email,
    }, () =>
    {
      console.log('Profile Data: ');
      console.log(this.state);
    });
  }

  updateProfile = async () =>
  {
    this.setState({ submitted: true });
    this.setState({ error: '' });

    const toSend = {};

    if (this.state.firstName !== this.state.originalProfileData.first_name)
    {
      toSend.first_name = this.state.firstName;
    }

    if (this.state.lastName !== this.state.originalProfileData.last_name)
    {
      toSend.last_name = this.state.lastName;
    }

    if (this.state.email !== this.state.originalProfileData.email)
    {
      if (!EmailValidator.validate(this.state.email))
      {
        this.setState({ error: 'Must enter valid email' });
        return;
      }

      toSend.email = this.state.email;
    }

    if (this.state.password !== '')
    {
      const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if (!PASSWORD_REGEX.test(this.state.password))
      {
        this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
        return;
      }

      toSend.password = this.state.password;
    }

    if (this.state.password !== this.state.confirmPassword)
    {
      this.setState({ error: 'Password does not match, re-enter' });
    }

    console.log(JSON.stringify(toSend));

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${this.state.originalProfileData.user_id}`,
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
        <Text>Edit Profile Details</Text>

        <Text>First Name</Text>
        <TextInput
          value={this.state.firstName}
          onChangeText={(val) => this.setState({ firstName: val })}
        />

        <Text>Last Name</Text>
        <TextInput
          value={this.state.lastName}
          onChangeText={(val) => this.setState({ lastName: val })}
        />

        <Text>Email</Text>
        <TextInput
          value={this.state.email}
          onChangeText={(val) => this.setState({ email: val })}
        />

        <Text>Password</Text>
        <TextInput
          placeholder="Enter password"
          onChangeText={(password) => this.setState({ password })}
          defaultValue={this.state.password}
        />

        <Text>Confirm Password</Text>
        <TextInput
          placeholder="Re-enter password"
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          defaultValue={this.state.confirmPassword}
        />

        {this.state.submitted && !this.state.confirmPassword
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
    params: PropTypes.func.isRequired,
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
