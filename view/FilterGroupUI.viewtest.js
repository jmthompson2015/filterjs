/* eslint no-console: ["error", { allow: ["log"] }] */

import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "../state/Clause.js";
import Filter from "../state/Filter.js";
import FilterGroup from "../state/FilterGroup.js";

import FilterGroupUI from "./FilterGroupUI.js";

const TableColumns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "red",
    label: "Red",
    type: "number",
  },
  {
    key: "green",
    label: "Green",
    type: "number",
  },
  {
    key: "blue",
    label: "Blue",
    type: "number",
  },
  {
    key: "liked",
    label: "Liked",
    type: "boolean",
  },
];

const applyOnClick = () => {
  console.log(`applyOnClick()`);
};
const onChange = (filterGroup) => {
  console.log(`onChange() filterGroup = ${JSON.stringify(filterGroup)}`);
};
const removeOnClick = () => {
  console.log("removeOnClick()");
};

const clause1 = Clause.create({
  itemKey: "name",
  operatorKey: StringOp.CONTAINS,
  rhs: "ed",
});
const clause2 = Clause.create({
  itemKey: "red",
  operatorKey: NumberOp.IS_GREATER_THAN,
  rhs: 100,
});
const clause3 = Clause.create({
  itemKey: "green",
  operatorKey: NumberOp.IS_IN_THE_RANGE,
  rhs: 50,
  rhs2: 255,
});
const clause4 = Clause.create({
  itemKey: "liked",
  operatorKey: BooleanOp.IS_FALSE,
});
const clauses1 = [clause1, clause2, clause3, clause4];
const filter1 = Filter.create({ name: "Filter 1", clauses: clauses1 });

const clause5 = Clause.create({
  itemKey: "red",
  operatorKey: NumberOp.IS,
  rhs: 255,
});
const clause6 = Clause.create({
  itemKey: "green",
  operatorKey: NumberOp.IS,
  rhs: 255,
});
const clauses2 = [clause5, clause6];
const filter2 = Filter.create({ name: "Filter 2", clauses: clauses2 });
const initialFilterGroup = FilterGroup.create({ filters: [filter1, filter2] });

const element = React.createElement(FilterGroupUI, {
  applyOnClick,
  onChange,
  removeOnClick,
  tableColumns: TableColumns,

  initialFilterGroup,
});
ReactDOM.render(element, document.getElementById("panel"));
