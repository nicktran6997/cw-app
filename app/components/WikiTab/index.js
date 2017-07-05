import React, { PropTypes } from 'react';
import RichTextEditor from 'react-rte';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Button, Row, Col, Table, FormGroup, FormControl } from 'react-bootstrap';

const CREATE_WIKI = `
# No wiki exists for this study.
**Create one now!**`;

// these are the styles provided by diffy, btw
const DiffWrapper = styled.div`
.diff{overflow:auto;}
.diff ul{background:#fff;overflow:auto;font-size:13px;list-style:none;margin:0;padding:0;display:table;width:100%;}
.diff del, .diff ins{display:block;text-decoration:none;}
.diff li{padding:0; display:table-row;margin: 0;height:1em;}
.diff li.ins{background:#dfd; color:#080}
.diff li.del{background:#fee; color:#b00}
.diff li:hover{background:#ffc}
/* try 'whitespace:pre;' if you don't want lines to wrap */
.diff del, .diff ins, .diff span{white-space:pre-wrap;font-family:courier;}
.diff del strong{font-weight:normal;background:#fcc;}
.diff ins strong{font-weight:normal;background:#9f9;}
.diff li.diff-comment { display: none; }
.diff li.diff-block-info { background: none repeat scroll 0 0 gray; }
`;

class WikiTab extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeMarkdown = this.onChangeMarkdown.bind(this);
    this.onWikiSubmit = this.onWikiSubmit.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.toggleMarkdown = this.toggleMarkdown.bind(this);
  }

  state = {
    markdown: false,
    editable: false,
    changed: false,
    history: false,
    value: RichTextEditor.createValueFromString(CREATE_WIKI, 'markdown'),
    markdownValue: CREATE_WIKI,
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

  onChangeMarkdown(e) {
    e.persist();
    this.setState({
      markdownValue: e.target.value,
      changed: true,
    });
  }

  onWikiSubmit(e) {
    e.preventDefault();
    if (!this.props.loggedIn) {
      return this.props.onAnonymousClick();
    }
    if (this.state.markdown) {
      this.props.onWikiSubmit(this.state.markdownValue);
    } else {
      this.props.onWikiSubmit(this.state.value.toString('markdown'));
    }
    return this.toggleEditable();
  }

  // this was copypasted from reviews -- we should refactor into a component maybe?
  getName(user) {
    if (user.first_name) {
      return `${user.first_name} ${user.last_name[0]}`;
    }
    return user.email;
  }

  toggleEditable() {
    if (!this.props.loggedIn) {
      return this.props.onAnonymousClick();
    }

    if (this.state.editable && this.state.markdown) {
      // cache markdown changes into rte
      return this.setState({
        value: RichTextEditor.createValueFromString(this.state.markdownValue, 'markdown'),
        editable: false,
        history: false,
        markdown: false,
      });
    }
    return this.setState({ editable: !this.state.editable, history: false });
  }

  toggleMarkdown() {
    if (this.state.markdown) {
      // switch markdown to rte
      this.setState({
        markdown: false,
        value: RichTextEditor.createValueFromString(this.state.markdownValue, 'markdown'),
      });
    }
    // switch rte to markdown
    return this.setState({
      markdown: true,
      markdownValue: this.state.value.toString('markdown'),
    });
  }

  toggleHistory() {
    return this.setState({ history: !this.state.history, editable: false });
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

  renderHistoryButton() {
    if (!this.props.wiki.history) {
      return null;
    }
    return (
      <Button
        type="button"
        onClick={this.toggleHistory}
      >
        History <FontAwesome name="history" />
      </Button>
    );
  }

  renderMarkdownButton() {
    if (this.state.markdown) {
      return (
        <Button type="button" onClick={this.toggleMarkdown}>
          Editor <FontAwesome name="newspaper-o" />
        </Button>
      );
    }
    return (
      <Button type="button" onClick={this.toggleMarkdown}>
        Markdown <FontAwesome name="code" />
      </Button>
    );
  }

  renderEditor() {
    if (this.state.markdown) {
      return (
        <FormGroup controlId="formControlsTextarea">
          <FormControl
            style={{ minHeight: '200px' }}
            componentClass="textarea"
            defaultValue={this.state.value.toString('markdown')}
            onChange={this.onChangeMarkdown}
          />
        </FormGroup>
      );
    }
    return (
      <RichTextEditor
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }

  renderHistoryView() {
    return (
      <DiffWrapper>
        <Table striped>
          <tbody>
            { this.props.wiki.history.map((h) => (
              <tr key={h.id} style={{ padding: '10px' }}>
                <Row style={{ marginBottom: '10px', padding: '10px' }}>
                  <Col md={6}>
                    <b>{this.getName(h.user)}</b>
                    <br />
                  </Col>
                  <Col md={4}>
                    {h.comment}
                  </Col>
                  <Col md={2} className="text-right">
                    <small>
                      {new Date(h.created_at).toLocaleDateString('en-US')}
                    </small>
                  </Col>
                </Row>
                <Row style={{ padding: '10px', marginBottom: '10px' }}>
                  <Col md={12}>
                    <div
                      /* eslint-disable react/no-danger */
                      dangerouslySetInnerHTML={{ __html: h.diff_html }}
                    />
                  </Col>
                </Row>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <Col md={12} className="text-right">
            <Button type="button" onClick={this.toggleHistory}>
              View <FontAwesome name="photo" />
            </Button>
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
              Edit <FontAwesome name="edit" />
            </Button>
          </Col>
        </Row>
      </DiffWrapper>
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
              dangerouslySetInnerHTML={{
                __html: (!this.state.changed && this.props.wiki.text_html)
                ? this.props.wiki.text_html
                : this.state.value.toString('html'),
              }}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            {this.renderHistoryButton()}
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
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
            {this.renderEditor()}
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            {this.renderMarkdownButton()}
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
              Preview <FontAwesome name="photo" />
            </Button>
            {this.renderSubmitButton()}
          </Col>
        </Row>
      </form>
    );
  }

  render() {
    if (this.state.editable) {
      return this.renderEditView();
    }
    if (this.state.history) {
      return this.renderHistoryView();
    }
    return this.renderPageView();
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
