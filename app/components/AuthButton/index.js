/**
*
* AuthButton
*
*/

import React from 'react';
import { Button } from 'react-bootstrap';

const AuthButton = (props) => {
  if (!props.loggedIn) {
    return (
      <div style={{ marginTop: '10px' }}>
        <Button href="/login-signup" style={{ marginRight: '10px' }}>Login | Signup</Button>
      </div>
    );
  }
  return <div>oh hey you logged in</div>;
};

AuthButton.propTypes = {
  loggedIn: React.PropTypes.boolean,
};

export default AuthButton;
