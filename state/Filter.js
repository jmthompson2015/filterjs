import Clause from "./Clause.js";

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

export default Filter;
