const ClauseType = {
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
};

ClauseType.properties = {
  boolean: {
    name: "Boolean",
    key: "boolean",
  },
  number: {
    name: "Number",
    key: "number",
  },
  string: {
    name: "String",
    key: "string",
  },
};

ClauseType.keys = () => Object.keys(ClauseType.properties);

ClauseType.values = () => Object.values(ClauseType.properties);

Object.freeze(ClauseType);

export default ClauseType;
