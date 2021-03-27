class NumberInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initialValue } = this.props;
    this.state = { value: initialValue };

    this.handleBlur = this.handleBlurFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleBlurFunction() {
    const { onBlur } = this.props;
    const { value } = this.state;
    const myValue = Number(value);

    onBlur(myValue);
  }

  handleChangeFunction(event) {
    const { value } = event.target;
    const myValue = Number(value);

    this.setState({ value: myValue });
  }

  render() {
    const { className, id, initialValue, max, min, step } = this.props;

    return ReactDOMFactories.input({
      id,
      type: "number",
      className,
      defaultValue: initialValue,
      max,
      min,
      step,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
    });
  }
}

NumberInput.propTypes = {
  onBlur: PropTypes.func.isRequired,

  id: PropTypes.string,
  className: PropTypes.string,
  initialValue: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
};

NumberInput.defaultProps = {
  id: "numberInput",
  className: undefined,
  initialValue: 0,
  max: undefined,
  min: undefined,
  step: undefined,
};

export default NumberInput;
