/*
 *
 * Search
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactStars from 'react-stars';
import { Table, Column, Cell } from 'fixed-data-table';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import SearchWrapper from '../../components/SearchWrapper';
import makeSelectSearch from './selectors';
import { defaultAction } from './actions';

export class Search extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadDefault();
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

  cellForField(field) {
    return ({ rowIndex, ...props }) => (
      <Cell {...props}>
        {this.cellInner(field, this.props.Search.rows[rowIndex])}
      </Cell>
    );
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
          rowsCount={this.props.Search.total || 0}
          height={800}
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
      </SearchWrapper>
    );
  }
}

Search.propTypes = {
  loadDefault: PropTypes.func.isRequired,
  Search: PropTypes.shape({
    total: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.shape({
      nct_id: PropTypes.string,
      rating: PropTypes.number,
    })),
  }),
};

const mapStateToProps = createStructuredSelector({
  Search: makeSelectSearch(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadDefault: defaultAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
