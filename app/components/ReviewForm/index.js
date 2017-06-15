import React from 'react';
import ReactStars from 'react-stars';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col } from 'react-bootstrap';

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.onStarChange = this.onStarChange.bind(this);
    this.onReviewChange = this.onReviewChange.bind(this);
    this.onReviewSubmit = this.onReviewSubmit.bind(this);
    this.stars = this.props.stars;
    this.review = this.props.review;
  }

  onStarChange(e) {
    this.stars = e;
  }

  onReviewChange(e) {
    this.review = e.target.value;
  }

  onReviewSubmit(e) {
    e.persist();
    e.preventDefault();
    this.props.onReviewSubmit(this.review, this.stars, this.props.reviewId);
  }

  render() {
    if (!this.props.loggedIn) {
      return <h1>Not logged in!</h1>;
    }
    return (
      <Row id="study-tabs">
        <Col md={12}>
          <form onSubmit={this.onReviewSubmit}>
            <ReactStars
              count={5}
              value={this.stars}
              onChange={this.onStarChange}
            />
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Add Your Review
              </ControlLabel>
              <FormControl
                componentClass="textarea"
                defaultValue={this.props.review}
                placeholder="Add your review"
                onChange={this.onReviewChange}
              />
            </FormGroup>
            <Row>
              <Col md={12} className="text-right">
                <Button type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    );
  }
}

ReviewForm.propTypes = {
  onReviewSubmit: React.PropTypes.func.isRequired,
  loggedIn: React.PropTypes.bool,
  stars: React.PropTypes.string,
  review: React.PropTypes.string,
  reviewId: React.PropTypes.number,
};

ReviewForm.defaultProps = {
  stars: '0',
  review: '',
};

export default ReviewForm;
