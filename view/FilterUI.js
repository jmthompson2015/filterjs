import Clause from "../state/Clause.js";
import Filter from "../state/Filter.js";

import ClauseUI from "./ClauseUI.js";

const RU = ReactComponent.ReactUtilities;

class FilterUI extends React.PureComponent {
  constructor(props) {
    super(props);

    const { filter, tableColumns } = this.props;
    const filter2 = filter || Filter.default(tableColumns);
    this.state = { filter: filter2 };

    this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
    this.handleNameChange = this.handleNameChangeFunction.bind(this);
    this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
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

    return RU.createTable(row, "buttonTable", "fjs-button-table fr");
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

    return RU.createTable(rows, "clauseTable");
  }

  render() {
    const { filter } = this.props;
    const nameInput = React.createElement(ReactComponent.StringInput, {
      initialValue: filter ? filter.name : "Filter",
      onBlur: this.handleNameChange,
    });
    const clauseTable = this.createClauseTable();
    const buttonTable = this.createButtonTable();

    const cell0 = RU.createCell(nameInput, "filterNameTable", "pb2");
    const cell1 = RU.createCell(clauseTable, "clauseTable");
    const cell2 = RU.createCell(buttonTable, "buttonTable", "button-panel pt2");

    const rows = [
      RU.createRow(cell0, "nameRow"),
      RU.createRow(cell1, "clausesRow"),
      RU.createRow(cell2, "buttonRow"),
    ];

    return RU.createTable(rows, "filterTable", "fjs-filter-ui");
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
