const StringOperator = {
  CONTAINS: "soContains",
  DOES_NOT_CONTAIN: "soDoesNotContain",
  IS: "soIs",
  IS_NOT: "soIsNot",
  BEGINS_WITH: "soBeginsWith",
  ENDS_WITH: "soEndsWith",
};

const myCompareFunction = (lhs, rhs, myFunction) => {
  if (R.isNil(lhs) || R.isNil(rhs)) return false;

  const value = Array.isArray(lhs) ? lhs.join(" ") : lhs;

  if (rhs.includes("|")) {
    const parts = rhs.split("|");
    const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
    return R.reduce(reduceFunction, false, parts);
  }

  return myFunction(value, rhs);
};

const containsCompareFunction = (lhs, rhs) =>
  myCompareFunction(lhs, rhs, (value, r) =>
    R.toLower(value).includes(R.toLower(r))
  );

const isCompareFunction = (lhs, rhs) =>
  myCompareFunction(lhs, rhs, (value, r) => value === r);

StringOperator.properties = {
  soContains: {
    label: "contains",
    compareFunction: containsCompareFunction,
    key: "soContains",
  },
  soDoesNotContain: {
    label: "does not contain",
    compareFunction: (lhs, rhs) => !containsCompareFunction(lhs, rhs),
    key: "soDoesNotContain",
  },
  soIs: {
    label: "is",
    compareFunction: isCompareFunction,
    key: "soIs",
  },
  soIsNot: {
    label: "is not",
    compareFunction: (lhs, rhs) => !isCompareFunction(lhs, rhs),
    key: "soIsNot",
  },
  soBeginsWith: {
    label: "begins with",
    compareFunction: (lhs, rhs) =>
      myCompareFunction(lhs, rhs, (value, r) => value.startsWith(r)),
    key: "soBeginsWith",
  },
  soEndsWith: {
    label: "ends with",
    compareFunction: (lhs, rhs) =>
      myCompareFunction(lhs, rhs, (value, r) => value.endsWith(r)),
    key: "soEndsWith",
  },
};

StringOperator.keys = () => Object.keys(StringOperator.properties);

StringOperator.values = () => Object.values(StringOperator.properties);

Object.freeze(StringOperator);

export default StringOperator;
