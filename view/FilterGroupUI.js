import Filter from "../state/Filter.js";
import FilterGroup from "../state/FilterGroup.js";

import FilterUI from "./FilterUI.js";

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
      RU.createCell(moveDownFilterButton, "moveDownFilterButton"),
      RU.createCell(moveUpFilterButton, "moveUpFilterButton"),
      RU.createCell(deleteFilterButton, "deleteFilterButton"),
      RU.createCell(newFilterButton, "newFilterButton"),
    ];
    const row = RU.createRow(cells, "button-row");

    return RU.createTable(row, "buttonTable");
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

    return RU.createTable(rows, "filtersTable");
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
    const { className, filterEditorClass, filtersListClass } = this.props;
    const filtersTable = this.createFiltersTable();
    const filterUI = this.createFilterUI();

    const cells = [
      RU.createCell(filtersTable, "filtersTable", filtersListClass),
      RU.createCell(filterUI, "filterUI", filterEditorClass),
    ];

    const row = RU.createRow(cells, "filtersTableRow");

    return RU.createTable(row, "filtersTable", className);
  }
}

FilterGroupUI.propTypes = {
  applyOnClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  className: PropTypes.string,
  filterEditorClass: PropTypes.string,
  filtersListClass: PropTypes.string,
  initialFilterGroup: PropTypes.shape(),
};

FilterGroupUI.defaultProps = {
  className: undefined,
  filterEditorClass: "v-top",
  filtersListClass: "pr2 v-top",
  initialFilterGroup: [],
};

export default FilterGroupUI;
