import React from 'react';
import { Col, Row, ButtonGroup } from 'react-bootstrap';
import AggDropdown from '../AggDropdown';


class AggDropdownGroup extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Col md={8} id="aggs">
        <Row>
          <Col md={12}>
            <ButtonGroup justified>
              <AggDropdown {...this.props} field="average_rating" />
              <AggDropdown {...this.props} field="tags" />
              <AggDropdown {...this.props} field="overall_status" />
              <AggDropdown {...this.props} field="study_type" />
              <AggDropdown {...this.props} field="sponsors" />
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ButtonGroup justified>
              <AggDropdown {...this.props} field="facility_names" />
              <AggDropdown {...this.props} field="facility_states" />
              <AggDropdown {...this.props} field="facility_cities" />
              <AggDropdown {...this.props} field="start_date" />
              <AggDropdown {...this.props} field="completion_date" />
            </ButtonGroup>
          </Col>
        </Row>
      </Col>
    );
  }
}

// cmon man
/* eslint-disable */
AggDropdownGroup.propTypes = {
  Search: React.PropTypes.object,
  onAggSelected: React.PropTypes.func,
  onAggViewed: React.PropTypes.func,
  doSearch: React.PropTypes.func,
  keyToInner: React.PropTypes.func,
};
/* eslin-enable */

export default AggDropdownGroup;
