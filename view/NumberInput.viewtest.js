/* eslint no-console: ["error", { allow: ["log"] }] */

import NumberInput from "./NumberInput.js";

const myOnBlur = (value) => {
  console.log(`myOnBlur() value = ${value} ${typeof value}`);
};

const element = React.createElement(NumberInput, {
  id: "boardGameRankmaxValue",
  onBlur: myOnBlur,
  className: "filterField",
  initialValue: 5,
  max: 100,
  min: 0,
  step: 5,
});
ReactDOM.render(element, document.getElementById("panel"));
