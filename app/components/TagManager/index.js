/**
*
* TagManager
*
*/

import React from 'react';
import {
  Row, Col, Button, FormControl, Table, FormGroup, InputGroup, Form,
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const TagManager = (props) => {
  let existingTags = '';
  if (props.tags) {
    existingTags = props.tags.map((tag) => (
      <tr key={tag}>
        <td>
          {tag}
        </td>
        <td>
          {
            props.loggedIn ?
              <FontAwesome
                name="remove"
                onClick={props.onTagRemove}
              />
              : null
          }
        </td>
      </tr>
    ));
  }
  return (
    <Row>
      <Col md={12}>
        <Table condensed striped>
          <thead>
            <tr>
              <td><b>tags</b></td>
              <td />
            </tr>
          </thead>
          <tbody>
            {existingTags}
          </tbody>
        </Table>
        {
          props.loggedIn ?
            <Form onSubmit={props.onTagSubmit}>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" />
                  <InputGroup.Button>
                    <Button>
                      Add Tag
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </Form>
            : null
        }
      </Col>
    </Row>
  );
};

// idk why loggedIn isn't working
/* eslint-disable react/no-unused-prop-types */
TagManager.propTypes = {
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
  onTagRemove: React.PropTypes.func,
  onTagSubmit: React.PropTypes.func,
  loggedIn: React.PropTypes.bool,
};

export default TagManager;
