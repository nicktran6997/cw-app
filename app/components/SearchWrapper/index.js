/**
*
* SearchWrapper
*
*/

import datatableCss from 'fixed-data-table/dist/fixed-data-table.css';
import styled from 'styled-components';

const SearchWrapper = styled.div`
  @import "${datatableCss}";
  #aggs {
    .dropdown-menu {
      max-height: 300px;
      overflow: scroll;
    }
  }

`;

export default SearchWrapper;
