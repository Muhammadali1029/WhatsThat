import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Button } from 'react-native-web';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';
import globalStyles from '../styles/globalStyleSheet';

export default class SignUpScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      submitted: false,
    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton()
  {
    const {
      firstName, lastName, email, password, confirmPassword,
    } = this.state;
    const { navigation } = this.props;

    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(firstName && lastName && email && password && confirmPassword))
    {
      this.setState({ error: 'Must enter all details' });
      return;
    }

    if (!EmailValidator.validate(email))
    {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(password))
    {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    if (password !== confirmPassword)
    {
      this.setState({ error: 'Password does not match, re-enter' });
    }

    console.log(`Button clicked: ${firstName} ${lastName} ${email} ${password}`);
    console.log('Validated and ready to send to the API');

    const toSend = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'post',
        headers:
            {
              'Content-Type': 'application/json',
            },
        body: JSON.stringify(toSend),
      },
    )
      .then((response) =>
      {
        console.log('Signup details sent to api');

        if (response.status === 201)
        {
          console.log('Account created');
          return response.json();
        }
        if (response.status === 400)
        {
          throw 'Account already exists';
        }
        else
        {
          throw 'Something went wrong';
        }
      })
      .then((rJson) =>
      {
        console.log(rJson);
        this.setState({ error: 'User added successfully' });
        this.setState({ submitted: false });
        navigation.navigate('login');
      })
      .catch((error) =>
      {
        console.log(error);
      });
  }

  render()
  {
    const {
      firstName, lastName, email, password, confirmPassword, submitted, error,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.firstName}>
            <Text style={globalStyles.text}>First Name:</Text>
            <TextInput
              style={globalStyles.textInput}
              placeholder="Enter first name"
              onChangeText={(f) => this.setState({ firstName: f })}
              defaultValue={firstName}
            />

            {submitted && !firstName
            && <Text style={styles.error}>*First Name is required</Text>}
          </View>

          <View style={styles.lastName}>
            <Text style={globalStyles.text}>Last Name:</Text>
            <TextInput
              style={globalStyles.textInput}
              placeholder="Enter last name"
              onChangeText={(l) => this.setState({ lastName: l })}
              defaultValue={lastName}
            />

            {submitted && !lastName
            && <Text style={styles.error}>*Last Name is required</Text>}
          </View>

          <View style={styles.email}>
            <Text style={globalStyles.text}>Email:</Text>
            <TextInput
              style={globalStyles.textInput}
              placeholder="Enter email"
              onChangeText={(e) => this.setState({ email: e })}
              defaultValue={email}
            />

            {submitted && !email
            && <Text style={styles.error}>*Email is required</Text>}
          </View>

          <View style={styles.password}>
            <Text style={globalStyles.text}>Password:</Text>
            <TextInput
              style={globalStyles.textInput}
              placeholder="Enter password"
              onChangeText={(p) => this.setState({ password: p })}
              defaultValue={password}
              secureTextEntry
            />

            {submitted && !password
            && <Text style={styles.error}>*Password is required</Text>}

          </View>

          <View style={styles.confirmPassword}>
            <Text style={globalStyles.text}>Confirm Password:</Text>
            <TextInput
              style={globalStyles.textInput}
              placeholder="Re-enter password"
              onChangeText={(cP) => this.setState({ confirmPassword: cP })}
              defaultValue={confirmPassword}
              secureTextEntry
            />

            {submitted && !confirmPassword
            && <Text style={styles.error}>*Confirm Password is required</Text>}

          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity onPress={this.onPressButton}>
              <View style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>

          {error
          && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={[globalStyles.headerButtonsContainer, styles.btnContainer]}>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <View style={globalStyles.headerButtons}>
              <Text style={styles.buttonText}>Have an account? Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container:
    {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  formContainer:
    {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  signin:
    {
      justifyContent: 'center',
      textDecorationLine: 'underline',
    },
  button:
    {
      marginBottom: 30,
      backgroundColor: '#2196F3',
    },
  buttonText:
    {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
    },
  btnContainer: {
    marginBottom: 20,
  },
  error:
    {
      color: 'red',
      fontWeight: '900',
    },
});
