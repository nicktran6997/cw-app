import React, { PropTypes } from 'react';
import { Button, Table } from 'react-bootstrap';

class CrowdTab extends React.Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const moreRows = [];
    if (this.props.loggedIn) {
      if (this.showAddNewRow) {
        moreRows.push(
          <tr id="annotation-edit-row" key="annotation-edit-row">
            <td><input placeholder="Enter a label" /></td>
            <td><input placeholder="Enter a value" /></td>
            <td colSpan={2} className="text-rigth">
              <Button>Submit</Button>
            </td>
          </tr>
        );
      }
    }
    return (
      <Table striped>
        <thead>
          <tr>
            <th width="20%">Label</th>
            <th width="60%">Description</th>
            <th width="10%"></th>
            <th width="10%"></th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((item) => (
            <tr key={item.label}>
              <td><b>{item.label}</b></td>
              <td>{item.value}</td>
              <td><Button>Update</Button></td>
              <td><Button>Delete</Button></td>
            </tr>
          ))}
          {moreRows}
        </tbody>
      </Table>
    );
  }
}

CrowdTab.propTypes = {
  data: PropTypes.array,
  loggedIn: PropTypes.bool,
};

CrowdTab.defaultProps = {
  data: [],
  loggedIn: false,
};

export default CrowdTab;
