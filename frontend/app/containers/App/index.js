import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect,  } from 'react-redux';
// import { USER_TYPES } from 'config/userType';
import { getLocalToken } from 'api/localStorage';
import { setAuth } from 'redux/slices/auth';
import Admin from './Admin';
import Auth from './Auth'

const App=({ auth, dispatch }) =>{
  const loggedIn = !!auth.token
  //   const getUserType = () => {
  //     let res = null;

  //     if (auth && auth.employee) {
  //       res = auth.member.type;
  //     } else {
  //       const userInfo = getLocalToken();

  //       if (userInfo && userInfo.member) {
  //         const { member } = userInfo;
  //         res = member.type;
  //         // to prevent page refresh issue
  //         dispatch(setAuth(userInfo));
  //       }
  //     }

  //     return res;
  //   };
  //   const userType = getUserType();

  // const getRoute = (type) => {
  //   switch (type) {
  //     case 2:
  //       return <Route component={Admin} />;
  //     default:
  //       return <Route component={Admin} />;
  //   }
  // };

  // const route = getRoute(userType);
  return (
    <Switch>
      {loggedIn && <Route component={Admin} /> }
      <Route component={Auth} />
    </Switch>
  )}

App.propTypes={
  auth:PropTypes.object.isRequired,
  dispatch:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
  auth: typeof state.get('auth').toJS === 'function' ? state.get('auth').toJS() : state.get('auth'),
});

export default connect(mapStateToProps)(App);
