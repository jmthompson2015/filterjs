import StringOp from "./StringOperator.js";

QUnit.module("StringOperator");

QUnit.test("StringOperator properties contains", (assert) => {
  const operatorKey = StringOp.CONTAINS;
  const properties = StringOp.properties[operatorKey];
  assert.equal(properties.label, "contains");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("StringOperator properties ends with", (assert) => {
  const operatorKey = StringOp.ENDS_WITH;
  const properties = StringOp.properties[operatorKey];
  assert.equal(properties.label, "ends with");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() CONTAINS", (assert) => {
  // Setup.
  const operatorKey = StringOp.CONTAINS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), true);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() CONTAINS array", (assert) => {
  // Setup.
  const operatorKey = StringOp.CONTAINS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(operator.compareFunction(["test", "something"], "th"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() CONTAINS array of maps", (assert) => {
  // Setup.
  const operatorKey = StringOp.CONTAINS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(
    operator.compareFunction(
      [
        { key: "test", value: "something" },
        { key: "red", value: 255 },
      ],
      "test"
    ),
    true
  );
  assert.equal(
    operator.compareFunction([{ key: "test", value: "something" }], "th"),
    true
  );
  assert.equal(
    operator.compareFunction([{ key: "test", value: "something" }], "vi"),
    false
  );
});

QUnit.test("compareFunction() CONTAINS or", (assert) => {
  // Setup.
  const operatorKey = StringOp.CONTAINS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test something", "test | duh"), true);
  assert.equal(operator.compareFunction("test something", "th | duh"), true);
  assert.equal(operator.compareFunction("test something", "vi | duh"), false);
  assert.equal(operator.compareFunction("test something", "duh | test"), true);
  assert.equal(operator.compareFunction("test something", "duh | th"), true);
  assert.equal(operator.compareFunction("test something", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
  assert.equal(operator.compareFunction("test something", undefined), false);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN", (assert) => {
  // Setup.
  const operatorKey = StringOp.DOES_NOT_CONTAIN;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), false);
  assert.equal(operator.compareFunction("test", "test"), false);
  assert.equal(operator.compareFunction("test", "vi"), true);
  assert.equal(operator.compareFunction(undefined, "vi"), true);
  assert.equal(operator.compareFunction("test", undefined), true);
  assert.equal(operator.compareFunction("test", ""), false);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN array", (assert) => {
  // Setup.
  const operatorKey = StringOp.DOES_NOT_CONTAIN;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(operator.compareFunction(["test", "something"], "th"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), true);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN or", (assert) => {
  // Setup.
  const operatorKey = StringOp.DOES_NOT_CONTAIN;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test something", "test | duh"), false);
  assert.equal(operator.compareFunction("test something", "th | duh"), false);
  assert.equal(operator.compareFunction("test something", "vi | duh"), true);
  assert.equal(operator.compareFunction("test something", "duh | test"), false);
  assert.equal(operator.compareFunction("test something", "duh | th"), false);
  assert.equal(operator.compareFunction("test something", "duh | vi"), true);
});

QUnit.test("compareFunction() IS", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test"), false);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "violet"), false);
  assert.equal(operator.compareFunction(undefined, "violet"), false);
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), false);
});

QUnit.test("compareFunction() IS array", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(
    operator.compareFunction(["test", "something"], "test something"),
    true
  );
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(
    operator.compareFunction(["test", "something"], "something"),
    false
  );
  assert.equal(operator.compareFunction(["test", "something"], "te"), false);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() IS or", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test | duh"), false);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "violet | duh"), false);
  assert.equal(operator.compareFunction(undefined, "violet | duh"), false);
  assert.equal(operator.compareFunction("store", "duh | test"), false);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | violet"), false);
  assert.equal(operator.compareFunction(undefined, "duh | violet"), false);
});

QUnit.test("compareFunction() IS_NOT", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS_NOT;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test"), true);
  assert.equal(operator.compareFunction("test", "test"), false);
  assert.equal(operator.compareFunction("test", "violet"), true);
  assert.equal(operator.compareFunction(undefined, "violet"), true);
  assert.equal(operator.compareFunction("test", undefined), true);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() IS_NOT array", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS_NOT;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(
    operator.compareFunction(["test", "something"], "test something"),
    false
  );
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(
    operator.compareFunction(["test", "something"], "something"),
    true
  );
  assert.equal(operator.compareFunction(["test", "something"], "te"), true);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), true);
});

