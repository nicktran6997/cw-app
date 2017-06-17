import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Row, Col, Tabs, Tab, Well } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import AuthButton from '../../components/AuthButton';
import StudySidenav from '../../components/StudySidenav';
import CrowdTab from '../../components/CrowdTab';
import StudyTab from '../../components/StudyTab';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';
import { makeSelectAuthState } from '../App/selectors';
import makeSelectStudy from './selectors';
import * as actions from './actions';

const defaultTabs = [
  'crowd', 'descriptive', 'administrative', 'recruitment', 'tracking',
];

export class Study extends React.Component {
  constructor(props) {
    super(props);
    this.onTagSubmit = this.onTagSubmit.bind(this);
    this.onTagRemove = this.onTagRemove.bind(this);
    this.onAnnotationCreate = this.onAnnotationCreate.bind(this);
    this.onAnnotationRemove = this.onAnnotationRemove.bind(this);
    this.onAnnotationUpdate = this.onAnnotationUpdate.bind(this);
    this.onReviewSubmit = this.onReviewSubmit.bind(this);
    this.onReviewDelete = this.onReviewDelete.bind(this);
    this.reload = this.reload.bind(this);
    this.reviewIsLoading = false;
  }

  componentWillMount() {
    this.props.getStudy(this.props.params.nctId);
    if (this.props.params.reviewId) {
      this.loadReview(this.props.params.reviewId);
    }
    this.tabs = defaultTabs;
  }

  componentWillReceiveProps(props) {
    if (props.params.reviewId && props.params.reviewId !== this.props.params.reviewId) {
      this.loadReview(props.params.reviewId);
    }
  }

  onTagSubmit(e, newTag) {
    e.preventDefault();
    if (newTag) {
      this.props.onTagSubmit(this.props.params.nctId, newTag)
        .then(this.reload);
    }
  }

  onTagRemove(e, tagId) {
    e.preventDefault();
    this.props.onTagRemove(this.props.params.nctId, tagId)
      .then(this.reload);
  }

  onAnnotationCreate(label, description) {
    return this.props.onAnnotationCreate(this.props.params.nctId, label, description)
      .then(this.reload);
  }

  onAnnotationRemove(annotationId) {
    return this.props.onAnnotationRemove(annotationId)
      .then(this.reload);
  }

  onAnnotationUpdate(annotationId, description) {
    this.props.onAnnotationUpdate(annotationId, description)
      .then(this.reload);
  }

  onReviewSubmit(comment, rating, reviewId) {
    if (reviewId) {
      this.props.onReviewUpdate(reviewId, comment, rating)
        .then(() => this.props.reload(this.props.params.nctId))
        .then(() => this.props.router.push(`/reviews/${this.props.params.nctId}`));
    } else {
      this.props.onReviewSubmit(this.props.params.nctId, comment, rating)
        .then(this.reload)
        .then(() => this.props.router.push(`/reviews/${this.props.params.nctId}`));
    }
  }

  onReviewDelete(nctId, reviewId) {
    this.props.onReviewDelete(reviewId)
      .then(() => this.props.reload(nctId))
      .then(() => this.props.router.push(`/reviews/${nctId}`));
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
                { tab === 'crowd' ?
                  <CrowdTab
                    data={this.props.Study[tab]}
                    loggedIn={this.props.Auth.loggedIn}
                    onAnnotationRemove={this.onAnnotationRemove}
                    onAnnotationUpdate={this.onAnnotationUpdate}
                    onAnnotationCreate={this.onAnnotationCreate}
                  />
                : <StudyTab data={this.props.Study[tab]} />
                }
              </Well>
            </Tab>
          ))
        }
      </Tabs>
    );
  }

  getMainView() {
    if (this.props.location.pathname.match(/\/review\//)) {
      let review = '';
      let stars = 0;
      let reviewId = null;
      if (this.props.Study.review) {
        review = this.props.Study.review.comment;
        stars = this.props.Study.review.rating;
        reviewId = this.props.Study.review.id;
      }
      return (
        <ReviewForm
          {...this.props}
          loggedIn={this.props.Auth.loggedIn}
          onReviewSubmit={this.onReviewSubmit}
          review={review}
          stars={String(stars)}
          reviewId={reviewId}
          reviewIsLoading={this.reviewIsLoading}
        />
      );
    }
    if (this.props.location.pathname.match(/\/reviews\//)) {
      return (
        <ReviewList
          reviews={this.props.Study.reviews}
          nctId={this.props.params.nctId}
          loggedIn={this.props.Auth.loggedIn}
          onReviewDelete={this.onReviewDelete}
          router={this.props.router}
        />);
    }
    return (
      <Row id="study-tabs">
        <Col md={12}>
          {this.getStudyTabs()}
        </Col>
      </Row>
    );
  }

  loadReview(reviewId) {
    this.reviewIsLoading = true;
    this.props.getReview(reviewId)
      .then(() => { this.reviewIsLoading = false; this.forceUpdate(); });
  }

  reload() {
    this.props.reload(this.props.params.nctId);
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
            <AuthButton {...this.props.Auth} router={this.props.router} />
          </Col>
        </Row>
        <Row>
          <StudySidenav
            {...this.props.Study.study}
            router={this.props.router}
            loggedIn={this.props.Auth.loggedIn}
            onTagSubmit={this.onTagSubmit}
            onTagRemove={this.onTagRemove}
          />
          <Col md={9} id="study-main">
            <Row>
              <Col md={12}>
                <h1>{this.props.Study.study.title}</h1>
              </Col>
            </Row>
            {this.getMainView()}
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
  location: PropTypes.object,
  router: PropTypes.object,
  onTagSubmit: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  onReviewSubmit: PropTypes.func.isRequired,
  onReviewUpdate: PropTypes.func.isRequired,
  onReviewDelete: PropTypes.func.isRequired,
  getReview: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  onAnnotationRemove: PropTypes.func.isRequired,
  onAnnotationUpdate: PropTypes.func.isRequired,
  onAnnotationCreate: PropTypes.func.isRequired,
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
    reload: (nctId) => Promise.all([
      actions.defaultAction(dispatch, nctId)(),
      actions.reviewsAction(dispatch, nctId)(),
      actions.crowdAction(dispatch, nctId)(),
    ]),
    getStudy: (nctId) => Promise.all([
      actions.defaultAction(dispatch, nctId)(),
      actions.crowdAction(dispatch, nctId)(),
      actions.trackingAction(dispatch, nctId)(),
      actions.descriptiveAction(dispatch, nctId)(),
      actions.adminAction(dispatch, nctId)(),
      actions.recruitmentAction(dispatch, nctId)(),
      actions.reviewsAction(dispatch, nctId)(),
    ]),
    onTagSubmit: actions.submitTagAction(dispatch),
    onTagRemove: actions.removeTagAction(dispatch),
    onReviewSubmit: actions.submitReviewAction(dispatch),
    onReviewUpdate: actions.updateReviewAction(dispatch),
    onReviewDelete: actions.deleteReviewAction(dispatch),
    getReview: actions.getReviewAction(dispatch),
    onAnnotationRemove: actions.deleteAnnotationAction(dispatch),
    onAnnotationUpdate: actions.updateAnnotationAction(dispatch),
    onAnnotationCreate: actions.createAnnotationAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Study);
