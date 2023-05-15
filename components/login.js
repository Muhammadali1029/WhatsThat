import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Button } from 'react-native-web';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import Modal from './modal';
import globalStyles from './globalStyleSheet';

export default class LoginScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false,
      loginSuccessful: false,
      noAccount: false,
    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount()
  {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () =>
    {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount()
  {
    this.unsubscribe();
  }

  onPressButton()
  {
    const { email, password } = this.state;
    const { navigation } = this.props;

    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(email && password))
    {
      this.setState({ error: 'Must enter email and password' });
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

    console.log(`Button clicked: ${email} ${password}`);
    console.log('Validated and ready to send to the API');

    const toSend = {
      email,
      password,
    };

    return fetch(
      'http://localhost:3333/api/1.0.0/login',
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
        console.log('Login details sent to api');
        if (response.status === 200)
        {
          console.log('login successful');
          this.setState({ loginSuccessful: true });
          setTimeout(() =>
          {
            this.setState({ loginSuccessful: false });
          }, 2000);
          return response.json();
        }
        if (response.status === 400)
        {
          this.setState({ noAccount: true });
          setTimeout(() =>
          {
            this.setState({ noAccount: false });
          }, 2000);
          throw 'Account does not exist';
        }
        else
        {
          throw 'Something went wrong';
        }
      })
      .then(async (rJson) =>
      {
        console.log(rJson);
        try
        {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);

          this.setState({
            submitted: false,
          });
          navigation.navigate('homenav');
        }
        catch
        {
          throw 'Something went wrong';
        }
      })
      .catch((error) =>
      {
        console.log(error);
      });
  }

  checkLoggedIn = async () =>
  {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value != null)
    {
      navigation.navigate('homenav');
    }
  };

  render()
  {
    const {
      email, password, submitted, error, loginSuccessful, noAccount,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={[styles.container, globalStyles.backgroundOveride]}>
        <View style={styles.formContainer}>
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

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity onPress={this.onPressButton}>
              <View style={[globalStyles.button, styles.button]}>
                <Text style={globalStyles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>

          {error
          && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={[globalStyles.headerButtonsContainer, styles.btnContainer]}>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <View style={globalStyles.headerButtons}>
              <Text style={styles.buttonText}>Need an account?</Text>
            </View>
          </TouchableOpacity>
        </View>

        {loginSuccessful
        && <Modal alert="Login Successful" />}
        {noAccount
         && <Modal alert="Account Does Not Exist" />}
      </View>
    );
  }
}

LoginScreen.propTypes = {
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
  email:
    {
      marginBottom: 10,
    },
  password:
    {
      marginBottom: 10,
    },
  signup:
    {
      justifyContent: 'center',
      textDecorationLine: 'underline',
    },
  button:
    {
      marginBottom: 30,
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
