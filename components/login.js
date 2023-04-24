import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-web';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

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
    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount()
  {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>
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
    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(this.state.email && this.state.password))
    {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!EmailValidator.validate(this.state.email))
    {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(this.state.password))
    {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    console.log(`Button clicked: ${this.state.email} ${this.state.password}`);
    console.log('Validated and ready to send to the API');

    const toSend = {
      email: this.state.email,
      password: this.state.password,
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
          return response.json();
        }
        if (response.status === 400)
        {
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
          this.props.navigation.navigate('homenav');
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
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value != null)
    {
      this.props.navigation.navigate('homenav');
    }
  };

  render()
  {
    return (
      <View style={styles.container}>

        <View style={styles.formContainer}>
          <View style={styles.email}>
            <Text>Email:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter email"
              onChangeText={(email) => this.setState({ email })}
              defaultValue={this.state.email}
            />

            {this.state.submitted && !this.state.email
            && <Text style={styles.error}>*Email is required</Text>}

          </View>

          <View style={styles.password}>
            <Text>Password:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter password"
              onChangeText={(password) => this.setState({ password })}
              defaultValue={this.state.password}
              secureTextEntry
            />

            {this.state.submitted && !this.state.password
            && <Text style={styles.error}>*Password is required</Text>}
          </View>

          <View style={styles.loginbtn}>
            <TouchableOpacity onPress={this.onPressButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>

          {this.state.error
          && <Text style={styles.error}>{this.state.error}</Text>}

          <View>
            <Button
              title="Need an account?"
              onPress={() => this.props.navigation.navigate('signup')}
            />
          </View>
        </View>
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

    },
  email:
    {
      marginBottom: 5,
    },
  password:
    {
      marginBottom: 10,
    },
  loginbtn:
    {

    },
  signup:
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
