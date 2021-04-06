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

  /* eslint no-console: ["error", { allow: ["error"] }] */

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

    const value = StringOperator.toString(lhs);

    if (rhs.includes("|")) {
      const parts = rhs.split("|");
      const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
      return R.reduce(reduceFunction, false, parts);
    }

    return myFunction(value, rhs);
  };

  const containsCompareFunction = (lhs, rhs) =>
    myCompareFunction(lhs, rhs, (value, r) => {
      const vv = StringOperator.toString(value);
      const rr = StringOperator.toString(r);

      return vv ? vv.includes(rr) : false;
    });

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

  StringOperator.toString = (item) => {
    let answer = item;

    if (item) {
      if (Array.isArray(item)) {
        const stringArray = R.map(StringOperator.toString, item);
        answer = stringArray.join(" ");
      } else {
        const type = typeof item;

        switch (type) {
          case "object":
            answer = R.toLower(Object.values(item).join(" "));
            break;
          case "boolean":
            answer = `${item}`;
            break;
          case "number":
            answer = `${item}`;
            break;
          case "string":
            answer = R.toLower(item);
            break;
          default:
            console.error(`Unknown item: ${item} type: ${type}`);
        }
      }
    }

    return answer;
  };

  StringOperator.keys = () => Object.keys(StringOperator.properties);

  StringOperator.values = () => Object.values(StringOperator.properties);

  Object.freeze(StringOperator);

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

  Clause.default = (itemKey, clauseType) => {
    let answer;

    if (itemKey) {
      switch (clauseType) {
        case ClauseType.BOOLEAN:
          answer = Clause.create({
            itemKey,
            operatorKey: Object.keys(BooleanOperator.properties)[0],
          });
          break;
        case ClauseType.NUMBER:
          answer = Clause.create({
            itemKey,
            operatorKey: Object.keys(NumberOperator.properties)[0],
            rhs: 0,
          });
          break;
        case ClauseType.STRING:
        case undefined:
          answer = Clause.create({
            itemKey,
            operatorKey: Object.keys(StringOperator.properties)[0],
            rhs: "",
          });
          break;
        default:
          throw new Error(`Unknown clauseType: ${clauseType}`);
      }
    }

    return answer;
  };

  Clause.isBooleanClause = (clause) =>
    !R.isNil(clause) && BooleanOperator.keys().includes(clause.operatorKey);

  Clause.isNumberClause = (clause) =>
    !R.isNil(clause) && NumberOperator.keys().includes(clause.operatorKey);

  Clause.isStringClause = (clause) =>
    !R.isNil(clause) && StringOperator.keys().includes(clause.operatorKey);

  Clause.passes = (clause, item) => {
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

  Filter.default = (tableColumns, index = 1) => {
    const filterFunction = (column) =>
      [undefined, "true", true].includes(column.isShown);
    const myTableColumns = R.filter(filterFunction, tableColumns);
    const tableColumn =
      myTableColumns && myTableColumns.length > 0 ? myTableColumns[0] : undefined;
    const clause = Clause.default(tableColumn.key, tableColumn.type);
    const clauses = clause ? [clause] : [];

    return Filter.create({ name: `Filter ${index}`, clauses });
  };

  Filter.passes = (filter, item) => {
    if (filter && item) {
      const reduceFunction = (accum, clause) =>
        accum && Clause.passes(clause, item);

      return R.reduce(reduceFunction, true, filter.clauses);
    }

    return false;
  };

  Object.freeze(Filter);

  const FilterGroup = {};

  FilterGroup.create = ({ filters = [], selectedIndex }) => {
    let index = 0;

    if (
      Number.isInteger(selectedIndex) &&
      selectedIndex >= 0 &&
      selectedIndex < filters.length
    ) {
      index = selectedIndex;
    }

    return Immutable({ filters, selectedIndex: index });
  };

  FilterGroup.default = (tableColumns) => {
    const filter = Filter.default(tableColumns);
    const filters = [filter];

    return FilterGroup.create({ filters });
  };

  FilterGroup.selectedFilter = (filterGroup) => {
    let answer;

    if (filterGroup) {
      const { filters, selectedIndex } = filterGroup;
      answer = filters[selectedIndex];
    }

    return answer;
  };

  Object.freeze(FilterGroup);

  const TableColumnUtilities = {};

  TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
    const columns = R.filter((c) => c.key === columnKey, tableColumns);

    return columns.length > 0 ? columns[0] : undefined;
  };

  Object.freeze(TableColumnUtilities);

  const RU$2 = ReactComponent.ReactUtilities;

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
    React.createElement(ReactComponent.Select, {
      id: `columnSelect${index}`,
      className: "fjs-select",
      values: tableColumns,
      initialValue: column.key,
      onChange: handleChange,
    });

  const createEmptyCell = (key) => RU$2.createCell("", key);

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

    if (clause.operatorKey === NumberOperator.IS_IN_THE_RANGE) {
      const rhs2 = clause ? asNumber(clause.rhs2) : undefined;
      return [
        RU$2.createCell(
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
        RU$2.createCell(
          ReactDOMFactories.span(
            { style: { paddingLeft: 3, paddingRight: 3 } },
            "to"
          ),
          `toField${index}`
        ),
        RU$2.createCell(
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
      RU$2.createCell(
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
      RU$2.createCell(
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

    render() {
      const { clause, index, isRemoveHidden, tableColumns } = this.props;
      const column = columnFor(tableColumns, clause);

      const columnSelect = RU$2.createCell(
        createColumnSelect(
          tableColumns,
          clause,
          index,
          column,
          this.handleChange
        ),
        `${column.key}ColumnSelectCell${index}`
      );
      const operatorSelect = RU$2.createCell(
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
      const removeButton = RU$2.createCell(
        createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
        `removeButtonCell${index}`
      );
      const addButton = RU$2.createCell(
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

      return RU$2.createRow(
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

  const RU$1 = ReactComponent.ReactUtilities;

  class FilterUI extends React.PureComponent {
    constructor(props) {
      super(props);

      const { filter, tableColumns } = this.props;
      const filter2 = filter || Filter.default(tableColumns);
      this.state = { filter: filter2, isApplied: false };

      this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
      this.handleFilterOnClick = this.handleFilterOnClickFunction.bind(this);
      this.handleNameChange = this.handleNameChangeFunction.bind(this);
      this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
      this.handleUnfilterOnClick = this.handleUnfilterOnClickFunction.bind(this);
    }

    handleAddOnClickFunction(index) {
      const { onChange, tableColumns } = this.props;
      const { filter } = this.state;
      const firstColumn = tableColumns[0];
      const newClause = Clause.default(firstColumn.key, firstColumn.type);

      if (newClause) {
        const newClauses = R.insert(index + 1, newClause, filter.clauses);
        const newFilter = Filter.create({
          name: filter.name,
          clauses: newClauses,
        });
        this.setState({ filter: newFilter });
        onChange(newFilter);
      }
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

    handleFilterOnClickFunction() {
      const { applyOnClick } = this.props;
      this.setState({ isApplied: true });
      applyOnClick();
    }

    handleNameChangeFunction(newName) {
      const { onChange } = this.props;
      const { filter } = this.state;
      const newFilter = Filter.create({
        name: newName,
        clauses: filter.clauses,
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

    handleUnfilterOnClickFunction() {
      const { removeOnClick } = this.props;
      this.setState({ isApplied: false });
      removeOnClick();
    }

    createButtonTable() {
      const { isApplied } = this.state;

      const unfilterButton = ReactDOMFactories.button(
        { onClick: this.handleUnfilterOnClick, disabled: !isApplied },
        "Remove"
      );
      const filterButton = ReactDOMFactories.button(
        { onClick: this.handleFilterOnClick, disabled: isApplied },
        "Apply"
      );

      const cells = [
        RU$1.createCell(unfilterButton, "unfilterButton", "button"),
        RU$1.createCell(filterButton, "filterButton", "button"),
      ];
      const row = RU$1.createRow(cells, "button-row");

      return RU$1.createTable(row, "buttonTable", "fjs-button-table fr");
    }

    createClauseTable() {
      const rows = [];

      const { tableColumns } = this.props;
      const { filter } = this.state;
      const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;
      const filter2 = filter || Filter.default(tableColumns);
      const clauses2 = R.concat([], filter2.clauses);

      if (clauses2.length === 0) {
        const firstColumn = tableColumns[0];
        const newClause = Clause.default(firstColumn.key, firstColumn.type);

        if (newClause) {
          clauses2.push(newClause);
        }
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

      return RU$1.createTable(rows, "clauseTable");
    }

    render() {
      const { filter } = this.props;
      const nameInput = React.createElement(ReactComponent.StringInput, {
        initialValue: filter ? filter.name : "Filter",
        onBlur: this.handleNameChange,
      });
      const clauseTable = this.createClauseTable();
      const buttonTable = this.createButtonTable();

      const cell0 = RU$1.createCell(nameInput, "filterNameTable", "pb2");
      const cell1 = RU$1.createCell(clauseTable, "clauseTable");
      const cell2 = RU$1.createCell(buttonTable, "buttonTable", "button-panel pt2");

      const rows = [
        RU$1.createRow(cell0, "nameRow"),
        RU$1.createRow(cell1, "clausesRow"),
        RU$1.createRow(cell2, "buttonRow"),
      ];

      return RU$1.createTable(rows, "filterTable", "fjs-filter-ui");
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

  const RU = ReactComponent.ReactUtilities;

  const mapIndexed = R.addIndex(R.map);
  const reduceIndexed = R.addIndex(R.reduce);

  const remove = (index, filters) => {
    const reduceFunction = (accum, filter, i) =>
      i === index ? accum : R.append(filter, accum);

    return reduceIndexed(reduceFunction, [], filters);
  };

  const replace = (index, newFilter, filters) => {
    const mapFunction = (filter, i) => (i === index ? newFilter : filter);

    return mapIndexed(mapFunction, filters);
  };

  class FilterGroupUI extends React.PureComponent {
    constructor(props) {
      super(props);

      const { initialFilterGroup } = this.props;
      this.state = { filterGroup: initialFilterGroup };

      this.handleDeleteOnClick = this.handleDeleteOnClickFunction.bind(this);
      this.handleFilterChange = this.handleFilterChangeFunction.bind(this);
      this.handleFiltersChange = this.handleFiltersChangeFunction.bind(this);
      this.handleMoveDownOnClick = this.handleMoveDownOnClickFunction.bind(this);
      this.handleMoveUpOnClick = this.handleMoveUpOnClickFunction.bind(this);
      this.handleNewOnClick = this.handleNewOnClickFunction.bind(this);
    }

    handleFilterChangeFunction(filter) {
      const { onChange } = this.props;
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const newFilters = replace(selectedIndex, filter, filters);
      const newFilterGroup = FilterGroup.create({
        filters: newFilters,
        selectedIndex,
      });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    handleFiltersChangeFunction(selected) {
      const { onChange } = this.props;
      const { filterGroup } = this.state;
      const { filters } = filterGroup;
      const filterNames = R.map(R.prop("name"), filters);
      const selectedIndex = filterNames.indexOf(selected);
      const newFilterGroup = FilterGroup.create({ filters, selectedIndex });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    handleDeleteOnClickFunction() {
      const { onChange } = this.props;
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const newFilters = remove(selectedIndex, filters);
      const newIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
      const newFilterGroup = FilterGroup.create({
        filters: newFilters,
        selectedIndex: newIndex,
      });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    handleMoveDownOnClickFunction() {
      const { onChange } = this.props;
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const newIndex = selectedIndex + 1;
      // Must have a mutable copy of filters.
      const newFilters = R.move(selectedIndex, newIndex, R.concat([], filters));
      const newFilterGroup = FilterGroup.create({
        filters: newFilters,
        selectedIndex: newIndex,
      });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    handleMoveUpOnClickFunction() {
      const { onChange } = this.props;
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const newIndex = selectedIndex - 1;
      // Must have a mutable copy of filters.
      const newFilters = R.move(selectedIndex, newIndex, R.concat([], filters));
      const newFilterGroup = FilterGroup.create({
        filters: newFilters,
        selectedIndex: newIndex,
      });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    handleNewOnClickFunction() {
      const { onChange, tableColumns } = this.props;
      const { filterGroup } = this.state;
      const { filters } = filterGroup;
      const selectedIndex = filters.length;
      const filter = Filter.default(tableColumns, selectedIndex + 1);
      const newFilters = R.append(filter, filters);
      const newFilterGroup = FilterGroup.create({
        filters: newFilters,
        selectedIndex,
      });
      this.setState({ filterGroup: newFilterGroup });
      onChange(newFilterGroup);
    }

    createButtonTable() {
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const moveDownDisabled = selectedIndex >= filters.length - 1;
      const moveDownFilterButton = ReactDOMFactories.button(
        { onClick: this.handleMoveDownOnClick, disabled: moveDownDisabled },
        "\u21E9"
      );
      const moveUpDisabled = selectedIndex < 1;
      const moveUpFilterButton = ReactDOMFactories.button(
        { onClick: this.handleMoveUpOnClick, disabled: moveUpDisabled },
        "\u21E7"
      );
      const deleteDisabled = filters.length <= 1;
      const deleteFilterButton = ReactDOMFactories.button(
        { onClick: this.handleDeleteOnClick, disabled: deleteDisabled },
        "-"
      );
      const newFilterButton = ReactDOMFactories.button(
        { onClick: this.handleNewOnClick },
        "+"
      );

      const cells = [
        RU.createCell(moveDownFilterButton, "moveDownFilterButton", "button"),
        RU.createCell(moveUpFilterButton, "moveUpFilterButton", "button"),
        RU.createCell(deleteFilterButton, "deleteFilterButton", "button"),
        RU.createCell(newFilterButton, "newFilterButton", "button"),
      ];
      const row = RU.createRow(cells, "button-row");

      return RU.createTable(row, "buttonTable", "fjs-button-table");
    }

    createFiltersList() {
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const filter = filters[selectedIndex];
      const size = Math.max(2 + filter.clauses.length, 5);
      const filterName = filter.name;
      const reduceFunction = (accum, name) =>
        R.append({ key: name, label: name }, accum);
      const filterNames = R.map(R.prop("name"), filters);
      const values = R.reduce(reduceFunction, [], filterNames);

      return React.createElement(ReactComponent.Select, {
        key: `${size}${JSON.stringify(filter)}`,
        attributes: { size },
        initialValue: filterName,
        onChange: this.handleFiltersChange,
        values,
      });
    }

    createFiltersTable() {
      const filtersList = this.createFiltersList();
      const buttonTable = this.createButtonTable();

      const cell0 = RU.createCell(filtersList, "filtersList");
      const cell1 = RU.createCell(buttonTable, "buttonTable", "pt2");

      const rows = [
        RU.createRow(cell0, "filtersListRow"),
        RU.createRow(cell1, "buttonTableRow"),
      ];

      return RU.createTable(rows, "filtersTable", "fjs-filters-table");
    }

    createFilterUI() {
      const { applyOnClick, removeOnClick, tableColumns } = this.props;
      const { filterGroup } = this.state;
      const { filters, selectedIndex } = filterGroup;
      const filter = filters.length > 0 ? filters[selectedIndex] : undefined;

      return React.createElement(FilterUI, {
        key: JSON.stringify(filter.clauses),
        applyOnClick,
        filter,
        onChange: this.handleFilterChange,
        removeOnClick,
        tableColumns,
      });
    }

    render() {
      const filtersTable = this.createFiltersTable();
      const filterUI = this.createFilterUI();

      const cells = [
        RU.createCell(filtersTable, "filtersTable", "pr2 v-top"),
        RU.createCell(filterUI, "filterUI", "v-top"),
      ];

      const row = RU.createRow(cells, "filtersTableRow");

      return RU.createTable(row, "filtersTable", "fjs-filters-ui f6");
    }
  }

  FilterGroupUI.propTypes = {
    applyOnClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    removeOnClick: PropTypes.func.isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

    initialFilterGroup: PropTypes.shape(),
  };

  FilterGroupUI.defaultProps = {
    initialFilterGroup: [],
  };

  class FilterJS {}

  FilterJS.BooleanOperator = BooleanOperator;
  FilterJS.ClauseType = ClauseType;
  FilterJS.NumberOperator = NumberOperator;
  FilterJS.StringOperator = StringOperator;

  FilterJS.Clause = Clause;
  FilterJS.Filter = Filter;
  FilterJS.FilterGroup = FilterGroup;

  FilterJS.FilterUI = FilterUI;
  FilterJS.FilterGroupUI = FilterGroupUI;

  return FilterJS;

})));
