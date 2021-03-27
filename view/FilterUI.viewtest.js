/* eslint no-console: ["error", { allow: ["log"] }] */

import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "../state/Clause.js";
import Filter from "../state/Filter.js";

import FilterUI from "./FilterUI.js";

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
const onChange = (filter) => {
  console.log(`onChange() filter = ${JSON.stringify(filter)}`);
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
const clauses = [clause1, clause2, clause3, clause4];
const filter = Filter.create({ name: "Filter 1", clauses });

const element1 = React.createElement(FilterUI, {
  applyOnClick,
  onChange,
  removeOnClick,
  tableColumns: TableColumns,

  filter,
});
ReactDOM.render(element1, document.getElementById("panel1"));

const element2 = React.createElement(FilterUI, {
  applyOnClick,
  onChange,
  removeOnClick,
  tableColumns: TableColumns,
});
ReactDOM.render(element2, document.getElementById("panel2"));
