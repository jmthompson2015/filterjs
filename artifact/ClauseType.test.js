import ClauseType from "./ClauseType.js";

QUnit.module("ClauseType");

QUnit.test("ClauseType properties BOOLEAN", (assert) => {
  const typeKey = ClauseType.BOOLEAN;
  const properties = ClauseType.properties[typeKey];
  assert.equal(properties.name, "Boolean");
  assert.equal(properties.key, typeKey);
});

QUnit.test("keys and values", (assert) => {
  // Setup.

  // Run.
  const result = ClauseType.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(ClauseType);

  // Verify.
  R.forEach((key) => {
    const key2 = ClauseType[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(ClauseType.properties[key2], `Missing value for key = ${key}`);
    }
  }, ownPropertyNames);

  R.forEach((value) => {
    const p = ownPropertyNames.filter((key) => ClauseType[key] === value);

    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  }, result);
});

QUnit.test("keys()", (assert) => {
  // Run.
  const result = ClauseType.keys();

  // Verify.
  assert.ok(result);
  const length = 3;
  assert.equal(result.length, length);
  assert.equal(R.head(result), ClauseType.BOOLEAN);
  assert.equal(R.last(result), ClauseType.STRING);
});

QUnit.test("required properties", (assert) => {
  ClauseType.values().forEach((filter) => {
    assert.ok(filter.name, `Missing name for ${filter.key}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const ClauseTypeTest = {};
export default ClauseTypeTest;
