import BooleanOp from "../artifact/BooleanOperator.js";
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
