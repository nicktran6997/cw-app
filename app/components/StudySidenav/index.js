import React, { PropTypes } from 'react';
import { Col, Row, Button, ButtonGroup, Checkbox } from 'react-bootstrap';
import ReactStars from 'react-stars';
import FontAwesome from 'react-fontawesome';
import TagManager from '../../components/TagManager';

const StudySidenav = (props) => (
  <Col md={3} id="study-sidenav">
    <Row>
      <Col md={12}>
        <h2>{props.nct_id}</h2>
      </Col>
    </Row>
    <Row>
      <Col md={5}>
        <ReactStars
          count={5}
          edit={false}
          value={props.average_rating}
        />
        <small><i>{props.reviews_length || 0} Reviews</i></small>
      </Col>
      <Col md={5} style={{ paddingTop: '8px', textAlign: 'right' }}>
        <small><i>Display Wiki Data</i></small>
      </Col>
      <Col md={2} style={{ paddingLeft: 0 }}>
        <Checkbox checked={props.wikiOverride} onChange={() => props.onWikiOverride(props.nct_id, !props.wikiOverride)} />
      </Col>
    </Row>
    <Row style={{ marginBottom: '10px', marginTop: '10px' }}>
      <Col md={12}>
        <ButtonGroup>
          <Button
            onClick={() => props.router.push(`/reviews/${props.nct_id}`)}
          >
            View Reviews
          </Button>
          <Button
            onClick={props.loggedIn
              ? () => props.router.push(`/review/${props.nct_id}`)
              : () => props.onAnonymousClick()
            }
          >
            Write a Review
          </Button>
        </ButtonGroup>
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
    <Row>
      <Col md={12} className="text-center">
        {
          props.router.location.pathname.match('/review')
          ? (
            <Button onClick={() => props.router.push(`/study/${props.nct_id}`)}>
              <FontAwesome name="chevron-left" />Back to Study
            </Button>
          ) : (
            <Button onClick={() => props.router.push('/search')}>
              <FontAwesome name="chevron-left" />Back to Search
            </Button>
          )
        }
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
  average_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // because float
  reviews_length: PropTypes.number,
  study_type: PropTypes.string,
  overall_status: PropTypes.string,
  primary_completion_date: PropTypes.string,
  enrollment: PropTypes.number,
  source: PropTypes.string,
  onTagSubmit: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  loggedIn: PropTypes.bool,
  onAnonymousClick: PropTypes.func,
  router: PropTypes.object,
  wikiOverride: PropTypes.bool,
  onWikiOverride: PropTypes.func,
};

export default StudySidenav;
