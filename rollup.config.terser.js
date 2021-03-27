const { terser } = require("rollup-plugin-terser");

export default {
  input: "FilterJS.js",
  output: {
    file: "./dist/filterjs.min.js",
    format: "umd",
    name: "FilterJS",
  },
  plugins: [terser()],
};
