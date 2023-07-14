import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthOuter from '../Templates/AuthOuter';
import Login from '../Pages/Users/Login';
import Register from '../Pages/Users/Register';

const Auth=()=> (
  <AuthOuter>
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/reset-password" component={Login} />
    </Switch>
  </AuthOuter>
)

export default Auth;
