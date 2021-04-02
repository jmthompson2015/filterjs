import Filter from "./Filter.js";

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

export default FilterGroup;
