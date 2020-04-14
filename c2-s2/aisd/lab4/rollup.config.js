import path from "path";

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import externals from "rollup-plugin-node-externals";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.PRODUCTION === "true";
const outputDir = isProduction === true ? "dist/package" : "dist/debug";

const plugins = [
  externals({ deps: true }),
  resolve({ jsnext: true }),
  commonjs(),
].concat(isProduction ? [
  terser()
] : []);

export default {
  input: "./src/app.js",
  plugins,
  output: [
    {
      strict: false,
      file: path.join(outputDir, "bundle.js"),
      format: "cjs",
      sourcemap: isProduction === false
    }
  ]
};
