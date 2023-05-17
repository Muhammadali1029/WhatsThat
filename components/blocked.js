import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-web';
import PropTypes from 'prop-types';

import Modal from './modal';
import globalStyles from '../styles/globalStyleSheet';

export default class BlockedScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      blockedData: [],
      showResponse: false,
      response: '',
    };
  }

  componentDidMount()
  {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState)
  {
    const { blockedData } = this.state;
    if (prevState.blockedData.length !== blockedData.length)
    {
      this.getData();
    }
  }

  getData = async () =>
  {
    console.log('Blocked request sent to api');
    return fetch(
      'http://localhost:3333/api/1.0.0/blocked',
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
          blockedData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  unblockUser = async (userID) => fetch(
    `http://localhost:3333/api/1.0.0/user/${userID}/block`,
    {
      method: 'DELETE',
      headers:
        {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
    },
  )

    .then(async (response) =>
    {
      const { route } = this.props;
      const { params } = route;

      console.log('Unblock User request sent to api');
      if (response.status === 200)
      {
        console.log(`User ${userID} Unblocked`);
        this.getData();
        params.getData();
        params.removeFromContacts(userID);
        this.setState({ showResponse: true, response: 'User Unblocked Successfuly' });
        setTimeout(() =>
        {
          this.setState({ showResponse: false });
        }, 2000);
      }
      else if (response.status === 400)
      {
        console.log('You cannot unblock yourself');
        this.setState({ showResponse: true, response: 'You cannot unblock yourself' });
        setTimeout(() =>
        {
          this.setState({ showResponse: false });
        }, 2000);
      }
      else if (response.status === 401)
      {
        console.log('Unauthorised');
        this.setState({ showResponse: true, response: 'Unauthorized' });
        setTimeout(() =>
        {
          this.setState({ showResponse: false });
        }, 2000);
      }
      else if (response.status === 404)
      {
        console.log('User does not exist');
        this.setState({ showResponse: true, response: 'User Not Found' });
        setTimeout(() =>
        {
          this.setState({ showResponse: false });
        }, 2000);
      }
      else
      {
        this.setState({ showResponse: true, response: 'Server Error' });
        setTimeout(() =>
        {
          this.setState({ showResponse: false });
        }, 2000);
        throw 'Something went wrong';
      }
    });

  render()
  {
    const {
      isLoading, blockedData, showResponse, response,
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
      <View style={globalStyles.container}>
        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.titleContainer}>
            <Text style={globalStyles.titleText}>Blocked Users</Text>
          </View>
        </View>
        <View>
          <FlatList
            data={blockedData}
            renderItem={({ item }) => (
              <View style={styles.blockList}>
                <Text style={styles.text}>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
                <TouchableOpacity onPress={() => this.unblockUser(item.user_id)} accessibilityLabel="Unblock User Button">
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Unblock</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
        {showResponse
         && <Modal alert={response} />}
      </View>
    );
  }
}

BlockedScreen.propTypes = {
  route: PropTypes.shape({
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
  blockList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  nav: {
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
