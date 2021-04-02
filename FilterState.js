import BooleanOperator from "./artifact/BooleanOperator.js";
import NumberOperator from "./artifact/NumberOperator.js";
import StringOperator from "./artifact/StringOperator.js";

import Clause from "./state/Clause.js";
import Filter from "./state/Filter.js";
import FilterGroup from "./state/FilterGroup.js";

class FilterState {}

FilterState.BooleanOperator = BooleanOperator;
FilterState.NumberOperator = NumberOperator;
FilterState.StringOperator = StringOperator;

FilterState.Clause = Clause;
FilterState.Filter = Filter;
FilterState.FilterGroup = FilterGroup;

export default FilterState;