QUnit.test("compareFunction() IS_NOT or", (assert) => {
  // Setup.
  const operatorKey = StringOp.IS_NOT;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "test | duh"), false);
  assert.equal(operator.compareFunction("test", "violet | duh"), true);
  assert.equal(operator.compareFunction(undefined, "violet | duh"), true);
  assert.equal(operator.compareFunction("store", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | test"), false);
  assert.equal(operator.compareFunction("test", "duh | violet"), true);
  assert.equal(operator.compareFunction(undefined, "duh | violet"), true);
});

QUnit.test("compareFunction() BEGINS_WITH", (assert) => {
  // Setup.
  const operatorKey = StringOp.BEGINS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), false);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() BEGINS_WITH array", (assert) => {
  // Setup.
  const operatorKey = StringOp.BEGINS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(
    operator.compareFunction(["test", "something"], "something"),
    false
  );
  assert.equal(operator.compareFunction(["test", "something"], "te"), true);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() BEGINS_WITH or", (assert) => {
  // Setup.
  const operatorKey = StringOp.BEGINS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st | duh"), false);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "vi | duh"), false);
  assert.equal(operator.compareFunction(undefined, "vi | duh"), false);
  assert.equal(operator.compareFunction("test", "duh | st"), false);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
});

QUnit.test("compareFunction() ENDS_WITH", (assert) => {
  // Setup.
  const operatorKey = StringOp.ENDS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), true);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() ENDS_WITH array", (assert) => {
  // Setup.
  const operatorKey = StringOp.ENDS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(
    operator.compareFunction(["test", "something"], "something"),
    true
  );
  assert.equal(operator.compareFunction(["test", "something"], "te"), false);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() ENDS_WITH or", (assert) => {
  // Setup.
  const operatorKey = StringOp.ENDS_WITH;
  const operator = StringOp.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st | duh"), true);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "vi | duh"), false);
  assert.equal(operator.compareFunction(undefined, "vi | duh"), false);
  assert.equal(operator.compareFunction("test", "duh | st"), true);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
});

QUnit.test("toString()", (assert) => {
  // Setup.

  // Run / Verify.
  assert.equal(StringOp.toString(undefined), undefined);
  assert.equal(StringOp.toString(null), null);
  assert.equal(StringOp.toString(true), "true");
  assert.equal(StringOp.toString(1234), "1234");
  assert.equal(StringOp.toString("Herman"), "herman");
  assert.equal(StringOp.toString([1, 2, 3, 4]), "1 2 3 4");
  assert.equal(StringOp.toString({ one: 1, two: 2, three: 3 }), "1 2 3");
  assert.equal(
    StringOp.toString([{ key: "Test", value: "Something" }]),
    "test something"
  );
  assert.equal(
    StringOp.toString([
      { key: "test", value: "Something" },
      { key: "red", value: 255 },
    ]),
    "test something red 255"
  );
});

QUnit.test("keys and values", (assert) => {
  // Setup.

  // Run.
  const result = StringOp.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(StringOp);

  // Verify.
  R.forEach((key) => {
    const key2 = StringOp[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(StringOp.properties[key2], `Missing value for key = ${key}`);
    }
  }, ownPropertyNames);

  R.forEach((value) => {
    const p = ownPropertyNames.filter((key) => StringOp[key] === value);

    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  }, result);
});

QUnit.test("keys()", (assert) => {
  // Run.
  const result = StringOp.keys();

  // Verify.
  assert.ok(result);
  const length = 6;
  assert.equal(result.length, length);
  assert.equal(R.head(result), StringOp.CONTAINS);
  assert.equal(R.last(result), StringOp.ENDS_WITH);
});

QUnit.test("required properties", (assert) => {
  StringOp.values().forEach((filter) => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const StringOperatorTest = {};
export default StringOperatorTest;
