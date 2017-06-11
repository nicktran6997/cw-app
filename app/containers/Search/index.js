/*
 *
 * Search
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactStars from 'react-stars';
import ReactPaginate from 'react-paginate';
import { Table, Column, Cell } from 'fixed-data-table';
import { Row, Col, Form, FormGroup, ButtonGroup,
  FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Helmet from 'react-helmet';
import FontAwesome from 'react-fontawesome';
import { createStructuredSelector } from 'reselect';
import SearchWrapper from '../../components/SearchWrapper';
import makeSelectSearch from './selectors';
import { defaultAction } from './actions';

export class Search extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.query = this.props.query || '';
    this.page = 0;
    this.onPageChange = this.onPageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentWillMount() {
    this.doSearch();
  }

  onPageChange(args) {
    this.page = args.selected;
    this.doSearch();
  }

  onSubmit(e) {
    e.preventDefault();
    this.doSearch();
  }

  onSearchChange(e) {
    this.query = e.target.value;
  }

  getSearchParams() {
    return Object.assign({
      query: this.query,
      start: (this.page) * this.props.pageLength,
      length: this.props.pageLength,
    });
  }

  getRowCount() {
    return (this.props.Search && this.props.Search.rows
      && this.props.Search.rows.length) || 0;
  }

  doSearch() {
    this.props.search(this.getSearchParams());
  }

  cellForField(field) {
    return ({ rowIndex, ...props }) => (
      <Cell {...props}>
        {this.cellInner(field, this.props.Search.rows[rowIndex])}
      </Cell>
    );
  }

  aggDropdown(field) {
    if (!this.props.Search.aggs) {
      return '';
    }
    let menuItems = '';
    const buckets = this.props.Search.aggs[field].buckets;

    if (this.props.Search.total && buckets) {
      let keyToMenuItems;

      switch (field) {
        case 'average_rating':
          keyToMenuItems = (key) => (
            <MenuItem key={key}>
              <ReactStars
                count={5}
                edit={false}
                value={buckets[key].key}
              />
              {' '}
              ({buckets[key].doc_count})
            </MenuItem>
          );
          break;
        case 'completion_date':
        case 'start_date':
          keyToMenuItems = (key) => (
            <MenuItem key={key}>
              {new Date(buckets[key].key).getFullYear()}
              {' '}
              ({buckets[key].doc_count})
            </MenuItem>
          );
          break;
        default:
          keyToMenuItems = (key) => (
            <MenuItem key={key}>
              {buckets[key].key}
              {' '}
              ({buckets[key].doc_count})
            </MenuItem>
          );
      }
      menuItems = Object.keys(buckets).map(keyToMenuItems);
    }

    return (
      <DropdownButton
        bsStyle="default"
        title={field}
        key={field}
        id={`dropdown-basic-${field}`}
      >
        {menuItems}
      </DropdownButton>
    );
  }

  cellInner(field, row) {
    switch (field) {
      case 'rating':
        return (
          <ReactStars
            count={5}
            edit={false}
            value={row[field]}
          />
        );
      default:
        return row[field];
    }
  }

  render() {
    return (
      <SearchWrapper id="search-wrapper">
        <Helmet
          title="Search"
          meta={[
            { name: 'description', content: 'Description of Search' },
          ]}
        />
        <Row id="search-controls" style={{ marginBottom: '10px' }}>
          <Col md={8} id="aggs">
            <Row>
              <Col md={12}>
                <ButtonGroup justified>
                  {this.aggDropdown('average_rating')}
                  {this.aggDropdown('tags')}
                  {this.aggDropdown('overall_status')}
                  {this.aggDropdown('study_type')}
                  {this.aggDropdown('sponsors')}
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <ButtonGroup justified>
                  {this.aggDropdown('facility_names')}
                  {this.aggDropdown('facility_states')}
                  {this.aggDropdown('facility_cities')}
                  {this.aggDropdown('start_date')}
                  {this.aggDropdown('completion_date')}
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col md={4} id="query" className="text-right">
            <Form inline onSubmit={this.onSubmit}>
              <FormGroup controlId="formInlineEmail">
                <FormControl type="text" placeholder="Search..." onChange={this.onSearchChange} />
              </FormGroup>
              {' '}
              <Button type="submit">
                Search
                {' '}
                <FontAwesome name="search" />
              </Button>
            </Form>
          </Col>
        </Row>
        <Row id="search-main">
          <Col md={12}>
            <Table
              ref={(table) => { this.table = table; }}
              rowHeight={50}
              rowsCount={this.getRowCount()}
              height={400}
              width={1140}
              headerHeight={50}
            >
              <Column
                header={<Cell>nct_id</Cell>}
                cell={this.cellForField('nct_id')}
                width={125}
              />
              <Column
                header={<Cell>rating</Cell>}
                cell={this.cellForField('rating')}
                width={100}
              />
              <Column
                header={<Cell>status</Cell>}
                cell={this.cellForField('status')}
                width={150}
              />
              <Column
                header={<Cell>title</Cell>}
                cell={this.cellForField('title')}
                width={555}
              />
              <Column
                header={<Cell>started</Cell>}
                cell={this.cellForField('started')}
                width={105}
              />
              <Column
                header={<Cell>completed</Cell>}
                cell={this.cellForField('completed')}
                width={105}
              />
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center">
            <ReactPaginate
              pageCount={Math.floor(this.props.Search.total / 25)}
              previousLabel="previous"
              nextLabel="next"
              breakLabel={<a href="">...</a>}
              breakClassName="break-me"
              pageNum={1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={15}
              onPageChange={this.onPageChange}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
          </Col>
        </Row>
      </SearchWrapper>
    );
  }
}

Search.propTypes = {
  search: PropTypes.func.isRequired,
  query: PropTypes.string,
  pageLength: PropTypes.number,
  Search: PropTypes.shape({
    total: PropTypes.number,
    aggs: PropTypes.shape({}),
    rows: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

Search.defaultProps = {
  query: '',
  pageLength: 25,
};

const mapStateToProps = createStructuredSelector({
  Search: makeSelectSearch(),
});

function mapDispatchToProps(dispatch) {
  return {
    search: (params) => defaultAction(dispatch, params)(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
