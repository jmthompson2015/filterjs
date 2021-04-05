import BooleanOperator from "./artifact/BooleanOperator.js";
import ClauseType from "./artifact/ClauseType.js";
import NumberOperator from "./artifact/NumberOperator.js";
import StringOperator from "./artifact/StringOperator.js";

import Clause from "./state/Clause.js";
import Filter from "./state/Filter.js";
import FilterGroup from "./state/FilterGroup.js";

import FilterUI from "./view/FilterUI.js";
import FilterGroupUI from "./view/FilterGroupUI.js";

class FilterJS {}

FilterJS.BooleanOperator = BooleanOperator;
FilterJS.ClauseType = ClauseType;
FilterJS.NumberOperator = NumberOperator;
FilterJS.StringOperator = StringOperator;

FilterJS.Clause = Clause;
FilterJS.Filter = Filter;
FilterJS.FilterGroup = FilterGroup;

FilterJS.FilterUI = FilterUI;
FilterJS.FilterGroupUI = FilterGroupUI;

export default FilterJS;
