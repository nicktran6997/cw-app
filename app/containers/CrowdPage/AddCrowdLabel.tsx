import * as React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import ButtonCell from './ButtonCell';

interface AddCrowdLabelProps {
  onAddLabel: (key: string, value: string) => void;
  // pass not null to this prop if you want to toggle add mode with this key
  forceAddKey?: string | null;
}

interface AddCrowdLabelState {
  inAddMode: boolean;
  key: string;
  value: string;
  prevForceKey: string | null;
}

const defaultState = {
  inAddMode: false,
  key: '',
  value: '',
  prevForceKey: null,
};

const StyleWrapper = styled.tr`
  input,
  textarea {
    width: '100%';
    border: '1px solid #ccc';
  }
`;

class AddCrowdLabel extends React.Component<
  AddCrowdLabelProps,
  AddCrowdLabelState
> {
  state: AddCrowdLabelState = defaultState;

  static getDerivedStateFromProps = (
    props: AddCrowdLabelProps,
    state: AddCrowdLabelState,
  ) => {
    const { forceAddKey: key } = props;
    if (key && state.prevForceKey !== props.forceAddKey) {
      return {
        ...state,
        key,
        inAddMode: true,
        value: defaultState.value,
        prevForceKey: key,
      };
    }

    return { ...state, prevForceKey: props.forceAddKey };
  };

  handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ key: e.currentTarget.value });
  };

  handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  handleSubmit = () => {
    this.props.onAddLabel(this.state.key, this.state.value);
    this.setState(defaultState);
  };

  handleAddClick = () => {
    this.setState({ inAddMode: true });
  };

  render() {
    return (
      <StyleWrapper>
        <td style={{ verticalAlign: 'middle' }}>
          {this.state.inAddMode && (
            <FormControl
              type="text"
              placeholder="Add a label"
              value={this.state.key}
              onChange={this.handleKeyChange}
            />
          )}
        </td>
        <td style={{ borderRight: 'none' }}>
          {this.state.inAddMode && (
            <FormControl
              componentClass="textarea"
              placeholder="Add a description"
              value={this.state.value}
              onChange={this.handleValueChange}
            />
          )}
        </td>
        <ButtonCell>
          <div />
        </ButtonCell>
        <ButtonCell>
          <div />
        </ButtonCell>
        <ButtonCell>
          <div>
            {this.state.inAddMode && (
              <Button onClick={this.handleSubmit}>Submit</Button>
            )}
            {!this.state.inAddMode && (
              <Button onClick={this.handleAddClick}>Add</Button>
            )}
          </div>
        </ButtonCell>
      </StyleWrapper>
    );
  }
}

export default AddCrowdLabel;