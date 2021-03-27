/* eslint no-console: ["error", { allow: ["log"] }] */

import BooleanOp from "../artifact/BooleanOperator.js";
import NumberOp from "../artifact/NumberOperator.js";
import StringOp from "../artifact/StringOperator.js";

import Clause from "../state/Clause.js";

import ClauseUI from "./ClauseUI.js";

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

const onChange = (newClause, index) => {
  console.log(
    `onChange() newClause = ${JSON.stringify(newClause)} index = ${index}`
  );
};

const clause1 = Clause.create({
  itemKey: "liked",
  operatorKey: BooleanOp.IS_TRUE,
});
const element1 = React.createElement(ClauseUI, {
  clause: clause1,
  index: 1,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element1, document.getElementById("panel1"));

const clause2 = Clause.create({
  itemKey: "red",
  operatorKey: NumberOp.IS_GREATER_THAN,
  rhs: 50,
});
const element2 = React.createElement(ClauseUI, {
  clause: clause2,
  index: 2,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element2, document.getElementById("panel2"));

const clause3 = Clause.create({
  itemKey: "name",
  operatorKey: StringOp.CONTAINS,
  rhs: "e",
});
const element3 = React.createElement(ClauseUI, {
  clause: clause3,
  index: 3,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element3, document.getElementById("panel3"));
