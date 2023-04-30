import AsyncStorage from '@react-native-async-storage/async-storage';

const searchUsers = async (searchTerm, location) =>
{
  console.log('All search request sent to api');
  return fetch(
    `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}`,
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
    .then((responseJson) => responseJson)
    .catch((error) =>
    {
      console.log(error);
    });
};

export default searchUsers;
