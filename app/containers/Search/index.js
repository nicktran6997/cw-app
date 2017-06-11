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
import { Row, Col, Form, FormGroup, ButtonGroup, Label,
  FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Helmet from 'react-helmet';
import FontAwesome from 'react-fontawesome';
import { createStructuredSelector } from 'reselect';
import SearchWrapper from '../../components/SearchWrapper';
import makeSelectSearch from './selectors';
import { defaultAction } from './actions';

const aggToField = {
  average_rating: 'average rating',
  tags: 'tags',
  overall_status: 'status',
  study_type: 'type',
  sponsors: 'sponsors',
  facility_names: 'facilities',
  facility_states: 'states',
  facility_cities: 'cities',
  start_date: 'start date',
  completion_date: 'completion date',
};

export class Search extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.query = this.props.query || '';
    this.aggs = {};
    this.page = 0;
    this.sorts = {};
    this.onPageChange = this.onPageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onAggSelected = this.onAggSelected.bind(this);
    this.onAggRemoved = this.onAggRemoved.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
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

  onAggSelected(field, key) {
    if (!this.aggs[field]) {
      this.aggs[field] = {};
    }
    // cast to string to make dates behave for now (idk)
    this.aggs[field][String(key)] = 1;
    this.doSearch();
  }

  onAggRemoved(field, key) {
    if (this.aggs[field]) {
      delete this.aggs[field][key];
    }
    this.doSearch();
  }

  getSearchParams() {
    const searchParams = Object.assign({
      query: this.query,
      start: (this.page) * this.props.pageLength,
      length: this.props.pageLength,
    }, this.getAggsObject(), this.getSortsObject());
    return searchParams;
  }

  getAggsObject() {
    if (this.aggs) {
      return { agg_filters: this.aggs };
    }
    return {};
  }

  getSortsObject() {
    if (this.sorts) {
      return { sort: this.sorts };
    }
    return {};
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
      <Cell {...props} className="text-center">
        {this.cellInner(field, this.props.Search.rows[rowIndex])}
      </Cell>
    );
  }

  keyToInner(field, bucketKey) {
    switch (field) {
      case 'average_rating':
        return ({
          0: '☆☆☆☆☆',
          1: '★☆☆☆☆',
          2: '★★☆☆☆',
          3: '★★★☆☆',
          4: '★★★★☆',
          5: '★★★★★',
        }[bucketKey]);
      case 'completion_date':
      case 'start_date':
        return (new Date(parseInt(bucketKey, 10)).getFullYear());
      default:
        return (bucketKey);
    }
  }

  aggDropdown(field) {
    if (!this.props.Search.aggs) {
      return '';
    }
    let menuItems = '';
    const buckets = this.props.Search.aggs[field].buckets;

    if (this.props.Search.total && buckets) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() => this.onAggSelected(field, buckets[key].key)}
        >
          {this.keyToInner(field, buckets[key].key)}
          {' '}
          ({buckets[key].doc_count})
        </MenuItem>
      ));
    }

    return (
      <DropdownButton
        bsStyle="default"
        title={<b>{aggToField[field]}</b>}
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

  searchFilters() {
    const searchFilters = [];
    Object.keys(this.aggs).forEach((field) => {
      if (this.aggs[field]) {
        Object.keys(this.aggs[field]).forEach((key) => {
          searchFilters.push(
            <Label style={{ marginRight: '5px' }} key={key}>
              {aggToField[field]}: {this.keyToInner(field, key)}
              {' '}
              <FontAwesome
                style={{ cursor: 'pointer', color: '#cc1111' }}
                name="remove"
                onClick={() => this.onAggRemoved(field, key)}
              />
            </Label>);
        });
      }
    });
    return searchFilters;
  }

  headerCell(field, passedKey = null) {
    const key = passedKey || field;
    return (
      <Cell className="text-center">
        {field}
        {' '}
        <FontAwesome
          name={`sort${this.sorts[key] ? `-${this.sorts[key]}` : ''}`}
          onClick={() => this.toggleSort(key)}
          style={{ cursor: 'pointer' }}
        />
      </Cell>
    );
  }

  toggleSort(field) {
    switch (this.sorts[field]) {
      case 'asc':
        this.sorts[field] = 'desc';
        break;
      case 'desc':
        delete this.sorts[field];
        break;
      default:
        this.sorts[field] = 'asc';
        break;
    }
    this.doSearch();
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
        <Row id="search-filters" style={{ height: '15px', marginBottom: '10px' }}>
          <Col md={12}>
            {this.searchFilters()}
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
                header={this.headerCell('nct_id')}
                cell={this.cellForField('nct_id')}
                width={125}
              />
              <Column
                header={this.headerCell('rating', 'average_rating')}
                cell={this.cellForField('rating')}
                width={100}
              />
              <Column
                header={this.headerCell('status', 'overall_status')}
                cell={this.cellForField('status')}
                width={150}
              />
              <Column
                header={this.headerCell('title', 'brief_title')}
                cell={this.cellForField('title')}
                width={555}
              />
              <Column
                header={this.headerCell('started', 'start_date')}
                cell={this.cellForField('started')}
                width={105}
              />
              <Column
                header={this.headerCell('completed', 'completion_date')}
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
