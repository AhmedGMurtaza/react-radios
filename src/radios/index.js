// @flow
import React, { Component, type ElementRef } from 'react';
import { Container, Provider, Subscribe } from 'unstated';

// Container
// ------------------------------

type State = { value: string };

export default class RadioContainer extends Container<State> {
  constructor(props) {
    super(props);

    this.consumerOnChange = props.onChange;

    this.state = { name: props.name, value: props.value };
  }

  onChange = event => {
    const { value } = event.target;

    this.setState({ value });

    if (this.consumerOnChange) this.consumerOnChange(value);
  };
}

// Group
// ------------------------------

type RadioGroupProps = { children: Node };
export const RadioGroup = ({ children, ...props }: RadioGroupProps) => {
  const container = new RadioContainer(props);
  return <Provider inject={[container]}>{children}</Provider>;
};

// Radio
// ------------------------------

type RadioProps = { Component: any, innerRef?: ElementRef<*> };
export class Radio extends Component<RadioProps> {
  static defaultProps = {
    Component: 'input',
  };
  render() {
    const { Component, innerRef, ...props } = this.props;

    return (
      <Subscribe to={[RadioContainer]}>
        {({ onChange, state }) => {
          const checked = state.value === props.value;
          const name = props.name || state.name;

          return (
            <Component
              {...props}
              checked={checked}
              name={name}
              onChange={onChange}
              ref={innerRef}
              type="radio"
            />
          );
        }}
      </Subscribe>
    );
  }
}