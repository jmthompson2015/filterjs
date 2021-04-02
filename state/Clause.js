import BooleanOp from "../artifact/BooleanOperator.js";
import ClauseType from "../artifact/ClauseType.js";
import NumberOp from "../artifact/NumberOperator.js";
import Resolver from "../artifact/Resolver.js";
import StringOp from "../artifact/StringOperator.js";

const Clause = {};

Clause.create = ({ itemKey, operatorKey, rhs, rhs2 }) =>
  Immutable({
    itemKey,
    operatorKey,
    rhs,
    rhs2,
  });

Clause.default = (itemKey, clauseType) => {
  let answer;

  if (itemKey) {
    switch (clauseType) {
      case ClauseType.BOOLEAN:
        answer = Clause.create({
          itemKey,
          operatorKey: Object.keys(BooleanOp.properties)[0],
        });
        break;
      case ClauseType.NUMBER:
        answer = Clause.create({
          itemKey,
          operatorKey: Object.keys(NumberOp.properties)[0],
          rhs: 0,
        });
        break;
      case ClauseType.STRING:
      case undefined:
        answer = Clause.create({
          itemKey,
          operatorKey: Object.keys(StringOp.properties)[0],
          rhs: "",
        });
        break;
      default:
        throw new Error(`Unknown clauseType: ${clauseType}`);
    }
  }

  return answer;
};

Clause.isBooleanClause = (clause) =>
  !R.isNil(clause) && BooleanOp.keys().includes(clause.operatorKey);

Clause.isNumberClause = (clause) =>
  !R.isNil(clause) && NumberOp.keys().includes(clause.operatorKey);

Clause.isStringClause = (clause) =>
  !R.isNil(clause) && StringOp.keys().includes(clause.operatorKey);

Clause.passes = (clause) => (item) => {
  if (clause && item) {
    const compare = Resolver.compareFunction(clause.operatorKey);

    if (compare) {
      const value = item[clause.itemKey];

      return compare(value, clause.rhs, clause.rhs2);
    }
  }

  return false;
};

Object.freeze(Clause);

export default Clause;
