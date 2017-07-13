import React, { PropTypes } from 'react';
import { Button, Table } from 'react-bootstrap';

class CrowdTab extends React.Component {
  constructor(props) {
    super(props);
    this.rowIsUpdating = this.rowIsUpdating.bind(this);
    this.rowIsRemoved = this.rowIsRemoved.bind(this);
    this.onAnnotationUpdateSubmit = this.onAnnotationUpdateSubmit.bind(this);
    this.onAnnotationDelete = this.onAnnotationDelete.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.createAnnotation = this.createAnnotation.bind(this);
    this.annotationRefs = {};
    this.updateableRows = {};
    this.updateRowData = {};
    this.removedRows = {};
  }

  onAnnotationUpdateSubmit(key) {
    if (this.props.loggedIn) {
      if (this.rowIsUpdating(key)) {
        this.props.onAnnotationUpdate(this.props.nctId, key, this.updateRowData[key].description);
      }
      this.updateableRows[key] = !this.updateableRows[key];
      this.forceUpdate();
    } else {
      this.props.onAnonymousClick();
    }
  }

  onAnnotationDelete(key) {
    if (this.props.loggedIn) {
      this.removedRows[key] = true;
      this.props.onAnnotationRemove(this.props.nctId, key);
    } else {
      this.props.onAnonymousClick();
    }
  }

  onDescriptionChange(e, key) {
    this.updateRowData[key] = this.updateRowData[key] || {};
    this.updateRowData[key].description = e.target.value;
  }

  addAnnotation() {
    if (this.props.loggedIn) {
      this.isAddingAnnotation = true;
      this.forceUpdate();
    } else {
      this.props.onAnonymousClick();
    }
  }

  createAnnotation() {
    this.props.onAnnotationCreate(this.props.nctId, this.newLabel, this.newDescription);
    this.newLabel = '';
    this.newDescription = '';
    this.isAddingAnnotation = false;
  }

  rowIsUpdating(key) {
    return this.updateableRows[key];
  }

  rowIsRemoved(key) {
    return this.removedRows && this.removedRows[key];
  }

  render() {
    if (!this.props.data) {
      return null;
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
          {Object.keys(this.props.data).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{this.rowIsUpdating(key) ?
                <textarea
                  style={{ width: '100%', border: '1px solid #ccc' }}
                  type="text"
                  defaultValue={this.props.data[key]}
                  onChange={(e) => this.onDescriptionChange(e, key)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 27) {
                      this.updateableRows[key] = false;
                      this.forceUpdate();
                    }
                  }}
                />
                : this.props.data[key]}
              </td>
              <td>
                <Button onClick={() => this.onAnnotationUpdateSubmit(key)}>
                  { this.updateableRows[key] ?
                    'Submit' :
                    'Update'
                  }
                </Button>
              </td>
              <td>
                <Button onClick={() => this.onAnnotationDelete(key)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {this.isAddingAnnotation ?
            <tr>
              <td>
                <input
                  style={{ width: '100%', border: '1px solid #ccc' }}
                  placeholder="Add a label..."
                  onChange={(e) => { this.newLabel = e.target.value; }}
                />
              </td>
              <td>
                <textarea
                  style={{ width: '100%', border: '1px solid #ccc' }}
                  placeholder="Add a description..."
                  onChange={(e) => { this.newDescription = e.target.value; }}
                />
              </td>
              <td colSpan={2} className="text-right">
                <Button onClick={this.createAnnotation}>
                  Submit
                </Button>
              </td>
            </tr>
            :
            <tr>
              <td colSpan={4} className="text-right">
                <Button onClick={this.addAnnotation}>
                  Add
                </Button>
              </td>
            </tr>}
        </tbody>
      </Table>
    );
  }
}

CrowdTab.propTypes = {
  nctId: PropTypes.string,
  data: PropTypes.object,
  loggedIn: PropTypes.bool,
  onAnonymousClick: PropTypes.func.isRequired,
  onAnnotationCreate: PropTypes.func.isRequired,
  onAnnotationRemove: PropTypes.func.isRequired,
  onAnnotationUpdate: PropTypes.func.isRequired,
};

CrowdTab.defaultProps = {
  data: [],
  loggedIn: false,
};

export default CrowdTab;
