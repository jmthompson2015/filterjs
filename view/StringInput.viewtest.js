/* eslint no-console: ["error", { allow: ["log"] }] */

import StringInput from "./StringInput.js";

const myOnBlur = (value) => {
  console.log(`myOnBlur() value = ${value}`);
};

const element = React.createElement(StringInput, {
  id: "boardGameRankmaxValue",
  onBlur: myOnBlur,
  className: "filterField",
  initialValue: "five",
});
ReactDOM.render(element, document.getElementById("panel"));
