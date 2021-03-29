import ClauseType from "../artifact/ClauseType.js";
import NumberOp from "../artifact/NumberOperator.js";
import Resolver from "../artifact/Resolver.js";

import Clause from "../state/Clause.js";

import TCU from "./TableColumnUtilities.js";

const RU = ReactComponent.ReactUtilities;

const asNumber = (value) => {
  if (typeof value === "string") {
    return Number(value);
  }
  return value;
};

const columnFor = (tableColumns, clause) => {
  const firstColumnKey = Object.values(tableColumns)[0].key;
  const itemKey = clause ? clause.itemKey || firstColumnKey : firstColumnKey;

  return TCU.tableColumn(tableColumns, itemKey);
};

const columnFromDocument = (tableColumns, index) => {
  const element = document.getElementById(`columnSelect${index}`);
  const itemKey = element.value;

  return TCU.tableColumn(tableColumns, itemKey);
};

const createAddButton = (handleOnClick) =>
  ReactDOMFactories.button({ onClick: handleOnClick }, "+");

const createColumnSelect = (
  tableColumns,
  clause,
  index,
  column,
  handleChange
) =>
  React.createElement(ReactComponent.Select, {
    id: `columnSelect${index}`,
    className: "fjs-select",
    values: tableColumns,
    initialValue: column.key,
    onChange: handleChange,
  });

const createEmptyCell = (key) => RU.createCell("", key);

const createOperatorSelect = (clause, index, column, handleChange) => {
  const operatorType = Resolver.operatorType(column.type);

  if (operatorType) {
    const operators = operatorType.values();

    return React.createElement(ReactComponent.Select, {
      id: `operatorSelect${index}`,
      className: "fjs-select",
      values: operators,
      initialValue: clause ? clause.operatorKey : undefined,
      onChange: handleChange,
    });
  }

  return null;
};

const createBooleanClauseUI = (index) => [
  createEmptyCell(`rhsBooleanField1${index}`),
  createEmptyCell(`rhsBooleanField2${index}`),
  createEmptyCell(`rhsBooleanField3${index}`),
];

