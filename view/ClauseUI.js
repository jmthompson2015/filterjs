import ClauseType from "../artifact/ClauseType.js";
import NumberOp from "../artifact/NumberOperator.js";
import Resolver from "../artifact/Resolver.js";

import Clause from "../state/Clause.js";

import TCU from "./TableColumnUtilities.js";

const RU = ReactComponent.ReactUtilities;

const asNumber = (value) => (typeof value === "string" ? Number(value) : value);

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

const createBooleanClauseUI = (index) =>
  RU.createCell("", `rhsBooleanField${index}`);

const createNumberClauseUI = (
  clause,
  index,
  handleChange,
  className,
  min,
  max,
  step
) => {
  const idKey = `rhsField${index}`;
  const rhs = clause ? asNumber(clause.rhs) : undefined;

  if (clause.operatorKey === NumberOp.IS_IN_THE_RANGE) {
    const rhs2 = clause ? asNumber(clause.rhs2) : undefined;
    const cells = [
      RU.createCell(
        React.createElement(ReactComponent.NumberInput, {
          id: idKey,
          className,
          initialValue: rhs || 0,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs1NumberField1${index}`
      ),
      RU.createCell(
        ReactDOMFactories.span({ className: "ph1" }, "to"),
        `toField${index}`
      ),
      RU.createCell(
        React.createElement(ReactComponent.NumberInput, {
          id: `rhs2Field${index}`,
          className,
          initialValue: rhs2 || 0,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs2NumberField3${index}`
      ),
    ];
    const row = RU.createRow(cells, `toRow${index}`);
    const table = RU.createTable(row, `toTable${index}`);
    return RU.createCell(table, `toCell${index}`);
  }

  return RU.createCell(
    React.createElement(ReactComponent.NumberInput, {
      id: idKey,
      className,
      initialValue: rhs || 0,
      max,
      min,
      step,
      onBlur: handleChange,
    }),
    `rhsNumberField1${index}`
  );
};

const createStringClauseUI = (clause, index, handleChange, className) => {
  const idKey = `rhsField${index}`;
  return RU.createCell(
    React.createElement(ReactComponent.StringInput, {
      id: idKey,
      className,
      initialValue: clause ? clause.rhs : undefined,
      onBlur: handleChange,
    }),
    `rhsStringField1${index}`
  );
};

const createRemoveButton = (isRemoveDisabled, handleOnClick) =>
  ReactDOMFactories.button(
    { disabled: isRemoveDisabled, onClick: handleOnClick },
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

  createClauseUI(clause, index, min, max, step) {
    const { numberInputClass, stringInputClass } = this.props;
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
          this.handleChange,
          numberInputClass,
          min,
          max,
          step
        );
        break;
      case ClauseType.STRING:
        answer = createStringClauseUI(
          clause,
          index,
          this.handleChange,
          stringInputClass
        );
        break;
      default:
        throw new Error(
          `Unknown clause clauseTypeKey: ${clause.clauseTypeKey}`
        );
    }

    return answer;
  }

  render() {
    const {
      className,
      clause,
      index,
      isRemoveHidden,
      tableColumns,
    } = this.props;
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
    const clauseUI = this.createClauseUI(
      clause,
      index,
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

    return RU.createRow(cells, `${column.key}ClauseUI${index}`, className);
  }
}

ClauseUI.propTypes = {
  addOnClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  className: PropTypes.string,
  clause: PropTypes.shape(),
  index: PropTypes.number,
  isRemoveHidden: PropTypes.bool,
  numberInputClass: PropTypes.string,
  stringInputClass: PropTypes.string,
};

ClauseUI.defaultProps = {
  className: undefined,
  clause: undefined,
  index: undefined,
  isRemoveHidden: false,
  numberInputClass: "w3",
  stringInputClass: "w4",
};

export default ClauseUI;
