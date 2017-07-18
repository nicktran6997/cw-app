import React from 'react';
import RichTextEditor from 'react-rte';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import _ from 'lodash';
import { Button, Row, Col, FormControl } from 'react-bootstrap';

const CREATE_REVIEW = 'Write your review here!';

const ReviewFormWrapper = styled.div`
  .rating-row { margin-bottom: 10px; }
  .adding-stars { padding-top: 5px; }
`;

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.onStarChange = this.onStarChange.bind(this);
    this.onReviewChange = this.onReviewChange.bind(this);
    this.onReviewSubmit = this.onReviewSubmit.bind(this);
    this.addRating = this.addRating.bind(this);
    this.onStarFieldChange = this.onStarFieldChange.bind(this);
    this.stars = this.props.stars;
    this.review = this.props.review;
  }

  state = {
    starFields: {},
    starFieldsEditable: {},
    addingStars: {},
    addingRows: 0,
    changed: false,
    value: null,
  };

  componentWillMount() {
    this.setState({
      value: RichTextEditor.createValueFromString(this.review || CREATE_REVIEW, 'markdown'),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.review !== nextProps.review) {
      this.state.value = RichTextEditor.createValueFromString(nextProps.review, 'markdown');
      this.forceUpdate();
    }
    if (this.props.stars !== nextProps.stars) {
      this.stars = nextProps.stars;
    }
  }

  onStarFieldChange(i, e) {
    e.persist();
    this.state.starFields[i] = e.target.value;
    this.state.starFieldsEditable[i] = this.state.starFields[i] !== '';
    this.forceUpdate();
  }

  onStarChange(field, e) {
    this.stars[field] = e;
  }

  onAddingStarChange(i, e) {
    this.state.addingStars[i] = e;
  }

  onReviewChange(value) {
    this.setState({
      value,
      changed: true,
    });
  }

  onReviewSubmit(e) {
    e.persist();
    e.preventDefault();
    const stars = Object.keys(this.state.addingStars).reduce((starAcc, i) =>
      starAcc.set(this.state.starFields[i], this.state.addingStars[i]), fromJS(this.stars)).toJS();
    this.props.onReviewSubmit(this.state.value.toString('markdown'), stars, this.props.reviewId);
  }

  addRating() {
    this.state.addingRows += 1;
    this.state.starFieldsEditable[this.state.addingRows - 1] = false;
    this.forceUpdate();
  }

  render() {
    if (!this.props.loggedIn) {
      return <h1>Not logged in!</h1>;
    }
    if (this.props.reviewIsLoading) {
      return null;
    }
    return (
      <ReviewFormWrapper>
        <Row id="study-tabs">
          <Col md={12}>
            {Object.keys(this.props.stars).map((field, i) => (
              <Row className="rating-row" key={field}>
                <Col md={4}>
                  <b>{field}</b>
                </Col>
                <Col md={6}>
                  <ReactStars
                    count={5}
                    half={false}  // can't do half-star ratings with current db schema
                    value={this.props.stars[field]}
                    onChange={(e) => this.onStarChange(field, e)}
                  />
                </Col>
                <Col md={2}>
                  { this.state.addingRows === 0 && (i === Object.keys(this.props.stars).length - 1) ?
                    <Button onClick={this.addRating}>
                      <FontAwesome name="plus" />
                    </Button>
                    : null
                  }
                </Col>
              </Row>
            ))}
            {_.range(this.state.addingRows).map((i) => (
              <Row className="rating-row" key={i}>
                <Col md={4}>
                  <FormControl
                    type="text"
                    placeholder="Your Rating"
                    onChange={(e) => this.onStarFieldChange(i, e)}
                  />
                </Col>
                <Col md={6} className="adding-stars">
                  <ReactStars
                    count={5}
                    half={false}  // can't do half-star ratings with current db schema
                    value={this.state.addingStars[i]}
                    onChange={(e) => this.onAddingStarChange(i, e)}
                  />
                </Col>
                <Col md={2}>
                  { (i === this.state.addingRows - 1) ?
                    <Button onClick={this.addRating}>
                      <FontAwesome name="plus" />
                    </Button>
                    : null
                  }
                </Col>
              </Row>
            ))}
            <Row>
              <Col md={12}>
                <RichTextEditor
                  onChange={this.onReviewChange}
                  value={this.state.value}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className="text-right">
                <Button type="submit" onClick={this.onReviewSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </ReviewFormWrapper>
    );
  }
}

ReviewForm.propTypes = {
  onReviewSubmit: React.PropTypes.func.isRequired,
  loggedIn: React.PropTypes.bool,
  stars: React.PropTypes.any,
  review: React.PropTypes.string,
  reviewId: React.PropTypes.number,
  reviewIsLoading: React.PropTypes.bool,
};

ReviewForm.defaultProps = {
  stars: {
    'Overall Rating': '0',
  },
  review: '',
};

export default ReviewForm;
