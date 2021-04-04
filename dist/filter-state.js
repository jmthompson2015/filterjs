(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FilterJS = factory());
}(this, (function () { 'use strict';

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

      return vv ? vv.includes(rr) : false;
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

  const ClauseType = {
    BOOLEAN: "boolean",
    NUMBER: "number",
    STRING: "string",
  };

  ClauseType.properties = {
    boolean: {
      name: "Boolean",
      key: "boolean",
    },
    number: {
      name: "Number",
      key: "number",
    },
    string: {
      name: "String",
      key: "string",
    },
  };

  ClauseType.keys = () => Object.keys(ClauseType.properties);

  ClauseType.values = () => Object.values(ClauseType.properties);

  Object.freeze(ClauseType);

  const Resolver = {};

  Resolver.booleanOperator = (operatorKey) => BooleanOperator.properties[operatorKey];

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

  Resolver.numberOperator = (operatorKey) => NumberOperator.properties[operatorKey];

  Resolver.operator = (operatorKey) =>
    Resolver.booleanOperator(operatorKey) ||
    Resolver.numberOperator(operatorKey) ||
    Resolver.stringOperator(operatorKey);

  Resolver.operatorType = (clauseTypeKey) => {
    let answer = StringOperator;

    if (clauseTypeKey) {
      switch (clauseTypeKey) {
        case ClauseType.BOOLEAN:
          answer = BooleanOperator;
          break;
        case ClauseType.NUMBER:
          answer = NumberOperator;
          break;
        case ClauseType.STRING:
        default:
          answer = StringOperator;
      }
    }

    return answer;
  };

  Resolver.stringOperator = (operatorKey) => StringOperator.properties[operatorKey];

  Object.freeze(Resolver);

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
            operatorKey: Object.keys(BooleanOperator.properties)[0],
          });
          break;
        case ClauseType.NUMBER:
          answer = Clause.create({
            itemKey,
            operatorKey: Object.keys(NumberOperator.properties)[0],
            rhs: 0,
          });
          break;
        case ClauseType.STRING:
        case undefined:
          answer = Clause.create({
            itemKey,
            operatorKey: Object.keys(StringOperator.properties)[0],
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
    !R.isNil(clause) && BooleanOperator.keys().includes(clause.operatorKey);

  Clause.isNumberClause = (clause) =>
    !R.isNil(clause) && NumberOperator.keys().includes(clause.operatorKey);

  Clause.isStringClause = (clause) =>
    !R.isNil(clause) && StringOperator.keys().includes(clause.operatorKey);

  Clause.passes = (clause, item) => {
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

  const Filter = {};

  Filter.create = ({ name = "Filter", clauses = [] }) =>
    Immutable({ name, clauses });

  Filter.default = (tableColumns, index = 1) => {
    const filterFunction = (column) =>
      [undefined, "true", true].includes(column.isShown);
    const myTableColumns = R.filter(filterFunction, tableColumns);
    const tableColumn =
      myTableColumns && myTableColumns.length > 0 ? myTableColumns[0] : undefined;
    const clause = Clause.default(tableColumn.key, tableColumn.type);
    const clauses = clause ? [clause] : [];

    return Filter.create({ name: `Filter ${index}`, clauses });
  };

  Filter.passes = (filter, item) => {
    if (filter && item) {
      const reduceFunction = (accum, clause) =>
        accum && Clause.passes(clause, item);

      return R.reduce(reduceFunction, true, filter.clauses);
    }

    return false;
  };

  Object.freeze(Filter);

  const FilterGroup = {};

  FilterGroup.create = ({ filters = [], selectedIndex }) => {
    let index = 0;

    if (
      Number.isInteger(selectedIndex) &&
      selectedIndex >= 0 &&
      selectedIndex < filters.length
    ) {
      index = selectedIndex;
    }

    return Immutable({ filters, selectedIndex: index });
  };

  FilterGroup.default = (tableColumns) => {
    const filter = Filter.default(tableColumns);
    const filters = [filter];

    return FilterGroup.create({ filters });
  };

  FilterGroup.selectedFilter = (filterGroup) => {
    let answer;

    if (filterGroup) {
      const { filters, selectedIndex } = filterGroup;
      answer = filters[selectedIndex];
    }

    return answer;
  };

  Object.freeze(FilterGroup);

  class FilterState {}

  FilterState.BooleanOperator = BooleanOperator;
  FilterState.NumberOperator = NumberOperator;
  FilterState.StringOperator = StringOperator;

  FilterState.Clause = Clause;
  FilterState.Filter = Filter;
  FilterState.FilterGroup = FilterGroup;

  return FilterState;

})));
