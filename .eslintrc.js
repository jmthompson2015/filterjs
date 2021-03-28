module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "prettier"],
  globals: {
    FilterJS: true,
    Immutable: true,
    PropTypes: true,
    QUnit: true,
    R: true,
    React: true,
    Reactable: true,
    ReactComponent: true,
    ReactDOM: true,
    ReactDOMFactories: true,
  },
  rules: {
    "import/extensions": ["error", { js: "always" }],
    "max-len": ["error", { code: 100, ignoreUrls: true }],
  },
};
