import React, { Component } from 'react';



class UserSearch extends Component
{
  static searchAllUsers = async (searchTerm, searchIn) => 
  {
    console.log("All search request sent to api");
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + searchTerm + "&search_in=" + searchIn,
    {
      method: 'get',
      headers:
      {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      }
    })
    .then((response) => response.json())
    .then((responseJson) =>
    {
      console.log("Data returned from api");
      console.log(responseJson);
      const updatedUsersData = responseJson.map((user) => {
        const isContact = this.state.contactsData.some((contact) => contact.user_id === user.user_id);
        return { ...user, isContact };
      });

      this.setState({ usersData: updatedUsersData });
    })
    .catch((error) => 
    {
      console.log(error);
    });
  }
}
export default UserSearch;
