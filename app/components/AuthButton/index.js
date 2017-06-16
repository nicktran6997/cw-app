/**
*
* AuthButton
*
*/

import React from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

const AuthButton = (props) => {
  if (!props.loggedIn) {
    return (
      <div style={{ marginTop: '10px' }}>
        <Button href="/login-signup" style={{ marginRight: '10px' }}>Login | Signup</Button>
      </div>
    );
  }
  return (
    <div style={{ marginTop: '10px' }}>
      <DropdownButton title={(props.user && props.user.email) || ''} id="loggedIn">
        <MenuItem onClick={() => props.router.push('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => props.router.push('/logout')}>Log Out</MenuItem>
      </DropdownButton>
    </div>
  );
};

AuthButton.propTypes = {
  loggedIn: React.PropTypes.bool,
  user: React.PropTypes.object,
  router: React.PropTypes.object,
};

export default AuthButton;
