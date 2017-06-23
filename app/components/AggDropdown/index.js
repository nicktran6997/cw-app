import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Halogen from 'halogen';
import aggToField from '../../utils/aggToField';

class AggDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.loading = false;
  }

  handleClick() {
    if (!this.props.Search.aggs[this.props.field].loaded) {
      this.loading = true;
      this.props.onAggViewed(this.props.field)
        .then(() => {
          this.loading = false;
        });
    }
  }

  render() {
    if (!this.props.Search.aggs || !this.props.Search.aggs[this.props.field]) {
      return null;
    }
    let menuItems = '';
    const buckets = this.props.Search.aggs[this.props.field].buckets;

    if (this.props.Search.total && buckets) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() =>
            this.props.onAggSelected(this.props.field, buckets[key].key)
              .then(() => this.props.doSearch())
            }
        >
          {this.props.keyToInner(this.props.field, buckets[key].key)}
          {' '}
          ({buckets[key].doc_count})
        </MenuItem>
      ));

      if (this.loading) {
        menuItems.push(
          <Halogen.BeatLoader
            key="loader"
            color="#333"
            className="text-center"
          />
        );
      }
    }

    return (
      <DropdownButton
        bsStyle="default"
        style={{ maxHeight: '200px' }}
        title={<b>{aggToField[this.props.field]}</b>}
        onClick={this.handleClick}
        key={this.props.field}
        id={`dropdown-basic-${this.props.field}`}
      >
        {menuItems}
      </DropdownButton>
    );
  }
}

AggDropdown.propTypes = {
  Search: React.PropTypes.object,
  onAggSelected: React.PropTypes.func,
  onAggViewed: React.PropTypes.func,
  doSearch: React.PropTypes.func,
  keyToInner: React.PropTypes.func,
  field: React.PropTypes.string,
};

export default AggDropdown;
