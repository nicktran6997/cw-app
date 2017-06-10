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
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import SearchWrapper from '../../components/SearchWrapper';
import makeSelectSearch from './selectors';
import { defaultAction } from './actions';

export class Search extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.page = 0;
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.search(this.getSearchParams());
  }

  onPageChange(args) {
    this.page = args.selected;
    this.props.search(this.getSearchParams());
  }

  getSearchParams() {
    return Object.assign({
      query: '',
      start: (this.page) * this.props.pageLength,
      length: this.props.pageLength,
    });
  }

  getRowCount() {
    return (this.props.Search && this.props.Search.rows
      && this.props.Search.rows.length) || 0;
  }

  cellForField(field) {
    return ({ rowIndex, ...props }) => (
      <Cell {...props}>
        {this.cellInner(field, this.props.Search.rows[rowIndex])}
      </Cell>
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
        <Table
          rowHeight={50}
          rowsCount={this.getRowCount()}
          height={600}
          width={1200}
          headerHeight={50}
        >
          <Column
            header={<Cell>nct_id</Cell>}
            cell={this.cellForField('nct_id')}
            width={150}
          />
          <Column
            header={<Cell>rating</Cell>}
            cell={this.cellForField('rating')}
            width={150}
          />
          <Column
            header={<Cell>status</Cell>}
            cell={this.cellForField('status')}
            width={150}
          />
          <Column
            header={<Cell>title</Cell>}
            cell={this.cellForField('title')}
            width={450}
          />
          <Column
            header={<Cell>started</Cell>}
            cell={this.cellForField('started')}
            width={150}
          />
          <Column
            header={<Cell>completed</Cell>}
            cell={this.cellForField('completed')}
            width={150}
          />
        </Table>,
        <ReactPaginate
          pageCount={Math.floor(this.props.Search.total / 25)}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={<a href="">...</a>}
          breakClassName={'break-me'}
          pageNum={1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.onPageChange}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </SearchWrapper>
    );
  }
}

Search.propTypes = {
  search: PropTypes.func.isRequired,
  // query: PropTypes.string,
  pageLength: PropTypes.number,
  Search: PropTypes.shape({
    total: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.shape({
      nct_id: PropTypes.string,
      rating: PropTypes.number,
    })),
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
