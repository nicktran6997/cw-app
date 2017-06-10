/*
 *
 * Search
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Column, Cell } from 'fixed-data-table';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import SearchWrapper from '../../components/SearchWrapper';
import makeSelectSearch from './selectors';

export class Search extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
          rowsCount={1}
          height={500}
          width={1000}
          headerHeight={50}
        >
          <Column
            header={<Cell>Col 1</Cell>}
            cell={<Cell>Column 1 static content</Cell>}
            width={150}
          />
          <Column
            header={<Cell>Col 2</Cell>}
            cell={<Cell>Another one</Cell>}
            width={150}
          />
          <Column
            header={<Cell>Col 3</Cell>}
            cell={<Cell>Another one</Cell>}
            width={150}
          />
        </Table>,
      </SearchWrapper>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  Search: makeSelectSearch(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
