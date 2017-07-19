import React from 'react';
import ReactStars from 'react-stars';
import { Table, Row, Col, Button, ButtonGroup, Label } from 'react-bootstrap';

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
                  <Col md={4} className="text-right">
                    <small>
                      {new Date(review.review.created_at).toLocaleDateString('en-US')}
                    </small>
                  </Col>
                </Row>
                <Row>
                  <Col md={9}>
                    <div
                      /* eslint-disable */
                      dangerouslySetInnerHTML={{
                        __html: review.review.text_html,
                      }}
                      /* eslint-enable */
                    />
                  </Col>
                  <Col md={3} style={{ textAlign: 'right' }}>
                    {this.props.Auth.loggedIn && review.user.id === this.props.Auth.user.id ?
                      <ButtonGroup>
                        <Button
                          id={`edit-review-${review.review.id}`}
                          onClick={() => this.props.router.push(`/review/${this.props.nctId}/edit/${review.review.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          id={`delete-review-${review.review.id}`}
                          onClick={() =>
                            this.props.onReviewDelete(review.review.nct_id, review.review.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                      : null }
                  </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                  {Object.keys(review.review.stars).map((field) => (
                    <div key={field}>
                      <Col md={2}>
                        <ReactStars
                          count={5}
                          edit={false}
                          value={review.review.stars[field]}
                        />
                        <Label>{field}</Label>
                      </Col>
                    </div>
                  ))}
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
  Auth: React.PropTypes.object,
  router: React.PropTypes.object,
};

ReviewList.defaultProps = {
  reviews: [],
};

export default ReviewList;
