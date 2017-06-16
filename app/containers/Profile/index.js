import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Row, Col, Form, FormGroup, Button,
  ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import AuthButton from '../../components/AuthButton';
import { makeSelectAuthState } from '../App/selectors';
import makeSelectProfile from './selectors';
import { profileSubmitAction } from './actions';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

FieldGroup.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
};


export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.firstName = null;
    this.lastName = null;
    this.defaultQueryString = null;
    this.currentPassword = null;
    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeDefaultQueryString = this.onChangeDefaultQueryString.bind(this);
  }

  onChangeFirstName(e) {
    this.firstName = e.target.value;
  }

  onChangeLastName(e) {
    this.lastName = e.target.value;
  }

  onChangeDefaultQueryString(e) {
    this.defaultQueryString = e.target.value;
  }

  onProfileSubmit(e) {
    e.persist();
    e.preventDefault();
    this.props.submitProfile({
      id: this.props.Auth.user.id,
      first_name: this.firstName,
      last_name: this.lastName,
      default_query_string: this.defaultQueryString,
    }).then(() => this.props.router.push('/'));
  }

  render() {
    if (!(this.props.Auth && this.props.Auth.loggedIn)) {
      return <h1>Not logged in!</h1>;
    }
    return (
      <div>
        <Helmet
          title="Profile"
          meta={[
            { name: 'description', content: 'Profile Page' },
          ]}
        />
        <Row id="clinwiki-header" className="">
          <Col md={8}>
            <h1><a href="/">Clinwiki</a></h1>
          </Col>
          <Col md={4} className="text-right">
            <AuthButton {...this.props.Auth} router={this.props.router} />
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={4}>
            <Form onSubmit={this.onProfileSubmit}>
              <FieldGroup
                id="first_name"
                type="text"
                label="First Name"
                placeholder="Enter Your First Name"
                defaultValue={this.props.Auth.user.first_name}
                onChange={this.onChangeFirstName}
              />
              <FieldGroup
                id="last_name"
                type="text"
                label="Last Name"
                placeholder="Enter Your Last Name"
                defaultValue={this.props.Auth.user.last_name}
                onChange={this.onChangeLastName}
              />
              <FieldGroup
                id="default_query_string"
                type="text"
                label="Default Query"
                defaultValue={this.props.Auth.user.default_query_string}
                onChange={this.onChangeDefaultQueryString}
                placeholder="Enter A Default Query"
              />
              <Button type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

Profile.propTypes = {
  Auth: PropTypes.object,
  router: PropTypes.object,
  submitProfile: PropTypes.func,
};

Profile.defaultProps = {
  Auth: { loggedIn: false },
};

const mapStateToProps = createStructuredSelector({
  Profile: makeSelectProfile(),
  Auth: makeSelectAuthState(),
});

function mapDispatchToProps(dispatch) {
  return {
    submitProfile: profileSubmitAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
