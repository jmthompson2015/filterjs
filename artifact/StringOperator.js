/* eslint no-console: ["error", { allow: ["error"] }] */

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

  const value = StringOperator.toString(lhs);

  if (rhs.includes("|")) {
    const parts = rhs.split("|");
    const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
    return R.reduce(reduceFunction, false, parts);
  }

  return myFunction(value, rhs);
};

const containsCompareFunction = (lhs, rhs) =>
  myCompareFunction(lhs, rhs, (value, r) => {
    const vv = StringOperator.toString(value);
    const rr = StringOperator.toString(r);

    return vv.includes(rr);
  });

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

StringOperator.toString = (item) => {
  let answer = item;

  if (item) {
    if (Array.isArray(item)) {
      const stringArray = R.map(StringOperator.toString, item);
      answer = stringArray.join(" ");
    } else {
      const type = typeof item;

      switch (type) {
        case "object":
          answer = R.toLower(Object.values(item).join(" "));
          break;
        case "boolean":
          answer = `${item}`;
          break;
        case "number":
          answer = `${item}`;
          break;
        case "string":
          answer = R.toLower(item);
          break;
        default:
          console.error(`Unknown item: ${item} type: ${type}`);
      }
    }
  }

  return answer;
};

StringOperator.keys = () => Object.keys(StringOperator.properties);

StringOperator.values = () => Object.values(StringOperator.properties);

Object.freeze(StringOperator);

export default StringOperator;
