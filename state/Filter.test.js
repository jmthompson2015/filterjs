import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "./Clause.js";
import Filter from "./Filter.js";

QUnit.module("Filter");

QUnit.test("create()", (assert) => {
  // Setup.
  const name = "Filter 1";
  const clause1 = Clause.create({
    itemKey: "red",
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

  // Run.
  const result = Filter.create({ name, clauses });

  // Verify.
  assert.ok(result);
  assert.equal(result.name, name);
  assert.equal(result.clauses.length, 3);

  const clause0 = R.head(result.clauses);
  assert.equal(clause0.itemKey, "red");
  assert.equal(clause0.operatorKey, BooleanOp.IS_TRUE);

  const clauseLast = R.last(result.clauses);
  assert.equal(clauseLast.itemKey, "name");
  assert.equal(clauseLast.operatorKey, StringOp.CONTAINS);
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
  const result = Filter.default(tableColumns);

  // Verify.
  assert.ok(result);
  const { name, clauses } = result;
  assert.ok(name);
  assert.equal(name, "Filter 1", `name = ${name}`);
  assert.ok(clauses);
  assert.equal(clauses.length, 1, `clauses.length = ${clauses.length}`);
});

QUnit.test("passes() 1", (assert) => {
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
  const result = Filter.default(tableColumns);

  // Verify.
  assert.ok(result);
  assert.equal(result.name, "Filter 1");

  const clause0 = R.head(result.clauses);
  assert.ok(clause0, `clause0 = ${clause0}`);
  assert.equal(clause0.itemKey, "name");
  assert.equal(clause0.operatorKey, StringOp.CONTAINS);

  const clauseLast = R.last(result.clauses);
  assert.ok(clause0, `clauseLast = ${clauseLast}`);
  assert.equal(clauseLast.itemKey, "name");
  assert.equal(clauseLast.operatorKey, StringOp.CONTAINS);
});

QUnit.test("passes() 2", (assert) => {
  // Setup.
  const filter1 = Clause.create({
    itemKey: "red",
    operatorKey: NumberOp.IS_GREATER_THAN,
    rhs: 127,
  });
  const filter2 = Clause.create({
    itemKey: "name",
    operatorKey: StringOp.CONTAINS,
    rhs: "e",
  });
  const clauses = [filter1, filter2];
  const filter = Filter.create({ name: "Filter 1", clauses });

  const item1 = {
    name: "Red",
    red: 255,
    green: 0,
    blue: 0,
    category: "Primary",
  };
  const item2 = {
    name: "Green",
    red: 0,
    green: 255,
    blue: 0,
    category: "Primary",
  };
  const item3 = {
    name: "Blue",
    red: 0,
    green: 0,
    blue: 255,
    category: "Primary",
  };
  const item4 = {
    name: "Yellow",
    red: 255,
    green: 255,
    blue: 0,
    category: "Secondary",
  };
  const item5 = {
    name: "Magenta",
    red: 255,
    green: 0,
    blue: 255,
    category: "Secondary",
  };
  const item6 = {
    name: "Cyan",
    red: 0,
    green: 255,
    blue: 255,
    category: "Secondary",
  };

  // Run / Verify.
  assert.equal(Filter.passes(filter, item1), true);
  assert.equal(Filter.passes(filter, item2), false);
  assert.equal(Filter.passes(filter, item3), false);
  assert.equal(Filter.passes(filter, item4), true);
  assert.equal(Filter.passes(filter, item5), true);
  assert.equal(Filter.passes(filter, item6), false);
});

QUnit.test("passes() null", (assert) => {
  // Setup.
  const filter1 = Clause.create({
    itemKey: "red",
    operatorKey: NumberOp.IS_GREATER_THAN,
    rhs: 127,
  });
  const filter2 = Clause.create({
    itemKey: "name",
    operatorKey: StringOp.CONTAINS,
    rhs: "e",
  });
  const clauses = [filter1, filter2];
  const filter = Filter.create({ name: "Filter 1", clauses });

  const item1 = {
    name: "Red",
    red: 255,
    green: 0,
    blue: 0,
    category: "Primary",
  };

  // Run / Verify.
  assert.equal(Filter.passes(null, item1), false);
  assert.equal(Filter.passes(filter, null), false);
  assert.equal(Filter.passes(null, null), false);
});

const FilterTest = {};
export default FilterTest;
