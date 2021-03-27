const BooleanOperator = {
  IS_TRUE: "boIsTrue",
  IS_FALSE: "boIsFalse",
};

BooleanOperator.properties = {
  boIsTrue: {
    label: "is true",
    compareFunction: (lhs) => lhs === true,
    key: "boIsTrue",
  },
  boIsFalse: {
    label: "is false",
    compareFunction: (lhs) => lhs === false,
    key: "boIsFalse",
  },
};

BooleanOperator.keys = () => Object.keys(BooleanOperator.properties);

BooleanOperator.values = () => Object.values(BooleanOperator.properties);

Object.freeze(BooleanOperator);

export default BooleanOperator;
