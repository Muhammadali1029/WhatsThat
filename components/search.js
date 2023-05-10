/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import {
  StyleSheet, View, Modal, Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Search extends Component
{
  searchAllUsers = async (searchTerm, location) =>
  {
    const { offset, increment } = this.state;
    console.log('All search request sent to api');
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}&limit=${increment}&offset=${offset}`,
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
          usersData: responseJson,
          searchResults: responseJson.length,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };
}
