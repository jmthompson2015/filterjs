(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FilterJS = factory());
}(this, (function () { 'use strict';

  const BooleanOperator = {
    IS_TRUE: "boIsTrue",
    IS_FALSE: "boIsFalse",
  };

  BooleanOperator.properties = {
    boIsTrue: {
      label: "is true",
      compareFunction: (lhs) => lhs === true,
      key: "boIsTrue",
    },
    boIsFalse: {
      label: "is false",
      compareFunction: (lhs) => lhs === false,
      key: "boIsFalse",
    },
  };

  BooleanOperator.keys = () => Object.keys(BooleanOperator.properties);

  BooleanOperator.values = () => Object.values(BooleanOperator.properties);

  Object.freeze(BooleanOperator);

  const NumberOperator = {
    IS: "noIs",
    IS_NOT: "noIsNot",
    IS_GREATER_THAN: "noIsGreaterThan",
    IS_LESS_THAN: "noIsLessThan",
    IS_IN_THE_RANGE: "noIsInTheRange",
  };

  NumberOperator.properties = {
    noIs: {
      label: "is",
      compareFunction: (lhs, rhs) => lhs === rhs,
      key: "noIs",
    },
    noIsNot: {
      label: "is not",
      compareFunction: (lhs, rhs) => lhs !== rhs,
      key: "noIsNot",
    },
    noIsGreaterThan: {
      label: "is greater than",
      compareFunction: (lhs, rhs) => lhs > rhs,
      key: "noIsGreaterThan",
    },
    noIsLessThan: {
      label: "is less than",
      compareFunction: (lhs, rhs) => lhs < rhs,
      key: "noIsLessThan",
    },
    noIsInTheRange: {
      label: "is in the range",
      compareFunction: (lhs, min, max) => min <= lhs && lhs <= max,
      key: "noIsInTheRange",
    },
  };

  NumberOperator.keys = () => Object.keys(NumberOperator.properties);

  NumberOperator.values = () => Object.values(NumberOperator.properties);

  Object.freeze(NumberOperator);

  const StringOperator = {
    CONTAINS: "soContains",
    DOES_NOT_CONTAIN: "soDoesNotContain",
    IS: "soIs",
    IS_NOT: "soIsNot",
    BEGINS_WITH: "soBeginsWith",
    ENDS_WITH: "soEndsWith",
  };

  const myCompareFunction = (lhs, rhs, myFunction) => {
    if (R.isNil(lhs) || R.isNil(rhs)) return false;

    const value = Array.isArray(lhs) ? lhs.join(" ") : lhs;

    if (rhs.includes("|")) {
      const parts = rhs.split("|");
      const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
      return R.reduce(reduceFunction, false, parts);
    }

    return myFunction(value, rhs);
  };

  const containsCompareFunction = (lhs, rhs) =>
    myCompareFunction(lhs, rhs, (value, r) =>
      R.toLower(value).includes(R.toLower(r))
    );

  const isCompareFunction = (lhs, rhs) =>
    myCompareFunction(lhs, rhs, (value, r) => value === r);

  StringOperator.properties = {
    soContains: {
      label: "contains",
      compareFunction: containsCompareFunction,
      key: "soContains",
    },
    soDoesNotContain: {
      label: "does not contain",
      compareFunction: (lhs, rhs) => !containsCompareFunction(lhs, rhs),
      key: "soDoesNotContain",
    },
    soIs: {
      label: "is",
      compareFunction: isCompareFunction,
      key: "soIs",
    },
    soIsNot: {
      label: "is not",
      compareFunction: (lhs, rhs) => !isCompareFunction(lhs, rhs),
      key: "soIsNot",
    },
    soBeginsWith: {
      label: "begins with",
      compareFunction: (lhs, rhs) =>
        myCompareFunction(lhs, rhs, (value, r) => value.startsWith(r)),
      key: "soBeginsWith",
    },
    soEndsWith: {
      label: "ends with",
      compareFunction: (lhs, rhs) =>
        myCompareFunction(lhs, rhs, (value, r) => value.endsWith(r)),
      key: "soEndsWith",
    },
  };

  StringOperator.keys = () => Object.keys(StringOperator.properties);

  StringOperator.values = () => Object.values(StringOperator.properties);

  Object.freeze(StringOperator);

  const ClauseType = {
    BOOLEAN: "boolean",
    NUMBER: "number",
    STRING: "string",
  };

  ClauseType.properties = {
    boolean: {
      name: "Boolean",
      key: "boolean",
    },
    number: {
      name: "Number",
      key: "number",
    },
    string: {
      name: "String",
      key: "string",
    },
  };

  ClauseType.keys = () => Object.keys(ClauseType.properties);

  ClauseType.values = () => Object.values(ClauseType.properties);

  Object.freeze(ClauseType);

  const Resolver = {};

  Resolver.booleanOperator = (operatorKey) => BooleanOperator.properties[operatorKey];

  Resolver.clauseType = (typeKey) => ClauseType.properties[typeKey];

  Resolver.clauseTypeByOperator = (operatorKey) => {
    let answer = ClauseType.STRING;

    if (Resolver.booleanOperator(operatorKey)) {
      answer = ClauseType.BOOLEAN;
    } else if (Resolver.numberOperator(operatorKey)) {
      answer = ClauseType.NUMBER;
    }

    return answer;
  };

  Resolver.compareFunction = (operatorKey) =>
    Resolver.operator(operatorKey).compareFunction;

  Resolver.numberOperator = (operatorKey) => NumberOperator.properties[operatorKey];

  Resolver.operator = (operatorKey) =>
    Resolver.booleanOperator(operatorKey) ||
    Resolver.numberOperator(operatorKey) ||
    Resolver.stringOperator(operatorKey);

  Resolver.operatorType = (clauseTypeKey) => {
    let answer = StringOperator;

    if (clauseTypeKey) {
      switch (clauseTypeKey) {
        case ClauseType.BOOLEAN:
          answer = BooleanOperator;
          break;
        case ClauseType.NUMBER:
          answer = NumberOperator;
          break;
        case ClauseType.STRING:
        default:
          answer = StringOperator;
      }
    }

    return answer;
  };

  Resolver.stringOperator = (operatorKey) => StringOperator.properties[operatorKey];

  Object.freeze(Resolver);

  const Clause = {};

  Clause.create = ({ itemKey, operatorKey, rhs, rhs2 }) =>
    Immutable({
      itemKey,
      operatorKey,
      rhs,
      rhs2,
    });

  Clause.isBooleanClause = (clause) =>
    !R.isNil(clause) && BooleanOperator.keys().includes(clause.operatorKey);

  Clause.isNumberClause = (clause) =>
    !R.isNil(clause) && NumberOperator.keys().includes(clause.operatorKey);

  Clause.isStringClause = (clause) =>
    !R.isNil(clause) && StringOperator.keys().includes(clause.operatorKey);

  Clause.passes = (clause) => (item) => {
    if (clause && item) {
      const compare = Resolver.compareFunction(clause.operatorKey);

      if (compare) {
        const value = item[clause.itemKey];

        return compare(value, clause.rhs, clause.rhs2);
      }
    }

    return false;
  };

  Object.freeze(Clause);

  const Filter = {};

  Filter.create = ({ name = "Filter", clauses = [] }) =>
    Immutable({ name, clauses });

  Filter.passes = (filter) => (item) => {
    if (filter && item) {
      const reduceFunction = (accum, clause) =>
        accum && Clause.passes(clause)(item);

      return R.reduce(reduceFunction, true, filter.clauses);
    }

    return false;
  };

  Object.freeze(Filter);

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

  const ReactUtilities = {};

  ReactUtilities.createCell = (element, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table-cell",
      },
    });

    return ReactDOMFactories.div(newProps, element);
  };

  ReactUtilities.createRow = (cells, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table-row",
      },
    });

    return ReactDOMFactories.div(newProps, cells);
  };

  ReactUtilities.createTable = (rows, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table",
      },
    });

    return ReactDOMFactories.div(newProps, rows);
  };

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

  class StringInput extends React.PureComponent {
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

      onBlur(value);
    }

    handleChangeFunction(event) {
      const { value } = event.target;

      this.setState({ value });
    }

    render() {
      const { className, id, initialValue } = this.props;

      return ReactDOMFactories.input({
        id,
        type: "text",
        className,
        defaultValue: initialValue,
        onBlur: this.handleBlur,
        onChange: this.handleChange,
      });
    }
  }

  StringInput.propTypes = {
    onBlur: PropTypes.func.isRequired,

    id: PropTypes.string,
    className: PropTypes.string,
    initialValue: PropTypes.string,
  };

  StringInput.defaultProps = {
    id: "stringInput",
    className: undefined,
    initialValue: "",
  };

  const TableColumnUtilities = {};

  TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
    const columns = R.filter((c) => c.key === columnKey, tableColumns);

    return columns.length > 0 ? columns[0] : undefined;
  };

  Object.freeze(TableColumnUtilities);

  const asNumber = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };

  const columnFor = (tableColumns, clause) => {
    const firstColumnKey = Object.values(tableColumns)[0].key;
    const itemKey = clause ? clause.itemKey || firstColumnKey : firstColumnKey;

    return TableColumnUtilities.tableColumn(tableColumns, itemKey);
  };

  const columnFromDocument = (tableColumns, index) => {
    const element = document.getElementById(`columnSelect${index}`);
    const itemKey = element.value;

    return TableColumnUtilities.tableColumn(tableColumns, itemKey);
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
    React.createElement(Select, {
      id: `columnSelect${index}`,
      values: tableColumns,
      initialValue: column.key,
      onChange: handleChange,
    });

  const createEmptyCell = (key) => ReactUtilities.createCell("", key);

  const createOperatorSelect = (clause, index, column, handleChange) => {
    const operatorType = Resolver.operatorType(column.type);

    if (operatorType) {
      const operators = operatorType.values();

      return React.createElement(Select, {
        id: `operatorSelect${index}`,
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
    if (clause.operatorKey === NumberOperator.IS_IN_THE_RANGE) {
      const rhs2 = clause ? asNumber(clause.rhs2) : undefined;
      return [
        ReactUtilities.createCell(
          React.createElement(NumberInput, {
            id: idKey,
            className: "field",
            initialValue: rhs || 0,
            max,
            min,
            step,
            onBlur: handleChange,
          }),
          `rhs1NumberField1${index}`
        ),
        ReactUtilities.createCell(
          ReactDOMFactories.span(
            { style: { paddingLeft: 3, paddingRight: 3 } },
            "to"
          ),
          `toField${index}`
        ),
        ReactUtilities.createCell(
          React.createElement(NumberInput, {
            id: `rhs2Field${index}`,
            className: "field",
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
      ReactUtilities.createCell(
        React.createElement(NumberInput, {
          id: idKey,
          className: "field",
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
      ReactUtilities.createCell(
        React.createElement(StringInput, {
          id: idKey,
          className: "field",
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

      const columnSelect = ReactUtilities.createCell(
        createColumnSelect(
          tableColumns,
          clause,
          index,
          column,
          this.handleChange
        ),
        `${column.key}ColumnSelectCell${index}`
      );
      const operatorSelect = ReactUtilities.createCell(
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
      const removeButton = ReactUtilities.createCell(
        createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
        `removeButtonCell${index}`
      );
      const addButton = ReactUtilities.createCell(
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

      return ReactUtilities.createRow(
        cells,
        `${column.key}ClauseUI${index}`,
        "fjs-clause-row"
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

  const defaultClause = (tableColumn) => {
    let answer;

    if (tableColumn) {
      switch (tableColumn.type) {
        case ClauseType.BOOLEAN:
          answer = Clause.create({
            itemKey: tableColumn.key,
            operatorKey: Object.keys(BooleanOperator.properties)[0],
          });
          break;
        case ClauseType.NUMBER:
          answer = Clause.create({
            itemKey: tableColumn.key,
            operatorKey: Object.keys(NumberOperator.properties)[0],
            rhs: 0,
          });
          break;
        case ClauseType.STRING:
        case undefined:
          answer = Clause.create({
            itemKey: tableColumn.key,
            operatorKey: Object.keys(StringOperator.properties)[0],
            rhs: "",
          });
          break;
        default:
          throw new Error(`Unknown tableColumn.type: ${tableColumn.type}`);
      }
    }

    return answer;
  };

  const defaultFilter = (tableColumns) => {
    const filterFunction = (column) =>
      [undefined, "true", true].includes(column.isShown);
    const myTableColumns = R.filter(filterFunction, tableColumns);
    const tableColumn =
      myTableColumns && myTableColumns.length > 0 ? myTableColumns[0] : undefined;
    const clauses = [defaultClause(tableColumn)];

    return Filter.create({ name: "Filter 1", clauses });
  };

  class FilterUI extends React.PureComponent {
    constructor(props) {
      super(props);

      const { filter, tableColumns } = this.props;
      const filter2 = filter || defaultFilter(tableColumns);
      this.state = { filter: filter2 };

      this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
      this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
    }

    handleAddOnClickFunction(index) {
      const { onChange, tableColumns } = this.props;
      const { filter } = this.state;
      const firstColumn = tableColumns[0];
      const newClause = defaultClause(firstColumn);
      const newClauses = R.insert(index + 1, newClause, filter.clauses);
      const newFilter = Filter.create({
        name: filter.name,
        clauses: newClauses,
      });
      this.setState({ filter: newFilter });
      onChange(newFilter);
    }

    handleChangeFunction(newClause, index) {
      const { onChange } = this.props;
      const { filter } = this.state;
      const newClauses = R.update(index, newClause, filter.clauses);
      const newFilter = Filter.create({
        name: filter.name,
        clauses: newClauses,
      });
      this.setState({ filter: newFilter });
      onChange(newFilter);
    }

    handleRemoveOnClickFunction(index) {
      const { onChange } = this.props;
      const { filter } = this.state;
      const newClauses = R.remove(index, 1, filter.clauses);
      const newFilter = Filter.create({
        name: filter.name,
        clauses: newClauses,
      });
      this.setState({ filter: newFilter });
      onChange(newFilter);
    }

    createButtonTable() {
      const { applyOnClick, removeOnClick } = this.props;

      const unfilterButton = ReactDOMFactories.button(
        { onClick: removeOnClick },
        "Remove"
      );
      const filterButton = ReactDOMFactories.button(
        { onClick: applyOnClick },
        "Apply"
      );

      const cells = [
        ReactUtilities.createCell(unfilterButton, "unfilterButton", "button"),
        ReactUtilities.createCell(filterButton, "filterButton", "button"),
      ];
      const row = ReactUtilities.createRow(cells, "button-row");

      return ReactUtilities.createTable(row, "buttonTable", "buttons");
    }

    createTable() {
      const rows = [];

      const { tableColumns } = this.props;
      const { filter } = this.state;
      const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;
      const filter2 = filter || defaultFilter(tableColumns);
      const clauses2 = R.concat([], filter2.clauses);

      if (clauses2.length === 0) {
        const firstColumn = tableColumns[0];
        const newClause = defaultClause(firstColumn);
        clauses2.push(newClause);
      }

      for (let i = 0; i < clauses2.length; i += 1) {
        const clause = clauses2[i];
        const isRemoveHidden = clauses2.length === 1 && i === 0;
        const row = React.createElement(ClauseUI, {
          key: `ClauseUI${i}`,
          clause,
          index: i,
          isRemoveHidden,
          tableColumns,
          onChange: handleChange,
          addOnClick: handleAddOnClick,
          removeOnClick: handleRemoveOnClick,
        });
        rows.push(row);
      }

      return ReactUtilities.createTable(rows, "filterTable");
    }

    render() {
      const filterTable = ReactUtilities.createCell(
        this.createTable(),
        "filterTable",
        "inner-table"
      );
      const rows0 = ReactUtilities.createRow(filterTable, "filterTableCells");
      const table0 = ReactUtilities.createTable(rows0, "filterTableRow");
      const cell0 = ReactUtilities.createCell(table0, "filterTable");
      const cell1 = ReactUtilities.createCell(
        this.createButtonTable(),
        "buttonTable",
        "button-panel"
      );

      const rows = [
        ReactUtilities.createRow(cell0, "filterTablesRow"),
        ReactUtilities.createRow(cell1, "buttonRow"),
      ];

      return ReactUtilities.createTable(rows, "filterTable", "fjs-filter");
    }
  }

  FilterUI.propTypes = {
    applyOnClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    removeOnClick: PropTypes.func.isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

    filter: PropTypes.shape(),
  };

  FilterUI.defaultProps = {
    filter: undefined,
  };

  class FilterJS {}

  FilterJS.BooleanOperator = BooleanOperator;
  FilterJS.NumberOperator = NumberOperator;
  FilterJS.StringOperator = StringOperator;

  FilterJS.Clause = Clause;
  FilterJS.Filter = Filter;

  FilterJS.FilterUI = FilterUI;

  return FilterJS;

})));
