import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "./Clause.js";
import Filter from "./Filter.js";
import FilterGroup from "./FilterGroup.js";

QUnit.module("FilterGroup");

const createFilter1 = () => {
  const name = "Filter 1";
  const clause1 = Clause.create({
    itemKey: "isLiked",
    operatorKey: BooleanOp.IS_TRUE,
  });
  const clause2 = Clause.create({
    itemKey: "red",
    operatorKey: NumberOp.IS_GREATER_THAN,
    rhs: 10,
  });
  const clause3 = Clause.create({
    itemKey: "name",
    operatorKey: StringOp.CONTAINS,
    rhs: "ed",
  });
  const clauses = [clause1, clause2, clause3];

  return Filter.create({ name, clauses });
};

const createFilter2 = () => {
  const name = "Filter 2";
  const clause1 = Clause.create({
    itemKey: "isLiked",
    operatorKey: BooleanOp.IS_FALSE,
  });
  const clause2 = Clause.create({
    itemKey: "red",
    operatorKey: NumberOp.IS_LESS_THAN,
    rhs: 10,
  });
  const clause3 = Clause.create({
    itemKey: "name",
    operatorKey: StringOp.DOES_NOT_CONTAIN,
    rhs: "ed",
  });
  const clauses = [clause1, clause2, clause3];

  return Filter.create({ name, clauses });
};

QUnit.test("create() 0", (assert) => {
  // Setup.
  const filters = [createFilter1(), createFilter2()];
  const selectedIndex = 0;

  // Run.
  const result = FilterGroup.create({ filters, selectedIndex });

  // Verify.
  assert.ok(result);
  assert.equal(result.selectedIndex, 0, `selectedIndex = ${selectedIndex}`);
  assert.equal(result.filters.length, 2, `filters.length = ${filters.length}`);

  const filterFirst = R.head(result.filters);
  assert.equal(filterFirst.name, "Filter 1");

  const filterLast = R.last(result.filters);
  assert.equal(filterLast.name, "Filter 2");
});

QUnit.test("create() 1", (assert) => {
  // Setup.
  const filters = [createFilter1(), createFilter2()];
  const selectedIndex = 1;

  // Run.
  const result = FilterGroup.create({ filters, selectedIndex });

  // Verify.
  assert.ok(result);
  assert.equal(result.selectedIndex, 1, `selectedIndex = ${selectedIndex}`);
  assert.equal(result.filters.length, 2, `filters.length = ${filters.length}`);

  const filterFirst = R.head(result.filters);
  assert.equal(filterFirst.name, "Filter 1");

  const filterLast = R.last(result.filters);
  assert.equal(filterLast.name, "Filter 2");
});

QUnit.test("create() 2", (assert) => {
  // Setup.
  const filters = [createFilter1(), createFilter2()];
  const selectedIndex = 2;

  // Run.
  const result = FilterGroup.create({ filters, selectedIndex });

  // Verify.
  assert.ok(result);
  assert.equal(result.selectedIndex, 0, `selectedIndex = ${selectedIndex}`);
  assert.equal(result.filters.length, 2, `filters.length = ${filters.length}`);

  const filterFirst = R.head(result.filters);
  assert.equal(filterFirst.name, "Filter 1");

  const filterLast = R.last(result.filters);
  assert.equal(filterLast.name, "Filter 2");
});

QUnit.test("create() null", (assert) => {
  // Setup.
  const filters = [createFilter1(), createFilter2()];
  const selectedIndex = null;

  // Run.
  const result = FilterGroup.create({ filters, selectedIndex });

  // Verify.
  assert.ok(result);
  assert.equal(result.selectedIndex, 0, `selectedIndex = ${selectedIndex}`);
  assert.equal(result.filters.length, 2, `filters.length = ${filters.length}`);

  const filterFirst = R.head(result.filters);
  assert.equal(filterFirst.name, "Filter 1");

  const filterLast = R.last(result.filters);
  assert.equal(filterLast.name, "Filter 2");
});

QUnit.test("default()", (assert) => {
  // Setup.
  const tableColumns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "red",
      label: "Red",
      type: "number",
    },
    {
      key: "green",
      label: "Green",
      type: "number",
    },
    {
      key: "blue",
      label: "Blue",
      type: "number",
    },
    {
      key: "liked",
      label: "Liked",
      type: "boolean",
    },
  ];

  // Run.
  const result = FilterGroup.default(tableColumns);

  // Verify.
  assert.ok(result);
  const { filters, selectedIndex } = result;
  assert.ok(filters);
  assert.equal(selectedIndex, 0, `selectedIndex = ${selectedIndex}`);
  assert.equal(filters.length, 1, `filters.length = ${filters.length}`);
  const filter = R.head(filters);
  assert.ok(filter);
  const { name, clauses } = filter;
  assert.ok(name);
  assert.equal(name, "Filter 1", `name = ${name}`);
  assert.ok(clauses);
  assert.equal(clauses.length, 1, `clauses.length = ${clauses.length}`);
});

const FilterGroupTest = {};
export default FilterGroupTest;
