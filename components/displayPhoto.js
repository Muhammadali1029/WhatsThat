import React, { Component } from 'react';
import {
  View, Image, Text, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DisplayImage extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
    };
  }

  componentDidMount()
  {
    this.get_profile_image();
  }

  async get_profile_image()
  {
    fetch('http://localhost:3333/api/1.0.0/user/1/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
    })
      .then((res) => res.blob())
      .then((resBlob) =>
      {
        const data = URL.createObjectURL(resBlob);

        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) =>
      {
        console.log(err);
      });
  }

  render()
  {
    const { photo, isLoading } = this.state;

    if (isLoading)
    {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    if (photo)
    {
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri: photo,
            }}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>
      );
    }
    return (<Text>Loading</Text>);
  }
}
