/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, TouchableOpacity } from 'react-native-web';
import PropTypes from 'prop-types';

export default class ChatInfoScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      showEdit: false,
    };
  }

  render()
  {
    const { route } = this.props;
    const { params } = route;
    const { chatData } = params;
    return (
      <View style={styles.container}>
        <Text>Chat Info</Text>
        <TouchableOpacity onPress={() => console.log('edit')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </View>
        </TouchableOpacity>
        <Text>{chatData.name}</Text>
        <View style={styles.members}>
          <FlatList
            data={chatData.members}
            renderItem={({ item }) => (
              <View style={styles.membersList}>
                <Text>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
              </View>
            )}
            // eslint-disable-next-line camelcase
            keyExtractor={({ user_id }) => user_id}
          />
        </View>
      </View>
    );
  }
}

ChatInfoScreen.propTypes = {
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
    justifyContent: 'flex-start',
    marginTop: 40,
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
