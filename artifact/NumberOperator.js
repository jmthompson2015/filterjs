const NumberOperator = {
  IS: "noIs",
  IS_NOT: "noIsNot",
  IS_GREATER_THAN: "noIsGreaterThan",
  IS_LESS_THAN: "noIsLessThan",
  IS_IN_THE_RANGE: "noIsInTheRange",
};

NumberOperator.properties = {
  noIs: {
    label: "is",
    compareFunction: (lhs, rhs) => lhs === rhs,
    key: "noIs",
  },
  noIsNot: {
    label: "is not",
    compareFunction: (lhs, rhs) => lhs !== rhs,
    key: "noIsNot",
  },
  noIsGreaterThan: {
    label: "is greater than",
    compareFunction: (lhs, rhs) => lhs > rhs,
    key: "noIsGreaterThan",
  },
  noIsLessThan: {
    label: "is less than",
    compareFunction: (lhs, rhs) => lhs < rhs,
    key: "noIsLessThan",
  },
  noIsInTheRange: {
    label: "is in the range",
    compareFunction: (lhs, min, max) => min <= lhs && lhs <= max,
    key: "noIsInTheRange",
  },
};

NumberOperator.keys = () => Object.keys(NumberOperator.properties);

NumberOperator.values = () => Object.values(NumberOperator.properties);

Object.freeze(NumberOperator);

export default NumberOperator;
