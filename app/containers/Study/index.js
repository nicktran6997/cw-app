/*
 *
 * Study
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ReactStars from 'react-stars';
import { Row, Col, Tabs, Tab, Table, Well, Button } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import AuthButton from '../../components/AuthButton';
import TagManager from '../../components/TagManager';
import { makeSelectAuthState } from '../App/selectors';
import makeSelectStudy from './selectors';
import * as actions from './actions';

const defaultTabs = [
  'crowd', 'descriptive', 'administrative', 'recruitment', 'tracking',
];

const CrowdTab = (props) => (
  !props.data ? null :
  <Table striped>
    <thead>
      <tr>
        <th width="20%">Label</th>
        <th width="60%">Description</th>
        <th width="10%"></th>
        <th width="10%"></th>
      </tr>
    </thead>
    <tbody>
      {props.data.map((item) => (
        <tr key={item.label}>
          <td><b>{item.label}</b></td>
          <td>{item.value}</td>
          <td>Update</td>
          <td>Delete</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

CrowdTab.propTypes = {
  data: PropTypes.array,
};

const StudyTab = (props) => (
  !props.data ? null :
  <Table striped bordered condensed>
    <tbody>
      {props.data.map((item) => (
        <tr key={item.label}>
          <td><b>{item.label}</b></td>
          <td>{item.value}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

StudyTab.propTypes = {
  data: PropTypes.array,
};

const StudySidenav = (props) => (
  <Col md={3} id="study-sidenav">
    <Row>
      <Col md={12}>
        <h2>{props.nct_id}</h2>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <ReactStars
          count={5}
          edit={false}
          value={props.average_rating}
        />
        <small><i>{props.review_count || 0} Reviews</i></small>
      </Col>
    </Row>
    <Row style={{ marginBottom: '10px', marginTop: '10px' }}>
      <Col md={12}>
        { props.loggedIn ?
          <Button href={`/${props.nct_id}/review`}>Write a Review</Button>
          : null
        }
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <dl>
          <dt>Type</dt>
          <dd>{props.study_type}</dd>
          <dt>Status</dt>
          <dd>{props.overall_status}</dd>
          <dt>Primary Completion Date</dt>
          <dd>{props.primary_completion_date}</dd>
          <dt>Enrollment</dt>
          <dd>{props.enrollment}</dd>
          <dt>Source</dt>
          <dd>{props.source}</dd>
        </dl>
      </Col>
    </Row>
    <TagManager
      {...props}
      onTagSubmit={props.onTagSubmit}
      onTagRemove={props.onTagRemove}
    />
  </Col>
);

StudySidenav.propTypes = {
  nct_id: PropTypes.string,
  average_rating: PropTypes.number,
  review_count: PropTypes.number,
  study_type: PropTypes.string,
  overall_status: PropTypes.string,
  primary_completion_date: PropTypes.string,
  enrollment: PropTypes.number,
  source: PropTypes.string,
  onTagSubmit: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  loggedIn: PropTypes.bool,
};

export class Study extends React.Component {
  constructor(props) {
    super(props);
    this.onTagSubmit = this.onTagSubmit.bind(this);
    this.onTagRemove = this.onTagRemove.bind(this);
  }

  componentWillMount() {
    this.props.getStudy(this.props.params.nctId);
    this.tabs = defaultTabs;
  }

  onTagSubmit(e) {
    e.preventDefault();
    // console.log(e);
    // this.props.submitTagAction(this.props.params.nctId, )
  }

  onTagRemove(e) {
    e.preventDefault();
    // TODO
  }

  getStudyTabs() {
    return (
      <Tabs defaultActiveKey={this.tabs[0]} id="study-tabs-main">
        {
          this.tabs.map((tab) => (
            <Tab
              key={tab}
              eventKey={tab}
              title={`${tab} info`.toUpperCase()}
            >
              <Well style={{ background: 'rgba(240, 240, 240, 0.5)' }}>
                { tab === 'crowd'
                  ? <CrowdTab data={this.props.Study[tab]} />
                  : <StudyTab data={this.props.Study[tab]} />
                }
              </Well>
            </Tab>
          ))
        }
      </Tabs>
    );
  }

  render() {
    if (!this.props.Study.study) {
      return null;
    }
    return (
      <div>
        <Helmet
          title={`Study${this.props.Study.study ? `| ${this.props.Study.study.title}` : ''}`}
          meta={[
            { name: 'description', content: 'Description of Study' },
          ]}
        />
        <Row id="clinwiki-header" className="">
          <Col md={8}>
            <h1><a href="/">Clinwiki</a></h1>
          </Col>
          <Col md={4} className="text-right">
            <AuthButton {...this.props.Auth} />
          </Col>
        </Row>
        <Row>
          <StudySidenav
            {...this.props.Study.study}
            loggedIn={this.props.Auth.loggedIn}
            onTagSubmit={this.props.onTagSubmit}
            onTagRemove={this.props.onTagRemove}
          />
          <Col md={9} id="study-main">
            <Row>
              <Col md={12}>
                <h1>{this.props.Study.study.title}</h1>
              </Col>
            </Row>
            <Row id="study-tabs">
              <Col md={12}>
                {this.getStudyTabs()}
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    );
  }
}

Study.propTypes = {
  Study: PropTypes.object,
  Auth: PropTypes.object,
  getStudy: PropTypes.func.isRequired,
  params: PropTypes.object,
  onTagSubmit: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
};

Study.defaultProps = {
  Auth: { loggedIn: false },
};

const mapStateToProps = createStructuredSelector({
  Study: makeSelectStudy(),
  Auth: makeSelectAuthState(),
});

function mapDispatchToProps(dispatch) {
  return {
    getStudy: (nctId) => Promise.all([
      actions.defaultAction(dispatch, nctId)(),
      actions.crowdAction(dispatch, nctId)(),
      actions.trackingAction(dispatch, nctId)(),
      actions.descriptiveAction(dispatch, nctId)(),
      actions.adminAction(dispatch, nctId)(),
      actions.recruitmentAction(dispatch, nctId)(),
    ]),
    onTagSubmit: actions.submitTagAction(dispatch),
    onTagRemove: actions.removeTagAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Study);
