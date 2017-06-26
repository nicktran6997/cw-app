/**
*
* TagManager
*
*/

import React from 'react';
import {
  Row, Col, Button, FormControl, Table, FormGroup, Form,
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class TagManager extends React.Component {
  constructor(props) {
    super(props);
    this.onTagRemove = this.onTagRemove.bind(this);
    this.onTagSubmit = this.onTagSubmit.bind(this);
    this.changeNewTag = this.changeNewTag.bind(this);
    this.newTag = '';
  }

  onTagRemove(e, tagId) {
    if (this.props.loggedIn) {
      e.persist();
      this.props.onTagRemove(e, tagId);
    } else {
      this.props.onAnonymousClick();
    }
  }

  onTagSubmit(e) {
    e.persist();
    if (this.props.loggedIn) {
      this.props.onTagSubmit(e, this.newTag);
      this.textInput.value = '';
    } else {
      e.preventDefault();
      this.props.onAnonymousClick();
    }
  }

  changeNewTag(e) {
    this.newTag = e.target.value;
  }

  render() {
    let existingTags = '';
    if (this.props.tags) {
      existingTags = this.props.tags.map((tag) => (
        <tr key={tag.id}>
          <td>
            {tag.value}
          </td>
          <td>
            <FontAwesome
              name="remove"
              style={{ cursor: 'pointer' }}
              onClick={(e) => this.onTagRemove(e, tag.id)}
            />
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
          <Form inline onSubmit={this.onTagSubmit} ref={(ref) => { this.form = ref; }}>
            <FormGroup controlId="formInlineEmail">
              <FormControl
                type="text"
                inputRef={(ref) => { this.textInput = ref; }}
                onFocus={this.onFocus}
                onChange={this.changeNewTag}
                onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    this.onTagSubmit(e);
                  }
                }}
              />
            </FormGroup>
            {' '}
            <Button type="submit">
              Add Tag
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

// idk why loggedIn isn't working
/* eslint-disable react/no-unused-prop-types */
TagManager.propTypes = {
  tags: React.PropTypes.arrayOf(React.PropTypes.object),
  onTagRemove: React.PropTypes.func,
  onTagSubmit: React.PropTypes.func,
  onAnonymousClick: React.PropTypes.func,
  loggedIn: React.PropTypes.bool,
};

export default TagManager;
