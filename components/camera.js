import React, { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function cameraTakePhoto()
{
  const [type, setType] = useState(CameraType.back);
  const [permission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  async function sendToServer(data)
  {
    console.log('Send to Server: ', data.base64);

    const res = await fetch(data.base64);
    const blob = await res.blob();

    // network request here
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('whatsthat_user_id')}/photo`,
      {
        method: 'post',
        headers:
        {
          'Content-Type': 'image/png',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: blob,
      },
    )
      .then((response) =>
      {
        if (response === 200)
        {
          console.log('Picture Added Successfuly: ', response);
        }
        throw ('Something went Wrong', response);
      })
      .catch((err) =>
      {
        console.log(err);
      });
  }

  function toggleCameraType()
  {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto()
  {
    if (camera)
    {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);
      console.log('Photo Taken: ', data);
    }
  }

  if (!permission || !permission.granted)
  {
    return (<Text>No access to camera</Text>);
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => toggleCameraType()}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => takePhoto()}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
});