const createNumberClauseUI = (clause, index, handleChange, min, max, step) => {
  const idKey = `rhsField${index}`;
  const rhs = clause ? asNumber(clause.rhs) : undefined;

  if (clause.operatorKey === NumberOp.IS_IN_THE_RANGE) {
    const rhs2 = clause ? asNumber(clause.rhs2) : undefined;
    return [
      RU.createCell(
        React.createElement(ReactComponent.NumberInput, {
          id: idKey,
          className: "fjs-number-input",
          initialValue: rhs || 0,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs1NumberField1${index}`
      ),
      RU.createCell(
        ReactDOMFactories.span(
          { style: { paddingLeft: 3, paddingRight: 3 } },
          "to"
        ),
        `toField${index}`
      ),
      RU.createCell(
        React.createElement(ReactComponent.NumberInput, {
          id: `rhs2Field${index}`,
          className: "fjs-number-input",
          initialValue: rhs2 || 0,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs2NumberField3${index}`
      ),
    ];
  }

  return [
    RU.createCell(
      React.createElement(ReactComponent.NumberInput, {
        id: idKey,
        className: "fjs-number-input",
        initialValue: rhs || 0,
        max,
        min,
        step,
        onBlur: handleChange,
      }),
      `rhsNumberField1${index}`
    ),
    createEmptyCell(`rhsNumberField2${index}`),
    createEmptyCell(`rhsNumberField3${index}`),
  ];
};

const createStringClauseUI = (clause, index, handleChange) => {
  const idKey = `rhsField${index}`;
  return [
    RU.createCell(
      React.createElement(ReactComponent.StringInput, {
        id: idKey,
        className: "fjs-string-input",
        initialValue: clause ? clause.rhs : undefined,
        onBlur: handleChange,
      }),
      `rhsStringField1${index}`
    ),
    createEmptyCell(`rhsStringField2${index}`),
    createEmptyCell(`rhsStringField3${index}`),
  ];
};

const createClauseUI = (clause, index, handleChange, min, max, step) => {
  let answer;
  const clauseTypeKey = Resolver.clauseTypeByOperator(clause.operatorKey);

  switch (clauseTypeKey) {
    case ClauseType.BOOLEAN:
      answer = createBooleanClauseUI(index);
      break;
    case ClauseType.NUMBER:
      answer = createNumberClauseUI(
        clause,
        index,
        handleChange,
        min,
        max,
        step
      );
      break;
    case ClauseType.STRING:
      answer = createStringClauseUI(clause, index, handleChange);
      break;
    default:
      throw new Error(`Unknown clause clauseTypeKey: ${clause.clauseTypeKey}`);
  }

  return answer;
};

const createRemoveButton = (isRemoveHidden, handleOnClick) =>
  ReactDOMFactories.button(
    { hidden: isRemoveHidden, onClick: handleOnClick },
    "-"
  );

const operatorKeyFromDocument = (column, index) => {
  const element = document.getElementById(`operatorSelect${index}`);
  const operatorKey = element.value;
  const operatorType = Resolver.operatorType(column.type);
  const operators = operatorType.values();
  const operatorKeys = operatorType.keys();

  return operatorKeys.includes(operatorKey) ? operatorKey : operators[0].key;
};

const rhsFromDocument = (index) => {
  const element = document.getElementById(`rhsField${index}`);

  return element ? element.value : undefined;
};

const rhs2FromDocument = (index) => {
  const element = document.getElementById(`rhs2Field${index}`);

  return element ? element.value : undefined;
};

class ClauseUI extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
    this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
  }

  handleAddOnClickFunction() {
    const { addOnClick, index } = this.props;
    addOnClick(index);
  }

  handleChangeFunction() {
    const { index, onChange, tableColumns } = this.props;
    const column = columnFromDocument(tableColumns, index);
    const operatorKey = operatorKeyFromDocument(column, index);
    const rhs = rhsFromDocument(index);
    const rhs2 = rhs2FromDocument(index);

    let newClause;

    switch (column.type) {
      case ClauseType.BOOLEAN:
        newClause = Clause.create({
          itemKey: column.key,
          operatorKey,
        });
        break;
      case ClauseType.NUMBER:
        newClause = Clause.create({
          itemKey: column.key,
          operatorKey,
          rhs: asNumber(rhs) || 0,
          rhs2: asNumber(rhs2),
        });
        break;
      case ClauseType.STRING:
      case undefined:
        newClause = Clause.create({
          itemKey: column.key,
          operatorKey,
          rhs: rhs || "",
        });
        break;
      default:
        throw new Error(`Unknown column.type: ${column.type}`);
    }

    onChange(newClause, index);
  }

  handleRemoveOnClickFunction() {
    const { removeOnClick, index } = this.props;
    removeOnClick(index);
  }

  render() {
    const { clause, index, isRemoveHidden, tableColumns } = this.props;
    const column = columnFor(tableColumns, clause);

    const columnSelect = RU.createCell(
      createColumnSelect(
        tableColumns,
        clause,
        index,
        column,
        this.handleChange
      ),
      `${column.key}ColumnSelectCell${index}`
    );
    const operatorSelect = RU.createCell(
      createOperatorSelect(clause, index, column, this.handleChange),
      `${column.key}OperatorSelectCell${index}`
    );
    const clauseUI = createClauseUI(
      clause,
      index,
      this.handleChange,
      column.min,
      column.max,
      column.step
    );
    const removeButton = RU.createCell(
      createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
      `removeButtonCell${index}`
    );
    const addButton = RU.createCell(
      createAddButton(this.handleAddOnClick),
      `addButtonCell${index}`
    );

    const cells = [
      columnSelect,
      operatorSelect,
      clauseUI,
      removeButton,
      addButton,
    ];

    return RU.createRow(
      cells,
      `${column.key}ClauseUI${index}`,
      "fjs-clause-ui"
    );
  }
}

ClauseUI.propTypes = {
  addOnClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  clause: PropTypes.shape(),
  index: PropTypes.number,
  isRemoveHidden: PropTypes.bool,
};

ClauseUI.defaultProps = {
  clause: undefined,
  index: undefined,
  isRemoveHidden: false,
};

export default ClauseUI;
