import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "./Clause.js";

QUnit.module("Clause");

QUnit.test("create() boolean", (assert) => {
  // Setup.
  const itemKey = "red";
  const operatorKey = BooleanOp.IS_TRUE;

  // Run.
  const result = Clause.create({ itemKey, operatorKey });

  // Verify.
  assert.ok(result);
  assert.equal(result.itemKey, itemKey);
  assert.equal(result.operatorKey, operatorKey);
});

QUnit.test("create() number", (assert) => {
  // Setup.
  const itemKey = "red";
  const operatorKey = NumberOp.IS_GREATER_THAN;
  const rhs = 10;

  // Run.
  const result = Clause.create({ itemKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.itemKey, itemKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("create() string", (assert) => {
  // Setup.
  const itemKey = "name";
  const operatorKey = StringOp.CONTAINS;
  const rhs = "ed";

  // Run.
  const result = Clause.create({ itemKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.itemKey, itemKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("default()", (assert) => {
  // Setup.
  const key = "name";
  const type = "number";

  // Run.
  const result = Clause.default(key, type);

  // Verify.
  assert.ok(result);
  assert.equal(result.itemKey, key);
  assert.equal(result.operatorKey, NumberOp.IS);
  assert.equal(result.rhs, 0);
});

QUnit.test("isBooleanClause()", (assert) => {
  // Setup.
  const itemKey = "name";

  // Run / Verify.
  assert.equal(
    Clause.isBooleanClause(
      Clause.create({ itemKey, operatorKey: BooleanOp.IS_TRUE })
    ),
    true
  );
  assert.equal(
    Clause.isBooleanClause(
      Clause.create({ itemKey, operatorKey: BooleanOp.IS_FALSE })
    ),
    true
  );
});

QUnit.test("isBooleanClause() undefined", (assert) => {
  // Setup.

  // Run.
  const result = Clause.isBooleanClause(undefined);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isNumberClause()", (assert) => {
  // Setup.
  const itemKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(
    Clause.isNumberClause(
      Clause.create({ itemKey, operatorKey: NumberOp.IS, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isNumberClause(
      Clause.create({ itemKey, operatorKey: NumberOp.IS_NOT, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isNumberClause(
      Clause.create({ itemKey, operatorKey: NumberOp.IS_GREATER_THAN, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isNumberClause(
      Clause.create({ itemKey, operatorKey: NumberOp.IS_LESS_THAN, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isNumberClause(
      Clause.create({
        itemKey,
        operatorKey: NumberOp.IS_IN_THE_RANGE,
        rhs,
        rhs2: 10,
      })
    ),
    true
  );
});

QUnit.test("isNumberClause() undefined", (assert) => {
  // Setup.

  // Run.
  const result = Clause.isNumberClause(undefined);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isStringClause()", (assert) => {
  // Setup.
  const itemKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.CONTAINS, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.DOES_NOT_CONTAIN, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.IS, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.IS_NOT, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.BEGINS_WITH, rhs })
    ),
    true
  );
  assert.equal(
    Clause.isStringClause(
      Clause.create({ itemKey, operatorKey: StringOp.ENDS_WITH, rhs })
    ),
    true
  );
});

QUnit.test("isStringClause() undefined", (assert) => {
  // Setup.

  // Run.
  const result = Clause.isStringClause(undefined);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("passes() boolean", (assert) => {
  // Setup.
  const itemKey = "liked";
  const operatorKey = BooleanOp.IS_TRUE;
  const clause1 = Clause.create({ itemKey, operatorKey });
  const clause2 = Clause.create({ itemKey: "bogus", operatorKey });
  const clause3 = Clause.create({ itemKey, operatorKey: BooleanOp.IS_FALSE });
  const item = { liked: true };

  // Run / Verify.
  assert.equal(Clause.passes(clause1)(item), true, "clause1");
  assert.equal(Clause.passes(clause2)(item), false, "clause2");
  assert.equal(Clause.passes(clause3)(item), false, "clause3");
});

QUnit.test("passes() null", (assert) => {
  // Setup.
  const itemKey = "liked";
  const operatorKey = BooleanOp.IS_TRUE;
  const clause = Clause.create({ itemKey, operatorKey });
  const item = { liked: true };

  // Run / Verify.
  assert.equal(Clause.passes(null)(item), false, "clause1");
  assert.equal(Clause.passes(clause)(null), false, "clause2");
  assert.equal(Clause.passes(null)(null), false, "clause3");
});

QUnit.test("passes() number", (assert) => {
  // Setup.
  const itemKey = "red";
  const operatorKey = NumberOp.IS_GREATER_THAN;
  const rhs = 10;
  const clause1 = Clause.create({ itemKey, operatorKey, rhs });
  const clause2 = Clause.create({ itemKey: "bogus", operatorKey, rhs });
  const clause3 = Clause.create({
    itemKey,
    operatorKey: NumberOp.IS_LESS_THAN,
    rhs,
  });
  const clause4 = Clause.create({ itemKey, operatorKey, rhs: 4 });
  const clause5 = Clause.create({
    itemKey,
    operatorKey: NumberOp.IS_IN_THE_RANGE,
    rhs: 10,
    rhs2: 20,
  });
  const item = { red: 15 };

  // Run / Verify.
  assert.equal(Clause.passes(clause1)(item), true, "clause1");
  assert.equal(Clause.passes(clause2)(item), false, "clause2");
  assert.equal(Clause.passes(clause3)(item), false, "clause3");
  assert.equal(Clause.passes(clause4)(item), true, "clause4");
  assert.equal(Clause.passes(clause5)(item), true, "clause5");
});

QUnit.test("passes() string", (assert) => {
  // Setup.
  const itemKey = "name";
  const operatorKey = StringOp.CONTAINS;
  const rhs = "ed";
  const clause1 = Clause.create({ itemKey, operatorKey, rhs });
  const clause2 = Clause.create({ itemKey: "bogus", operatorKey, rhs });
  const clause3 = Clause.create({
    itemKey,
    operatorKey: StringOp.DOES_NOT_CONTAIN,
    rhs,
  });
  const clause4 = Clause.create({ itemKey, operatorKey, rhs: "Re" });
  const item = { name: "Red" };

  // Run / Verify.
  assert.equal(Clause.passes(clause1)(item), true, "clause1");
  assert.equal(Clause.passes(clause2)(item), false, "clause2");
  assert.equal(Clause.passes(clause3)(item), false, "clause3");
  assert.equal(Clause.passes(clause4)(item), true, "clause4");
});

const ClauseTest = {};
export default ClauseTest;
