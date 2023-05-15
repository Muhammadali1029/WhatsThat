/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import {
  StyleSheet, View, Modal, Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default class AlertModal extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      showModal: true,
    };
  }

  componentDidMount()
  {
    // Close the modal after 3 seconds
    setTimeout(() =>
    {
      this.setState({ showModal: false });
    }, 2000);
  }

  render()
  {
    const { showModal } = this.state;
    const { alert } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
          style={styles.bottomModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <Text style={styles.text}>{alert}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

AlertModal.propTypes = {
  alert: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground:
    {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
    },
  modal:
    {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      bottom: 0,
      position: 'absolute',
      width: '100%',
    },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});
