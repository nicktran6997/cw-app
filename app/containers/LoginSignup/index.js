/*
 *
 * LoginSignup
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ReactSignupLoginComponent from 'react-signup-login-component';
import { Row, Col } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import makeSelectLoginSignup from './selectors';

export class LoginSignup extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Row>
        <Col md={8} mdOffset={3}>
          <Helmet
            title="Clinwiki | Login or Sign Up"
            meta={[
              { name: 'description', content: 'Description of LoginSignup' },
            ]}
          />
          <ReactSignupLoginComponent
            title="Clinwiki"
          />
        </Col>
      </Row>
    );
  }
}

LoginSignup.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  LoginSignup: makeSelectLoginSignup(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup);
