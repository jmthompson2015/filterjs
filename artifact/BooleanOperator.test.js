import BooleanOp from "./BooleanOperator.js";

QUnit.module("BooleanOperator");

QUnit.test("BooleanOperator properties IS_TRUE", (assert) => {
  const operatorKey = BooleanOp.IS_TRUE;
  const properties = BooleanOp.properties[operatorKey];
  assert.equal(properties.label, "is true");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() IS_TRUE", (assert) => {
  // Setup.
  const operatorKey = BooleanOp.IS_TRUE;
  const operator = BooleanOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(true), true);
  assert.equal(operator.compareFunction(false), false);
  assert.equal(operator.compareFunction(undefined), false);
});

QUnit.test("compareFunction() IS_FALSE", (assert) => {
  // Setup.
  const operatorKey = BooleanOp.IS_FALSE;
  const operator = BooleanOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(true), false);
  assert.equal(operator.compareFunction(false), true);
  assert.equal(operator.compareFunction(undefined), false);
});

QUnit.test("keys and values", (assert) => {
  // Setup.

  // Run.
  const result = BooleanOp.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(BooleanOp);

  // Verify.
  R.forEach((key) => {
    const key2 = BooleanOp[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(BooleanOp.properties[key2], `Missing value for key = ${key}`);
    }
  }, ownPropertyNames);

  R.forEach((value) => {
    const p = ownPropertyNames.filter((key) => BooleanOp[key] === value);

    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  }, result);
});

QUnit.test("keys()", (assert) => {
  // Run.
  const result = BooleanOp.keys();

  // Verify.
  assert.ok(result);
  const length = 2;
  assert.equal(result.length, length);
  assert.equal(R.head(result), BooleanOp.IS_TRUE);
  assert.equal(R.last(result), BooleanOp.IS_FALSE);
});

QUnit.test("required properties", (assert) => {
  BooleanOp.values().forEach((filter) => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const BooleanOperatorTest = {};
export default BooleanOperatorTest;
