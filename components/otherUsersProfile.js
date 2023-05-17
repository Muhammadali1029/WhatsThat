import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Modal, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import DisplayImage from './displayPhoto';

export default class OtherUsersProfileScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
      showModal: true,
    };
  }

  componentDidMount()
  {
    const { userID } = this.props;
    this.getData(userID);
  }

  componentWillUnmount()
  {
    console.log('ProfileScreen component is unmounting...');
  }

  getData = async (userID) =>
  {
    console.log('Profile request sent to api');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userID}`,
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
          profileData: responseJson,
        });
      })
      .catch((error) =>
      {
        console.log(error);
      });
  };

  handleClose = () =>
  {
    const { onClose } = this.props;
    this.setState({ showModal: false });
    onClose();
  };

  render()
  {
    const { isLoading, profileData, showModal } = this.state;
    const { userID } = this.props;

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
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <View>
                <Text>Profile Details</Text>
                <DisplayImage userID={userID} />

                <View>
                  <Text>
                    Name:
                    {profileData.first_name}
                    {' '}
                    {profileData.last_name}
                  </Text>
                  <Text>
                    Email:
                    {profileData.email}
                  </Text>
                </View>
                <Button
                  title="Close"
                  onPress={() => this.handleClose()}
                  accessibilityLabel="Close profile button"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

OtherUsersProfileScreen.propTypes = {
  userID: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: '80%',
    height: '40%',
  },
});
