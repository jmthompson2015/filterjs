const TableColumnUtilities = {};

TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
  const columns = R.filter((c) => c.key === columnKey, tableColumns);

  return columns.length > 0 ? columns[0] : undefined;
};

Object.freeze(TableColumnUtilities);

export default TableColumnUtilities;
