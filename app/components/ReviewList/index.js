import React from 'react';
import ReactStars from 'react-stars';
import { Link } from 'react-router';
import { Table, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

class ReviewList extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getName(user) {
    if (user.first_name) {
      return `${user.first_name} ${user.last_name[0]}`;
    }
    return user.email;
  }

  render() {
    if (!this.props.reviews || this.props.reviews.length === 0) {
      return <h1>No Reviews!</h1>;
    }
    return (
      <Table striped >
        <tbody>
          {this.props.reviews.map((review) => (
            <tr key={review.review.id}>
              <td>
                <Row style={{ marginBottom: '10px' }}>
                  <Col md={8}>
                    <b>{this.getName(review.user)}</b>
                    <br />
                  </Col>
                  <Col md={2} className="text-right">
                    <small>
                      {new Date(review.review.created_at).toLocaleDateString('en-US')}
                    </small>
                  </Col>
                  <Col md={2}>
                    <ReactStars
                      count={5}
                      edit={false}
                      value={review.review.rating}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={9}>
                    {review.review.comment}
                  </Col>
                  <Col md={3}>
                    {this.props.loggedIn ?
                      <ButtonGroup>
                        <Button>
                          <Link
                            to={`/review/${this.props.nctId}/edit/${review.review.id}`}
                            style={{ color: 'rgb(51, 51, 51)' }}
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button
                          onClick={() =>
                            this.props.onReviewDelete(review.review.nct_id, review.review.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                      : null }
                  </Col>
                </Row>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

ReviewList.propTypes = {
  reviews: React.PropTypes.array,
  nctId: React.PropTypes.string,
  onReviewDelete: React.PropTypes.func,
  loggedIn: React.PropTypes.bool,
};

ReviewList.defaultProps = {
  reviews: [],
};

export default ReviewList;
