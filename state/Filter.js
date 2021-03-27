import Clause from "./Clause.js";

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

export default Filter;
