import BooleanOperator from "./artifact/BooleanOperator.js";
import NumberOperator from "./artifact/NumberOperator.js";
import StringOperator from "./artifact/StringOperator.js";

import Clause from "./state/Clause.js";
import Filter from "./state/Filter.js";

import FilterUI from "./view/FilterUI.js";

class FilterJS {}

FilterJS.BooleanOperator = BooleanOperator;
FilterJS.NumberOperator = NumberOperator;
FilterJS.StringOperator = StringOperator;

FilterJS.Clause = Clause;
FilterJS.Filter = Filter;

FilterJS.FilterUI = FilterUI;

export default FilterJS;
