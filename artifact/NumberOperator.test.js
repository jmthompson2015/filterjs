import NumberOp from "./NumberOperator.js";

QUnit.module("NumberOperator");

QUnit.test("NumberOperator properties is", (assert) => {
  const operatorKey = NumberOp.IS;
  const properties = NumberOp.properties[operatorKey];
  assert.equal(properties.label, "is");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("NumberOperator properties is in the range", (assert) => {
  const operatorKey = NumberOp.IS_IN_THE_RANGE;
  const properties = NumberOp.properties[operatorKey];
  assert.equal(properties.label, "is in the range");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() IS", (assert) => {
  // Setup.
  const operatorKey = NumberOp.IS;
  const operator = NumberOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), false);
  assert.equal(operator.compareFunction(5, 5), true);
  assert.equal(operator.compareFunction(5, 6), false);
});

QUnit.test("compareFunction() IS_NOT", (assert) => {
  // Setup.
  const operatorKey = NumberOp.IS_NOT;
  const operator = NumberOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), true);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 6), true);
});

QUnit.test("compareFunction() IS_GREATER_THAN", (assert) => {
  // Setup.
  const operatorKey = NumberOp.IS_GREATER_THAN;
  const operator = NumberOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), false);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 4), true);
});

QUnit.test("compareFunction() IS_LESS_THAN", (assert) => {
  // Setup.
  const operatorKey = NumberOp.IS_LESS_THAN;
  const operator = NumberOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), true);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 6), true);
});

QUnit.test("compareFunction() IS_IN_THE_RANGE", (assert) => {
  // Setup.
  const operatorKey = NumberOp.IS_IN_THE_RANGE;
  const operator = NumberOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 0, 5), true);
  assert.equal(operator.compareFunction(5, 0, 5), true);
  assert.equal(operator.compareFunction(6, 0, 5), false);
});

QUnit.test("keys and values", (assert) => {
  // Setup.

  // Run.
  const result = NumberOp.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(NumberOp);

  // Verify.
  R.forEach((key) => {
    const key2 = NumberOp[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(NumberOp.properties[key2], `Missing value for key = ${key}`);
    }
  }, ownPropertyNames);

  R.forEach((value) => {
    const p = ownPropertyNames.filter((key) => NumberOp[key] === value);

    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  }, result);
});

QUnit.test("keys()", (assert) => {
  // Run.
  const result = NumberOp.keys();

  // Verify.
  assert.ok(result);
  const length = 5;
  assert.equal(result.length, length);
  assert.equal(R.head(result), NumberOp.IS);
  assert.equal(R.last(result), NumberOp.IS_IN_THE_RANGE);
});

QUnit.test("required properties", (assert) => {
  NumberOp.values().forEach((filter) => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const NumberOperatorTest = {};
export default NumberOperatorTest;
