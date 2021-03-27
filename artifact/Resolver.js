import BooleanOp from "./BooleanOperator.js";
import ClauseType from "./ClauseType.js";
import NumberOp from "./NumberOperator.js";
import StringOp from "./StringOperator.js";

const Resolver = {};

Resolver.booleanOperator = (operatorKey) => BooleanOp.properties[operatorKey];

Resolver.clauseType = (typeKey) => ClauseType.properties[typeKey];

Resolver.clauseTypeByOperator = (operatorKey) => {
  let answer = ClauseType.STRING;

  if (Resolver.booleanOperator(operatorKey)) {
    answer = ClauseType.BOOLEAN;
  } else if (Resolver.numberOperator(operatorKey)) {
    answer = ClauseType.NUMBER;
  }

  return answer;
};

Resolver.compareFunction = (operatorKey) =>
  Resolver.operator(operatorKey).compareFunction;

Resolver.numberOperator = (operatorKey) => NumberOp.properties[operatorKey];

Resolver.operator = (operatorKey) =>
  Resolver.booleanOperator(operatorKey) ||
  Resolver.numberOperator(operatorKey) ||
  Resolver.stringOperator(operatorKey);

Resolver.operatorType = (clauseTypeKey) => {
  let answer = StringOp;

  if (clauseTypeKey) {
    switch (clauseTypeKey) {
      case ClauseType.BOOLEAN:
        answer = BooleanOp;
        break;
      case ClauseType.NUMBER:
        answer = NumberOp;
        break;
      case ClauseType.STRING:
      default:
        answer = StringOp;
    }
  }

  return answer;
};

Resolver.stringOperator = (operatorKey) => StringOp.properties[operatorKey];

Object.freeze(Resolver);

export default Resolver;
