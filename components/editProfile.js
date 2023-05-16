import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-web';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';
import Modal from './modal';
import globalStyles from '../styles/globalStyleSheet';

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
      showUpdated: false,
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
          this.setState({ showUpdated: true });
          setTimeout(() =>
          {
            this.setState({ showUpdated: false });
          }, 2000);
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
      isLoading, submitted, passwordChanged, error, showUpdated,
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
      <View style={globalStyles.container}>

        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.titleText}>Edit Profile Details</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.textInputContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={(val) => this.setState({ firstName: val })}
            />

            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={lastName}
              onChangeText={(val) => this.setState({ lastName: val })}
            />

            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(val) => this.setState({ email: val })}
            />

            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              onChangeText={(p) => this.setState({ password: p, passwordChanged: true })}
              defaultValue={password}
            />

            {passwordChanged
        && (
          <View>
            <Text style={styles.text}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Re-enter password"
              onChangeText={(cP) => this.setState({ confirmPassword: cP })}
              defaultValue={confirmPassword}
            />
          </View>
        )}
          </View>

          {submitted && !confirmPassword && passwordChanged
        && <Text style={styles.error}>*Confirm Password is required</Text>}

          {error
          && <Text style={styles.error}>{error}</Text>}

          <View style={[globalStyles.buttonsContainer, styles.buttonsContainer]}>
            <TouchableOpacity onPress={() => this.updateProfile()}>
              <View style={[globalStyles.button, styles.button]}>
                <Text style={globalStyles.buttonText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('profile')}>
              <View style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Go Back</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
        {showUpdated
         && <Modal alert="Profile Details Updated Successfully!" />}
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  button: {
    marginBottom: 10,
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
  buttonsContainer: {
    flexDirection: 'column',
    padding: 15,
  },
  textInputContainer: {
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderWidth: 2,
    borderColor: '#505054',
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
});
