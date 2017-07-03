import React, { PropTypes } from 'react';
import RichTextEditor from 'react-rte';
import FontAwesome from 'react-fontawesome';
import { Button, Row, Col } from 'react-bootstrap';

const CREATE_WIKI = `
# No wiki exists for this study.
**Create one now!**`;

class WikiTab extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onWikiSubmit = this.onWikiSubmit.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
  }

  state = {
    editable: false,
    changed: false,
    value: RichTextEditor.createValueFromString(CREATE_WIKI, 'markdown'),
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wiki.exists && this.props.wiki.text !== nextProps.wiki.text) {
      this.setState({
        value: RichTextEditor.createValueFromString(nextProps.wiki.text, 'markdown'),
      });
    }
  }

  onChange(value) {
    this.setState({ value, changed: true });
  }

  onWikiSubmit(e) {
    e.preventDefault();
    if (!this.props.loggedIn) {
      return this.props.onAnonymousClick();
    }
    this.props.onWikiSubmit(this.state.value.toString('markdown'));
    return this.toggleEditable();
  }

  toggleEditable() {
    if (!this.props.loggedIn) {
      return this.props.onAnonymousClick();
    }
    return this.setState({ editable: !this.state.editable });
  }

  renderSubmitButton() {
    return (
      <Button
        type="submit"
        onClick={this.onWikiSubmit}
        disabled={!this.state.changed}
        style={{ marginLeft: '10px' }}
      >
        Submit <FontAwesome name="pencil" />
      </Button>
    );
  }

  renderPageView() {
    return (
      <div>
        <Row>
          <Col md={12}>
            <div
              id="wikiPage"
              style={{
                background: 'rgba(255, 255, 255, 1.0)',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
              /* eslint-disable react/no-danger */
              dangerouslySetInnerHTML={{ __html: this.state.value.toString('html') }}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            <Button type="button" onClick={this.toggleEditable}>
              Edit <FontAwesome name="edit" />
            </Button>
            {this.renderSubmitButton()}
          </Col>
        </Row>
      </div>
    );
  }

  renderEditView() {
    return (
      <form>
        <Row>
          <Col md={12}>
            <RichTextEditor
              onChange={this.onChange}
              value={this.state.value}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            <Button type="button" onClick={this.toggleEditable}>
              Preview <FontAwesome name="photo" />
            </Button>
            {this.renderSubmitButton()}
          </Col>
        </Row>
      </form>
    );
  }

  render() {
    return this.state.editable ? this.renderEditView() : this.renderPageView();
  }
}

WikiTab.propTypes = {
  wiki: PropTypes.object,
  onWikiSubmit: PropTypes.func,
  onAnonymousClick: PropTypes.func,
  loggedIn: PropTypes.bool,
};

WikiTab.defaultProps = {
  wiki: { exists: false },
};

export default WikiTab;
