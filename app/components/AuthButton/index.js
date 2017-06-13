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
      <DropdownButton title={props.email || ''} id="loggedIn">
        <MenuItem href="/logout">Log Out</MenuItem>
      </DropdownButton>
    </div>
  );
};

AuthButton.propTypes = {
  loggedIn: React.PropTypes.bool,
  email: React.PropTypes.string,
};

export default AuthButton;
