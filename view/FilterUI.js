import BooleanOp from "../artifact/BooleanOperator.js";
import ClauseType from "../artifact/ClauseType.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "../state/Clause.js";
import Filter from "../state/Filter.js";

import ClauseUI from "./ClauseUI.js";
import RU from "./ReactUtilities.js";

const defaultClause = (tableColumn) => {
  let answer;

  if (tableColumn) {
    switch (tableColumn.type) {
      case ClauseType.BOOLEAN:
        answer = Clause.create({
          itemKey: tableColumn.key,
          operatorKey: Object.keys(BooleanOp.properties)[0],
        });
        break;
      case ClauseType.NUMBER:
        answer = Clause.create({
          itemKey: tableColumn.key,
          operatorKey: Object.keys(NumberOp.properties)[0],
          rhs: 0,
        });
        break;
      case ClauseType.STRING:
      case undefined:
        answer = Clause.create({
          itemKey: tableColumn.key,
          operatorKey: Object.keys(StringOp.properties)[0],
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
      RU.createCell(unfilterButton, "unfilterButton", "button"),
      RU.createCell(filterButton, "filterButton", "button"),
    ];
    const row = RU.createRow(cells, "button-row");

    return RU.createTable(row, "buttonTable", "buttons");
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

    return RU.createTable(rows, "filterTable");
  }

  render() {
    const filterTable = RU.createCell(
      this.createTable(),
      "filterTable",
      "inner-table"
    );
    const rows0 = RU.createRow(filterTable, "filterTableCells");
    const table0 = RU.createTable(rows0, "filterTableRow");
    const cell0 = RU.createCell(table0, "filterTable");
    const cell1 = RU.createCell(
      this.createButtonTable(),
      "buttonTable",
      "button-panel"
    );

    const rows = [
      RU.createRow(cell0, "filterTablesRow"),
      RU.createRow(cell1, "buttonRow"),
    ];

    return RU.createTable(rows, "filterTable", "fjs-filter");
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

export default FilterUI;
