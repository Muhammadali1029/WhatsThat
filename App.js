/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

import AuthorizationStack from './components/authStack';

export default class App extends Component
{
  render()
  {
    return (
      <AuthorizationStack />
    );
  }
}
