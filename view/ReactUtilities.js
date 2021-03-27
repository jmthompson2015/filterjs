const ReactUtilities = {};

ReactUtilities.createCell = (element, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className,
    style: {
      display: "table-cell",
    },
  });

  return ReactDOMFactories.div(newProps, element);
};

ReactUtilities.createRow = (cells, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className,
    style: {
      display: "table-row",
    },
  });

  return ReactDOMFactories.div(newProps, cells);
};

ReactUtilities.createTable = (rows, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className,
    style: {
      display: "table",
    },
  });

  return ReactDOMFactories.div(newProps, rows);
};

export default ReactUtilities;
