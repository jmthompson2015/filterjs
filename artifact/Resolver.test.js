import BooleanOp from "./BooleanOperator.js";
import ClauseType from "./ClauseType.js";
import NumberOp from "./NumberOperator.js";
import Resolver from "./Resolver.js";
import StringOp from "./StringOperator.js";

QUnit.module("Resolver");

QUnit.test("booleanOperator()", (assert) => {
  assert.equal(Resolver.booleanOperator(BooleanOp.IS_TRUE).label, "is true");
  assert.equal(Resolver.booleanOperator(BooleanOp.IS_FALSE).label, "is false");
  assert.equal(Resolver.booleanOperator(undefined), null);
  assert.equal(Resolver.booleanOperator(null), null);
});

QUnit.test("clauseType()", (assert) => {
  assert.equal(Resolver.clauseType(ClauseType.BOOLEAN).name, "Boolean");
  assert.equal(Resolver.clauseType(ClauseType.NUMBER).name, "Number");
  assert.equal(Resolver.clauseType(ClauseType.STRING).name, "String");
  assert.equal(Resolver.clauseType(undefined), null);
  assert.equal(Resolver.clauseType(null), null);
});

QUnit.test("clauseTypeByOperator()", (assert) => {
  assert.equal(
    Resolver.clauseTypeByOperator(BooleanOp.IS_TRUE),
    ClauseType.BOOLEAN
  );
  assert.equal(Resolver.clauseTypeByOperator(NumberOp.IS), ClauseType.NUMBER);
  assert.equal(
    Resolver.clauseTypeByOperator(StringOp.CONTAINS),
    ClauseType.STRING
  );
  assert.equal(Resolver.clauseTypeByOperator(undefined), ClauseType.STRING);
  assert.equal(Resolver.clauseTypeByOperator(null), ClauseType.STRING);
});

QUnit.test("numberOperator()", (assert) => {
  assert.equal(Resolver.numberOperator(NumberOp.IS).label, "is");
  assert.equal(
    Resolver.numberOperator(NumberOp.IS_IN_THE_RANGE).label,
    "is in the range"
  );
  assert.equal(Resolver.numberOperator(undefined), null);
  assert.equal(Resolver.numberOperator(null), null);
});

QUnit.test("operator()", (assert) => {
  assert.equal(Resolver.booleanOperator(BooleanOp.IS_TRUE).label, "is true");
  assert.equal(Resolver.booleanOperator(BooleanOp.IS_FALSE).label, "is false");
  assert.equal(Resolver.numberOperator(NumberOp.IS).label, "is");
  assert.equal(
    Resolver.numberOperator(NumberOp.IS_IN_THE_RANGE).label,
    "is in the range"
  );
  assert.equal(Resolver.operator(StringOp.CONTAINS).label, "contains");
  assert.equal(Resolver.operator(StringOp.ENDS_WITH).label, "ends with");
  assert.equal(Resolver.operator(undefined), null);
  assert.equal(Resolver.operator(null), null);
});

QUnit.test("operatorType()", (assert) => {
  assert.equal(Resolver.operatorType(ClauseType.BOOLEAN), BooleanOp);
  assert.equal(Resolver.operatorType(ClauseType.NUMBER), NumberOp);
  assert.equal(Resolver.operatorType(ClauseType.STRING), StringOp);
  assert.equal(Resolver.operatorType(undefined), StringOp);
  assert.equal(Resolver.operatorType(null), StringOp);
});

QUnit.test("stringOperator()", (assert) => {
  assert.equal(Resolver.stringOperator(StringOp.CONTAINS).label, "contains");
  assert.equal(Resolver.stringOperator(StringOp.ENDS_WITH).label, "ends with");
  assert.equal(Resolver.stringOperator(undefined), null);
  assert.equal(Resolver.stringOperator(null), null);
});

const ResolverTest = {};
export default ResolverTest;
