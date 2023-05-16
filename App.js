/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import AuthorizationStack from './navigators/authStack';

export default class App extends Component
{
  render()
  {
    return (
      <AuthorizationStack />
    );
  }
}
