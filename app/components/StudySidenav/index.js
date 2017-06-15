import React, { PropTypes } from 'react';
import { Col, Row, Button, ButtonGroup } from 'react-bootstrap';
import ReactStars from 'react-stars';
import TagManager from '../../components/TagManager';

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
        <small><i>{props.reviews_length || 0} Reviews</i></small>
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
          { props.loggedIn ?
            <Button
              onClick={() => props.router.push(`/review/${props.nct_id}`)}
            >
              Write a Review
            </Button>
            : null
          }
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
  router: PropTypes.object,
};

export default StudySidenav;
