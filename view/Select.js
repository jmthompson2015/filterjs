const createOption = (key, label) =>
  ReactDOMFactories.option({ key, value: key }, label);

class Select extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleChangeFunction() {
    const { id, onChange } = this.props;
    const valueSelect = document.getElementById(id);
    const selected = valueSelect.options[valueSelect.selectedIndex].value;
    onChange(selected);
  }

  render() {
    const { id, values, initialValue } = this.props;
    const options = R.map(
      (value) => createOption(value.key, value.label),
      values
    );

    return ReactDOMFactories.select(
      { id, defaultValue: initialValue, onChange: this.handleChange },
      options
    );
  }
}

Select.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,

  id: PropTypes.string,
  initialValue: PropTypes.string,
};

Select.defaultProps = {
  id: "select",
  initialValue: undefined,
};

export default Select;
