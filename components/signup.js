import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Button } from 'react-native-web';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';

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
            <Text>First Name:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '80%' }}
              placeholder="Enter first name"
              onChangeText={(f) => this.setState({ firstName: f })}
              defaultValue={firstName}
            />

            {submitted && !firstName
            && <Text style={styles.error}>*First Name is required</Text>}
          </View>

          <View style={styles.lastName}>
            <Text>Last Name:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter last name"
              onChangeText={(l) => this.setState({ lastName: l })}
              defaultValue={lastName}
            />

            {submitted && !lastName
            && <Text style={styles.error}>*Last Name is required</Text>}
          </View>

          <View style={styles.email}>
            <Text>Email:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter email"
              onChangeText={(e) => this.setState({ email: e })}
              defaultValue={email}
            />

            {submitted && !email
            && <Text style={styles.error}>*Email is required</Text>}
          </View>

          <View style={styles.password}>
            <Text>Password:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter password"
              onChangeText={(p) => this.setState({ password: p })}
              defaultValue={password}
              secureTextEntry
            />

            {submitted && !password
            && <Text style={styles.error}>*Password is required</Text>}

          </View>

          <View style={styles.confirmPassword}>
            <Text>Confirm Password:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Re-enter password"
              onChangeText={(cP) => this.setState({ confirmPassword: cP })}
              defaultValue={confirmPassword}
              secureTextEntry
            />

            {submitted && !confirmPassword
            && <Text style={styles.error}>*Confirm Password is required</Text>}

          </View>

          <View style={styles.createbtn}>
            <TouchableOpacity onPress={this.onPressButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>

          {error
          && <Text style={styles.error}>{error}</Text>}

          <View>
            <Button
              title="Have an account? Login"
              onPress={() => navigation.navigate('login')}
            />
          </View>
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

    },
  firstName:
    {
      marginBottom: 5,
    },
  lastName:
    {
      marginBottom: 10,
    },
  email:
    {
      marginBottom: 15,
    },
  password:
    {
      marginBottom: 20,
    },
  confirmPassword:
    {
      marginBottom: 25,
    },
  createbtn:
    {

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
      padding: 20,
      color: 'white',
    },
  error:
    {
      color: 'red',
      fontWeight: '900',
    },
});
