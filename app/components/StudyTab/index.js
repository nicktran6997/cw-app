import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

const StudyTab = (props) => (
  !props.data ? null :
  <Table striped bordered condensed>
    <tbody>
      {props.data.map((item) => (
        <tr key={item.label}>
          <td><b>{item.label}</b></td>
          <td>{item.value}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

StudyTab.propTypes = {
  data: PropTypes.array,
};

export default StudyTab;
